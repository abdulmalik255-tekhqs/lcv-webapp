import clsx from "clsx";
import { FaChevronDown } from "react-icons/fa6";

const AssetDropdown = ({
  label,
  hint,
  error,
  required = false,
  className,
  selectClassName,
  id,
  placeholder = "Select an option",
  description,
  options = [],
  onFieldFocus,
  ...rest
}) => {
  const selectId = id ?? rest?.name;

  const value = rest?.value;
  const hasValue =
    value !== undefined && value !== null && String(value).trim() !== "";

  // Remove onFocus from input props
  const { onFocus: existingOnFocus, ...selectProps } = rest;

  // Handle focus - mark field as touched and call existing onFocus if provided
  const handleFocus = (e) => {
    const fieldName = rest?.name;
    if (fieldName && onFieldFocus) {
      onFieldFocus(fieldName);
    }
    if (existingOnFocus) {
      existingOnFocus(e);
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
        {/* Select Field */}
        <select
          id={selectId}
          onFocus={handleFocus}
          size={1}
          className={clsx(
            "peer block w-full h-[58px] rounded-lg px-4 text-base !text-[#000] outline-none appearance-none",
            "pt-5 pb-2 pr-10",
            "focus:ring-0",
            "border transition-colors",
            // Default border state
            !error && "border-[#E5E5EA]",
            // Focus state
            !error && "focus:outline-none focus:ring-1 focus:ring-[#0734A9] focus:border-[#0734A9]",
            // Error state
            error && "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500",
            "bg-white cursor-pointer",
            hasValue && "!bg-white",
            !hasValue && "text-[#48484A]",
            selectClassName
          )}
          style={{
            backgroundColor: "white",
            background: "white",
          }}
          {...selectProps}
        >
          {options.map((option) => {
            if (typeof option === "string") {
              return (
                <option key={option} value={option} style={{ height: "40px", lineHeight: "40px", padding: "8px 0" }}>
                  {option}
                </option>
              );
            }
            return (
              <option key={option.value} value={option.value} style={{ height: "40px", lineHeight: "40px", padding: "8px 0" }}>
                {option.label}
              </option>
            );
          })}
        </select>

        {/* Floating Label */}
        {label && (
          <span
            className={clsx(
              "absolute left-4 bg-white !text-[#000] px-1 transition-all duration-150 ease-out text-sm select-none pointer-events-none",
              // Default: center vertically when no value
              !hasValue &&
                "top-1/2 -translate-y-1/3 pr-5 !text-[#000]",
              // Float UP on focus or when has value
              "peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-[#131DBB]",
              // Stay UP when filled
              hasValue &&
                "top-0 -translate-y-1/2 text-xs text-[#0066ff] !bg-white",
              // Error state
              error && "text-red-500"
            )}
          >
            {label}
          </span>
        )}

        {/* Required Label on Right - Only show when required prop is true and field is not filled/focused */}
        {required && !hasValue && (
          <span
            className={clsx(
              "absolute right-10 bg-white !text-[#48484A] px-1 transition-all duration-150 ease-out text-xs select-none pointer-events-none",
              "top-1/2 -translate-y-1/2",
              "peer-focus:hidden"
            )}
          >
            {/* Required */}
          </span>
        )}

        {/* Dropdown Arrow Icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <FaChevronDown className="w-4 h-4 text-[#48484A]" />
        </div>
      </div>

      {/* Description text below select */}
      {description && (
        <span className="text-xs text-[#48484A] font-normal mt-1">
          {description}
        </span>
      )}

      {/* Error Message */}
      {error && (
        <span className="text-xs font-medium text-red-500 mt-0.5 flex items-center gap-1">
          {error}
        </span>
      )}

      {/* Hint - Only show when no error */}
      {hint && !error && (
        <span className="text-xs text-[#48484A] mt-0.5">{hint}</span>
      )}
    </div>
  );
};

export default AssetDropdown;

