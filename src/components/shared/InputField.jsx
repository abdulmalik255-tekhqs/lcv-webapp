import clsx from "clsx";
import { useState } from "react";

const InputField = ({
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
  id,
  placeholder,
  floatingLabelColor = "#636366", // default to #000
  floatedLabelColor = "#000", // default floated color
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const hasFloatingLabel = hideLabel;
  const inputId = id ?? rest?.name;

  const value = rest?.value;
  const hasValue =
    value !== undefined && value !== null && String(value).trim() !== "";

  return (
    <div
      className={clsx(
        "flex w-full flex-col gap-1 text-sm  font-medium !text-[#000]",
        className
      )}
    >
      {/* Standard label if floating disabled */}
      {label && !hideLabel && (
        <label htmlFor={inputId} className="text-sm  font-medium !text-[#000]">
          {label} {required && ""}
        </label>
      )}

      <div className="relative">
        {/* ====== OUTER BORDER WITH NOTCH ====== */}
        <div
          className={clsx(
            "absolute inset-0 pointer-events-none !h-[58px] rounded-[6px] border transition-all duration-200",

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
          type={type}
          placeholder=" "
          className={clsx(
            "peer block w-full rounded-lg px-4 text-base !text-[#000] outline-none",
            "pt-4 pb-4",
            "focus:ring-0",
            "bg-white",
            hasValue && "!bg-white input-filled-white",
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
              "absolute left-3 bg-white px-1 transition-all duration-150 ease-out text-sm select-none",

              // Default: center vertically
              !hasValue && "top-1/2 -translate-y-1/2",

              // Float UP on focus
              "peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs",

              // Stay UP when filled
              hasValue && "top-0 -translate-y-1/2 text-xs !bg-white",

              // Error state
              error && "text-red-500"
            )}
            style={{
              color: !isFocused ? floatingLabelColor : floatedLabelColor,
            }}
          >
            {label}
            {required && " "}
          </label>
        )}

        {/* ====== CLEAR BUTTON ====== */}
        {clearButton && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-[28px] -translate-y-1/2 p-1"
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

export default InputField;
