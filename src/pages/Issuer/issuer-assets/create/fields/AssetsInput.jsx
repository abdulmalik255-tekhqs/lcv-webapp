import clsx from "clsx";
import { useMemo, useState } from "react";

const AssetsInput = ({
  label,
  hint,
  error,
  required = false,
  type = "text",
  className,
  inputClassName,
  id,
  placeholder,
  description,
  maxLength,
  showCharCount = false,
  onFieldFocus,
  prefix,
  suffix,
  inputType = "text", // "text" or "number"
  ...rest
}) => {
  const inputId = id ?? rest?.name;
  const [displayValue, setDisplayValue] = useState("");
  const [suffixPosition, setSuffixPosition] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  const value = rest?.value;
  const hasValue =
    value !== undefined && value !== null && String(value).trim() !== "";

  // Validate maxLength for text-based inputs
  const textBasedTypes = ["text", "email", "password", "tel", "url", "search"];
  const isTextBasedInput = textBasedTypes.includes(type);
  
  // Check if value exceeds maxLength (allow typing beyond limit to show error)
  const maxLengthError = useMemo(() => {
    if (!maxLength || !isTextBasedInput) return null;
    const strValue = String(value || "");
    if (strValue.length > maxLength) {
      return `Maximum ${maxLength} characters allowed. You have entered ${strValue.length} characters.`;
    }
    return null;
  }, [value, maxLength, isTextBasedInput]);

  // Combine external error with maxLength validation error (maxLength takes precedence)
  const displayError = maxLengthError || error;

  // Determine if we should show character count (only for text-based inputs with maxLength, not for number)
  const shouldShowCharCount = showCharCount && maxLength && isTextBasedInput;

  // Format number with commas (e.g., 123456 -> 1,23,456)
  const formatNumber = (num) => {
    if (!num) return "";
    const cleanNum = num.toString().replace(/,/g, "");
    return cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

 

  // Handle change for number inputs with formatting
  const handleChange = (e) => {
    const inputValue = e.target.value;

    if (inputType === "number") {
      // Allow only digits and commas
      const cleanValue = inputValue.replace(/[^0-9]/g, "");
      
      // Format with commas
      const formattedValue = formatNumber(cleanValue);
      
      // Update display value
      setDisplayValue(formattedValue);
      
      // Pass raw number to parent
      if (rest.onChange) {
        rest.onChange({
          ...e,
          target: {
            ...e.target,
            name: rest.name,
            value: cleanValue,
          },
        });
      }
    } else {
      // For text inputs, pass as-is
      if (rest.onChange) {
        rest.onChange(e);
      }
    }
  };

  // Sync display value with prop value and calculate suffix position
  useMemo(() => {
    if (inputType === "number" && value) {
      setDisplayValue(formatNumber(value));
    } else {
      setDisplayValue(value || "");
    }

    // Calculate suffix position based on text width
    if (suffix && hasValue) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.font = '16px sans-serif'; // Match input font
      const textWidth = context.measureText(inputType === "number" ? formatNumber(value) : value).width;
      const paddingLeft = prefix ? 32 : 16; // pl-8 = 32px, pl-4 = 16px
      setSuffixPosition(paddingLeft + textWidth + 4); // 4px gap
    }
  }, [value, inputType, suffix, hasValue, prefix]);

  // Remove maxLength, onFocus, and onBlur from input props
  const { maxLength: _maxLengthInRest, onFocus: existingOnFocus, onChange: _onChange, value: _value, onBlur: _onBlur, ...inputProps } = rest;

  // Handle focus - mark field as touched and call existing onFocus if provided
  const handleFocus = (e) => {
    setIsFocused(true);
    const fieldName = rest?.name;
    if (fieldName && onFieldFocus) {
      onFieldFocus(fieldName);
    }
    if (existingOnFocus) {
      existingOnFocus(e);
    }
  };

  // Handle blur - track when field loses focus
  const handleBlur = (e) => {
    setIsFocused(false);
    if (rest.onBlur) {
      rest.onBlur(e);
    }
  };

  return (
    <div
      className={clsx(
        "flex w-full flex-col gap-1 text-sm font-medium !text-[#000]",
        className
      )}
    >
      <div className="relative">
        {/* Gradient Border Wrapper - shows on focus */}
        <div
          className={clsx(
            "rounded-lg transition-all duration-200",
            // Show gradient border on focus (when not in error state)
            isFocused && !displayError ? "p-[2px]" : "p-0"
          )}
          style={
            isFocused && !displayError
              ? {
                  background:
                    "linear-gradient(313.7deg, #0D4BEF 1.18%, #1A26E7 49.57%, #7D0BF4 98.94%)",
                }
              : {}
          }
        >
          {/* Input Field */}
          <input
            id={inputId}
            type={type}
            placeholder={placeholder || " "}
            value={inputType === "number" ? displayValue : value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={clsx(
              "peer block w-full h-[58px] rounded-lg text-base !text-[#000] outline-none",
              prefix && hasValue ? "pl-8" : "pl-4",
              "pr-4",
              "focus:ring-0",
              "border-2 transition-colors",
              // Default border state
              !displayError && !isFocused && "border-[#E5E5EA]",
              // Focus state - remove border when gradient wrapper is showing
              isFocused && !displayError && "border-transparent",
              // Error state
              displayError && "border-rose-500",
              // Always white background - override autofill
              "bg-white !bg-white",
              placeholder && "!text-[#000] !top-0",
              inputClassName
            )}
            style={{
              backgroundColor: "white",
              background: "white",
              boxShadow: "0 0 0 1000px white inset",
            }}
            {...inputProps}
          />
        </div>

        {/* Prefix - only show when field has value */}
        {prefix && hasValue && (
          <span className="absolute left-4 top-[30px] -translate-y-1/2 text-base text-[#000] font-medium pointer-events-none z-10">
            {prefix}
          </span>
        )}

        {/* Suffix - positioned right after value */}
        {suffix && hasValue && (
          <span 
            className="absolute top-[30px] ml-3 -translate-y-1/2 text-base text-[#000] font-medium pointer-events-none"
            style={{ left: `${suffixPosition}px` }}
          >
            {suffix}
          </span>
        )}

        {/* Floating Label - Hide if placeholder exists and field is empty and not focused */}
        {label && (!placeholder || hasValue || isFocused) && (
          <label
            className={clsx(
              "absolute bg-white px-1 transition-all duration-150 ease-out text-sm select-none pointer-events-none",
              prefix ? "left-8" : "left-4",
              // Default: center vertically when no value and no placeholder
              !hasValue && !placeholder && "top-1/2 -translate-y-1/2 text-base !text-[#48484A]",
              // Float UP when field has value or is focused
              (hasValue || isFocused) &&
                "top-0 -translate-y-1/2 text-xs !text-[#000] !bg-white",
              // Float UP on focus when no value and no placeholder
              !hasValue && !placeholder && isFocused && "peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:!text-[#000]",
              // Error state
              displayError && "text-red-500",
              placeholder && "!top-0 !text-[#000]",
            )}
          >
            {label}
          </label>
        )}

        {/* Right side indicators container */}
        <div className={clsx(
          "absolute -translate-y-1/2 top-[33px] flex items-center gap-2 pointer-events-none",
          suffix ? "right-16" : "right-4"
        )}>
          {/* Character Count - show when enabled */}
        

          {/* Required Label - Only show when required, not filled, and no char count shown */}
          {required && !hasValue && !shouldShowCharCount && !suffix && (
            <span className="bg-white !text-[#48484A] px-1 text-xs peer-focus:hidden">
              {/* Required */}
            </span>
          )}
        </div>
      </div>

      {/* Description text below input */}
      {description && !displayError && (
        <span className="text-[13px] text-[#48484A] font-normal mt-0.5">
          {description}
        </span>
      )}

      {/* Error Message - shows maxLength error first, then prop error */}
      {displayError && (
        <span className="text-xs font-medium text-red-500 mt-0.5 flex items-center gap-1">
          {displayError}
        </span>
      )}

      {/* Hint - Only show when no error */}
      {hint && !displayError && (
        <span className="text-xs text-[#48484A] mt-0.5">{hint}</span>
      )}
    </div>
  );
};

export default AssetsInput;
