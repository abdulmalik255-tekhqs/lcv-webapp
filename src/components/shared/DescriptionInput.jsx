import clsx from "clsx";
import { useMemo } from "react";

/**
 * DescriptionInput - A reusable textarea component with floating label, character count, validation, and required indicator
 *
 * @param {string} name - Input name attribute
 * @param {string} value - Input value
 * @param {function} onChange - Change handler function
 * @param {string} label - Label text (default: "Description")
 * @param {number} maxLength - Maximum character length (default: 500)
 * @param {number} rows - Number of rows for textarea (default: 4)
 * @param {boolean} required - Show required indicator (default: true)
 * @param {string} error - Error message to display
 * @param {string} className - Additional CSS classes
 * @param {object} style - Additional inline styles
 * @param {string} placeholder - Placeholder text (default: " ")
 * @param {boolean} disabled - Disable input
 * @param {string} hint - Hint text to display below the input
 * @param {object} ...rest - Other textarea props
 */
function DescriptionInput({
  name,
  value,
  onChange,
  label = "Description",
  maxLength = 500,
  rows = 4,
  required = true,
  error,
  className = "",
  style = {},
  placeholder = " ",
  disabled = false,
  hint = "",
  ...rest
}) {
  const currentLength = value?.length || 0;
  const isEmpty = !value || value.trim() === "";

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

  // Character count warning (when approaching or exceeding limit)
  const exceedsLimit = currentLength > maxLength;

  // Remove maxLength from textarea props to prevent HTML attribute from blocking input
  // We handle validation ourselves to show error message instead
  const { maxLength: _maxLengthInRest, ...textareaProps } = rest;

  return (
    <div className="flex w-full flex-col gap-1">
      <div className="relative">
        <textarea
          name={name}
          value={value || ""}
          onChange={onChange}
          rows={rows}
          disabled={disabled}
          className={clsx(
            "peer block w-full rounded-lg px-4 text-base font-medium !text-[#000] outline-none pt-5 pb-8 focus:ring-0 border transition-colors resize-none bg-white",
            // Default border state
            !displayError && "border-[#E5E5EA] focus:outline-none focus:ring-2 focus:ring-[#0734A9] focus:border-[#0734A9]",
            // Error state
            displayError && "border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          placeholder={placeholder}
          style={{
            backgroundColor: "white",
            background: "white",
            ...style,
          }}
          {...textareaProps}
        />
        {/* Floating Label */}
        <span
          className={clsx(
            "absolute left-4 bg-white px-1 transition-all duration-150 ease-out text-sm select-none pointer-events-none",
            isEmpty && "top-[18px] !text-[#000]",
            "peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-[#131DBB]",
            !isEmpty && "top-0 -translate-y-1/2 text-xs text-[#0066ff] !bg-white",
            // Error state
            displayError && "text-red-500"
          )}
        >
          {label}
        </span>
        {/* Right side indicators */}
        <div className="absolute right-4 bottom-2 flex items-center gap-2 pointer-events-none">
          {/* Character count - show current/max */}
          {maxLength && (
            <span
              className={clsx(
                "bg-white px-1 text-xs transition-colors",
                exceedsLimit || displayError
                  ? "text-red-500 font-semibold"
                  : currentLength > maxLength * 0.8
                  ? "text-amber-500"
                  : "text-[#000]"
              )}
            >
              {currentLength}/{maxLength}
            </span>
          )}
          {/* Required label - Only show when required, empty, and no error */}
          {required && isEmpty && !displayError && (
            <span className="bg-white !text-[#48484A] px-1 text-xs peer-focus:hidden">
              {/* Required */}
            </span>
          )}
        </div>
      </div>
      {/* Error Message */}
      {displayError && (
        <span className="text-xs font-medium text-red-500 mt-0.5 flex items-center gap-1">
          {displayError}
        </span>
      )}
      {/* Hint text - Only show when no error */}
      {hint && !displayError && (
        <p className="text-xs text-[#48484A] mt-0.5">
          {hint}
        </p>
      )}
    </div>
  );
}

export default DescriptionInput;
