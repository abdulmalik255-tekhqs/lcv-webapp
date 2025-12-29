import clsx from "clsx";
import { useState, useMemo } from "react";

const AssetsTextarea = ({
  label,
  hint,
  error,
  required = false,
  className,
  textareaClassName,
  id,
  placeholder,
  description,
  maxLength,
  showCharCount = false,
  rows = 4,
  onFieldFocus,
  ...rest
}) => {
  const textareaId = id ?? rest?.name;
  const [isFocused, setIsFocused] = useState(false);

  const value = rest?.value;
  const hasValue =
    value !== undefined && value !== null && String(value).trim() !== "";

  // Check if value exceeds maxLength (allow typing beyond limit to show error)
  const maxLengthError = useMemo(() => {
    if (!maxLength) return null;
    const strValue = String(value || "");
    if (strValue.length > maxLength) {
      return `Maximum ${maxLength} characters allowed. You have entered ${strValue.length} characters.`;
    }
    return null;
  }, [value, maxLength]);

  // Combine external error with maxLength validation error (maxLength takes precedence)
  const displayError = maxLengthError || error;

  // Determine if we should show character count
  const shouldShowCharCount = showCharCount && maxLength;
  
  // Calculate remaining characters (can be negative)
  const remainingChars = maxLength ? maxLength - (value?.length || 0) : null;
  const isOverLimit = remainingChars !== null && remainingChars < 0;

  // Extract handlers while keeping them accessible
  const {
    onFocus: existingOnFocus,
    onBlur: existingOnBlur,
    onChange,
    name,
    ...textareaProps
  } = rest;

  // Handle focus - mark field as touched and call existing onFocus if provided
  const handleFocus = (e) => {
    setIsFocused(true);
    if (name && onFieldFocus) {
      onFieldFocus(name);
    }
    if (existingOnFocus) {
      existingOnFocus(e);
    }
  };

  // Handle blur - track when field loses focus
  const handleBlur = (e) => {
    setIsFocused(false);
    if (existingOnBlur) {
      existingOnBlur(e);
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
          {/* Textarea Field */}
          <textarea
            id={textareaId}
            name={name}
            placeholder={placeholder || " "}
            value={value || ""}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            rows={rows}
            className={clsx(
              "block w-full rounded-lg px-4 text-base font-medium !text-[#000] outline-none pt-5 pb-8 border-2 resize-none bg-white transition-colors",
              // Default border state
              !displayError && !isFocused && "border-[#E5E5EA]",
              // Focus state - remove border when gradient wrapper is showing (only when no error)
              isFocused && !displayError && "border-transparent",
              // Error state - always show red border
              displayError && "border-rose-500",
              textareaClassName,
              placeholder && "!text-[#48484A]"
            )}
            style={{
              backgroundColor: "white",
              background: "white",
            }}
            {...textareaProps}
          />
        </div>

        {/* Floating Label - always show when label prop is provided */}
        {label && (
          <label
            className={clsx(
              "absolute left-4 bg-white px-1 transition-all duration-150 ease-out text-sm select-none pointer-events-none",
              // Default state: centered when no value and not focused
              !hasValue && !isFocused && "top-[18px]",
              // Float up when field has value or is focused
              (hasValue || isFocused) && "top-0 -translate-y-1/2 text-xs !bg-white ",
              // Color logic: error > focus > default
              displayError
                ? "!text-red-500"
                : isFocused
                ? "!text-[#000]"
                : "!text-[#48484A]"
            )}
          >
            {label}
          </label>
        )}

        {/* Character Count - bottom right */}
        {shouldShowCharCount && (
          <span
            className={clsx(
              "absolute bottom-2 right-4 text-xs pointer-events-none",
              isOverLimit ? "text-red-500" : "text-[#000]"
            )}
          >
            {remainingChars}
          </span>
        )}

        {/* Required Label - top right when no char count */}
        {required && !hasValue && !shouldShowCharCount && !isFocused && !displayError && (
          <span className="absolute top-1/4 right-4 -translate-y-1/2 bg-white !text-[#48484A] px-1 text-xs pointer-events-none">
            Required
          </span>
        )}
      </div>

      {/* Description text below textarea */}
      {description && !displayError && (
        <span className="text-[13px] text-[#48484A] font-normal mt-0.5">
          {description}
        </span>
      )}

      {/* Error Message */}
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

export default AssetsTextarea;

