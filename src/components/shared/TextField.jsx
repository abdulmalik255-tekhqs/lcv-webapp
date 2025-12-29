import clsx from "clsx";
import { useState } from "react";
import { FiEyeOff } from "react-icons/fi";
import { FaEye } from "react-icons/fa6";

const TextField = ({
  label,
  hint,
  error,
  required = false,
  type = "text",
  hideLabel = false,
  className,
  inputClassName,
  clearButton,
  onClear,
  showPasswordToggle = false,
  id,
  placeholder,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasFloatingLabel = hideLabel;
  const inputId = id ?? rest?.name;
  const isPasswordType = type === "password";
  const currentType = isPasswordType && showPassword ? "text" : type;

  const value = rest?.value;
  const hasValue =
    value !== undefined && value !== null && String(value).trim() !== "";

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className={clsx(
        "flex w-full flex-col gap-1 text-sm font-medium !text-[#000]",
        className
      )}
    >
      {/* Standard label if floating disabled */}
      {label && !hideLabel && (
        <label htmlFor={inputId} className="text-sm font-medium !text-[#000]">
          {label} {required && ""}
        </label>
      )}

      <div className="relative">
        {/* ====== OUTER BORDER WITH NOTCH ====== */}
        <div
          className={clsx(
            "absolute inset-0 pointer-events-none rounded-[6px] border transition-all duration-200",

            // Default gray border when not focused (with or without value)
            !error && !isFocused && "border-[#AEAEB2]",

            // Purple border ONLY when focused (active)
            !error &&
              isFocused &&
              "border outline outline-[#7D0BF4] outline-[2px]",

            // Error state
            error && "border-rose-500"
          )}
        />

        {/* ====== INPUT FIELD ====== */}
        <input
          id={inputId}
          type={currentType}
          placeholder=" "
          className={clsx(
            "peer block w-full rounded-lg px-4 text-base !text-[#000] outline-none",
            "pt-5 pb-2",
            "focus:ring-0",
            "bg-white",
            hasValue && "!bg-white input-filled-white",
            (showPasswordToggle || clearButton) && "pr-10", // Add padding for buttons
            inputClassName
          )}
          style={{
            backgroundColor: "white",
            background: "white",
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />

        {/* ====== FLOATING LABEL ====== */}
        {hasFloatingLabel && (
          <label
            htmlFor={inputId}
            className={clsx(
              "absolute left-4 bg-white !text-[#000] px-1 transition-all duration-150 ease-out text-sm select-none",

              // Default: center vertically
              !hasValue && "top-1/2 -translate-y-1/2 !text-[#000]",

              // Float UP on focus
              "peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-blue-400",

              // Stay UP when filled
              hasValue &&
                "top-0 -translate-y-1/2 text-xs text-[#0066ff] !bg-white",

              // Error state
              error && "text-red-500 "
            )}
          >
            {label}
            {required && " "}
          </label>
        )}

        {/* ====== PASSWORD TOGGLE BUTTON ====== */}
        {showPasswordToggle && isPasswordType && (
          <button
            type="button"
            onClick={handleTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <FiEyeOff className="h-5 w-5" />
            ) : (
              <FaEye className="h-5 w-5" />
            )}
          </button>
        )}

        {/* ====== CLEAR BUTTON ====== */}
        {clearButton && onClear && !(showPasswordToggle && isPasswordType) && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
          >
            {clearButton}
          </button>
        )}
      </div>

      {/* Hint / Error */}
      {error && (
        <span className="text-xs font-medium text-red-500">{error}</span>
      )}
      {hint && !error && <span className="text-xs text-[#000]">{hint}</span>}
    </div>
  );
};

export default TextField;
