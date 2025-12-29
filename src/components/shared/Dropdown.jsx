import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { FaChevronDown } from "react-icons/fa6";

const Dropdown = ({
  label,
  options = [],
  selectedValue,
  onChange,
  error,
  required = false,
  hideLabel = false,
  className,
  placeholder = "Select an option",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === selectedValue);
  const hasValue =
    selectedValue !== undefined &&
    selectedValue !== null &&
    selectedValue !== "";

  const handleSelect = (value) => {
    onChange?.(value);
    setIsOpen(false);
  };

  return (
    <div
      className={clsx(
        "flex w-full flex-col gap-1 text-sm font-medium text-[#000]",
        className
      )}
      ref={dropdownRef}
    >
      {/* Normal label (not floating) */}
      {label && !hideLabel && (
        <label className="text-sm font-medium text-[#000]">
          {label} {required && ""}
        </label>
      )}

      <div className="relative">
        {/* ==== OUTER BORDER WITH FOCUS/FILLED LOGIC ==== */}
        <div
          className={clsx(
            "absolute inset-0 pointer-events-none rounded-lg border transition-all duration-200",

            // Gray border ONLY if empty and NOT open
            !error && !hasValue && !isOpen && "border-[#AEAEB2]",

            // Blue border if filled or focused/opened
            !error &&
              (hasValue || isOpen) &&
              "border border-[1px] border-gradient-to-r from-[#0D4BEF] to-[#7D0BF4] outline outline-[2px]  outline-[#b400ff]",

            // Error
            error && "border-rose-500"
          )}
        />

        {/* ==== DROPDOWN BUTTON ==== */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={clsx(
            "peer block w-full rounded-lg bg-white px-4 text-base text-[#000] outline-none",
            "pt-5 pb-2 flex items-center justify-between",
            error && "text-rose-500"
          )}
        >
          <span
            className={clsx(
              !selectedOption && "text-[#48484A] mb-3 text-left text-[#000]"
            )}
          >
            {selectedOption
              ? selectedOption.label
              : !isOpen && !hasValue
              ? placeholder
              : ""}
          </span>

          <FaChevronDown className="w-4 h-4 text-[#48484A]" />
        </button>

        {/* ==== FLOATING LABEL ==== */}
        {hideLabel && label && (isOpen || hasValue) && (
          <span
            className={clsx(
              "absolute left-4 bg-white px-1 transition-all duration-150 ease-out text-sm select-none pointer-events-none",
              "top-0 -translate-y-1/2 text-xs text-[#1C1C1E]",
              // Error
              error && "text-red-500"
            )}
          >
            {label}
          </span>
        )}

        {/* ==== DROPDOWN OPTIONS ==== */}
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full rounded-lg border border-2 border-gradient-to-r from-[#0D4BEF] to-[#7D0BF4] bg-white  max-h-60 overflow-auto">
            {options.length === 0 ? (
              <div className="px-4 py-3 text-sm ">No options available</div>
            ) : (
              options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={clsx(
                    "w-full px-4 py-3 text-left text-sm transition-all duration-150",
                    "hover:bg-[linear-gradient(135deg,rgba(155,60,255,0.08)_70%,rgba(45,103,255,0.08)_30%)]",
                    "hover:text-[#131DBB]",
                    selectedValue === option.value &&
                      "text-[#131DBB] font-semibold"
                  )}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <span className="text-xs font-medium text-red-500">{error}</span>
      )}
    </div>
  );
};

export default Dropdown;
