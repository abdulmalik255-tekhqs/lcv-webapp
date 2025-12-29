import { useState, useEffect, useRef } from "react";
import { FaChevronDown, FaCross, FaXmark } from "react-icons/fa6";
import clsx from "clsx";

const CountrySelector = ({
  value,
  onChange,
  label,
  required = false,
  error,
  countries = [],
  onFieldFocus,
  name = "country",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedCountry = countries.find(
    (country) => country.name.common === value || country.cca2 === value
  );

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function to highlight matching text
  const highlightMatch = (text, searchTerm) => {
    if (!searchTerm) return text;
    
    const lowerText = text.toLowerCase();
    const lowerSearch = searchTerm.toLowerCase();
    const index = lowerText.indexOf(lowerSearch);
    
    if (index === -1) return text;
    
    const beforeMatch = text.substring(0, index);
    const match = text.substring(index, index + searchTerm.length);
    const afterMatch = text.substring(index + searchTerm.length);
    
    return (
      <>
        {beforeMatch}
        <span className="font-bold text-[#000] !text-[15px]">{match}</span>
        {afterMatch}
      </>
    );
  };

  const handleSelect = (country) => {
    onChange({ target: { name, value: country.name.common } });
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange({ target: { name, value: "" } });
    setSearchTerm("");
  };

  const handleFocus = () => {
    if (name && onFieldFocus) {
      onFieldFocus(name);
    }
  };

  const hasValue = value && typeof value === "string" && value.trim() !== "";

  return (
    <div
      className="flex w-full flex-col gap-1 text-sm font-medium !text-[#000] relative"
      ref={dropdownRef}
    >
      <div className="relative">
        <div
          onClick={() => {
            setIsOpen(!isOpen);
            handleFocus();
          }}
          className={clsx(
            "peer block w-full rounded-lg px-4 text-base !text-[#000] outline-none",
            "pt-5 pb-2 pr-10",
            "focus:ring-0",
            "border transition-colors",
            // Default border state
            !error && "border-[#E5E5EA]",
            // Focus/Open state
            !error && isOpen && "ring-1 ring-[#0734A9] border-[#0734A9]",
            // Error state
            error && "border-rose-500 ring-1 ring-rose-500",
            "bg-white cursor-pointer min-h-[48px] flex items-center",
            hasValue && "!bg-white",
            !hasValue && "text-[#48484A]"
          )}
          style={{
            backgroundColor: "white",
            background: "white",
          }}
        >
          {selectedCountry ? (
            <div className="flex items-center gap-2">
              <img
                src={selectedCountry.flags.png}
                alt={selectedCountry.name.common}
                className="w-5 h-4 object-cover rounded"
              />
              <span className="text-[#000]">{selectedCountry.name.common}</span>
            </div>
          ) : (
            <span className="text-[#48484A]"></span>
          )}
          {hasValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-8 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
            >
              <FaXmark className="w-3 h-3 text-[#48484A]" />
            </button>
          )}
        </div>

        {/* Floating Label */}
        {label && (
          <span
            className={clsx(
              "absolute left-4 bg-white !text-[#000] px-1 transition-all duration-150 ease-out text-sm select-none pointer-events-none z-10",
              !hasValue && "top-1/2 -translate-y-1/3 pr-5 !text-[#000]",
              "peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-[#131DBB]",
              hasValue &&
                "top-0 -translate-y-1/2 text-xs text-[#0066ff] !bg-white",
              error && "text-red-500"
            )}
          >
            {label}
          </span>
        )}

        {/* Required Label */}
        {required && !hasValue && (
          <span
            className={clsx(
              "absolute right-10 bg-white !text-[#48484A] px-1 transition-all duration-150 ease-out text-xs select-none pointer-events-none",
              "top-1/2 -translate-y-1/2"
            )}
          >
            {/* Required */}
          </span>
        )}

        {/* Dropdown Arrow */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <FaChevronDown
            className={clsx(
              "w-4 h-4 text-[#48484A] transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E5E5EA] rounded-lg shadow-lg z-50 max-h-[400px] overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-[#E5E5EA] sticky top-0 bg-white">
            <input
              type="text"
              placeholder="Search country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full px-3 py-2 border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0734A9] focus:border-[#0734A9]"
            />
          </div>

          {/* Countries List */}
          <div className="overflow-y-auto max-h-[400px] h-[400px]">
            {filteredCountries.length === 0 ? (
              <div className="p-4 text-center text-[#48484A]">
                No countries found
              </div>
            ) : (
              filteredCountries.map((country) => (
                <div
                  key={country.cca2}
                  onClick={() => handleSelect(country)}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-2 hover:bg-[#FAFAFC] cursor-pointer",
                    selectedCountry?.cca2 === country.cca2 && "bg-[#F0F4FF]"
                  )}
                >
                  <img
                    src={country.flags.png}
                    alt={country.name.common}
                    className="w-6 h-4 object-cover rounded"
                  />
                  <span className="text-[#000] ">
                    {highlightMatch(country.name.common, searchTerm)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <span className="text-xs font-medium text-red-500 mt-0.5 flex items-center gap-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default CountrySelector;
