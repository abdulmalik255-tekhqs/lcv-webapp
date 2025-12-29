import { useState, useRef, useEffect } from "react";
import clsx from "clsx";

const SimpleDropdown = ({
  label, // Optional label
  options = [],
  selectedValue,
  onChange,
  error,
  required = false,
  className,
  placeholder = "All",
  showLabelWithValue = true, // NEW: Control whether to show label with selected value
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

  // UPDATED: Handle display text based on showLabelWithValue prop
  const displayText = selectedOption
    ? showLabelWithValue
      ? label
        ? `${label}: ${selectedOption.label}`
        : selectedOption.label
      : selectedOption.label
    : label && showLabelWithValue
    ? `${label}: ${placeholder}`
    : placeholder;

  const handleSelect = (value) => {
    onChange?.(value);
    setIsOpen(false);
  };

  return (
    <div
      className={clsx("relative inline-block text-left", className)}
      ref={dropdownRef}
    >
      {/* Simple button with label and value */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "inline-flex items-center w-full",
          "bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
          "min-w-[90px]",
          error && "border-red-500 focus:ring-red-500"
        )}
      >
        <span className={clsx("truncate", !selectedOption && "text-gray-400")}>
          <span className="font-['Montserrat'] text-[13px] font-semibold leading-[150%] text-[var(--Dark-Black,#000)]">
            {displayText}
          </span>
        </span>

        {/* Simple arrow icon */}
        <svg
          className={clsx(
            "ml-2 h-5 w-5 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown options */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1 max-h-60 overflow-auto">
            {/* Other options */}
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={clsx(
                  "w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",
                  selectedValue === option.value && "bg-gray-100 font-medium"
                )}
              >
                <span className="font-['Montserrat'] text-[13px] font-semibold leading-[150%] text-[var(--Dark-Black,#000)]">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error message */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default SimpleDropdown;
