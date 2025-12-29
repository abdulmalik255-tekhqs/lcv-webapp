import clsx from "clsx";
import { useState, useRef, useEffect } from "react";
import Calendar from "@/assets/kyc-assets/calendarIcon.svg";
import { FaChevronLeft, FaChevronRight, FaChevronDown, FaCross, FaXmark } from "react-icons/fa6";

const DatePicker = ({
  label,
  hint,
  error,
  required = false,
  hideLabel = false,
  className,
  inputClassName,
  id,
  placeholder = "Select date",
  value,
  onChange,
  onFocus,
  format = "yyyy-MM-dd",
  disablePastDates = false,
  showYearDropdown = true,
  ...rest
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value || null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const datePickerRef = useRef(null);
  const calendarRef = useRef(null);

  const inputId = id ?? rest?.name;

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);

    switch (format) {
      case "MM/dd/yyyy":
        return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(
          d.getDate()
        ).padStart(2, "0")}/${d.getFullYear()}`;
      case "dd/MM/yyyy":
        return `${String(d.getDate()).padStart(2, "0")}/${String(
          d.getMonth() + 1
        ).padStart(2, "0")}/${d.getFullYear()}`;
      default:
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(d.getDate()).padStart(2, "0")}`;
    }
  };

  const hasValue = !!selectedDate;

  // Check if a date is disabled (past date when disablePastDates is true)
  const isDateDisabled = (date) => {
    if (!disablePastDates) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  // Generate years for dropdown (current year ± 50 years)
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 50; i <= currentYear + 50; i++) {
      years.push(i);
    }
    return years;
  };

  // Sync selectedDate with value prop
  useEffect(() => {
    setSelectedDate(value || null);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target) &&
        calendarRef.current &&
        !calendarRef.current.contains(event.target)
      ) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDateSelect = (date) => {
    if (isDateDisabled(date)) return;
    setSelectedDate(date);
    setIsCalendarOpen(false);
    onChange?.(date.toISOString().split("T")[0]);
  };

  const handleClear = () => {
    setSelectedDate(null);
    onChange?.(null);
    setIsCalendarOpen(false);
  };

  // Calendar logic
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const startingDay = firstDay.getDay();
    const days = [];

    // previous month
    const prevMonthLast = new Date(year, month, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLast - i);
      days.push({
        date,
        isCurrentMonth: false,
        isDisabled: isDateDisabled(date),
      });
    }

    // current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === new Date().toDateString(),
        isSelected:
          selectedDate &&
          date.toDateString() === new Date(selectedDate).toDateString(),
        isDisabled: isDateDisabled(date),
      });
    }

    // next month
    const totalCells = 42;
    const remaining = totalCells - days.length;
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        isDisabled: isDateDisabled(date),
      });
    }

    return days;
  };

  const days = generateCalendarDays();
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get next month for bottom indicator
  const nextMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1
  );

  return (
    <div className="relative " ref={datePickerRef} >
      <div className={clsx("flex flex-col gap-1 ", className)}>
        {!hideLabel && label && (
          <label htmlFor={inputId} className="text-sm text-black font-medium">
            {label}
          </label>
        )}

        {/* INPUT */}
        <div className="relative ">
          <input
            id={inputId}
            type="text"
            readOnly
            value={formatDate(selectedDate)}
            placeholder={!hideLabel ? placeholder : ""}
            onFocus={() => {
              setIsCalendarOpen(true);
              onFocus?.();
            }}
            className={clsx(
              "w-full rounded-lg bg-white px-4 py-3 text-black outline-none transition",
              "border border-gray-400", // default border always grey
              "focus:border-blue-500 focus:ring-2 focus:ring-blue-200", // only on focus
              error && "border-red-500 text-red-600",
              inputClassName
            )}
            style={{ paddingRight: hasValue ? "3.5rem" : "2.5rem" }}
            {...rest}
          />

          {/* Floating Label */}
          {hideLabel && label && (
            <span
              className={clsx(
                "absolute left-4 bg-white px-1 text-[#000] font-medium pointer-events-none transition-all",
                !hasValue && !isCalendarOpen
                  ? "top-1/2 -translate-y-1/2 text-sm text-[#000] font-medium"
                  : "top-0 -translate-y-1/2 text-sm text-[#000] font-medium"
              )}
            >
              {label}
            </span>
          )}

          {/* Calendar Icon */}
          <button
            type="button"
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
          >
            <img src={Calendar} className="w-5 h-5 opacity-80" />
          </button>

          {/* Clear Button */}
          {hasValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-10 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
            >
              <FaXmark className="w-4 h-4 opacity-80" />
            </button>
          )}
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}
        {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
      </div>

      {/* CALENDAR */}
      {isCalendarOpen && (
        <div
          ref={calendarRef}
          className="absolute z-50 p-4 rounded-lg bg-white border border-gray-200 shadow-lg mt-2"
          style={{ minWidth: "320px" }}
        >
          {/* Header - Label and Year Selector */}
          <div className="flex items-center justify-between mb-3">
            {/* Label */}
            {label && (
              <h3 className="text-base font-bold text-[#000]">
                {label}
              </h3>
            )}
            
            {/* Year Selector */}
            <div className="relative flex items-center">
              <select
                value={currentMonth.getFullYear()}
                onChange={(e) =>
                  setCurrentMonth(
                    new Date(
                      parseInt(e.target.value),
                      currentMonth.getMonth()
                    )
                  )
                }
                className="year-selector text-base font-semibold text-[#000] bg-transparent border-none outline-none cursor-pointer appearance-none pr-6"
              >
                {generateYears().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <FaChevronDown className="absolute right-0 w-3 h-3 text-[#000] pointer-events-none" />
            </div>
          </div>

          {/* Month and Year Display */}
          <div className="mb-3">
            <span className="text-sm font-medium text-[#000]">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 text-center text-xs text-[#000] mb-2 font-medium">
            {weekDays.map((d) => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1 items-center justify-items-center mb-3">
            {days.map((day, i) => (
              <button
                key={i}
                disabled={!day.isCurrentMonth || day.isDisabled}
                onClick={() => handleDateSelect(day.date)}
                className={clsx(
                  "h-8 w-8 rounded transition text-sm flex items-center justify-center",
                  day.isSelected
                    ? "bg-blue-600 text-white"
                    : day.isToday
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : day.isDisabled
                    ? "text-gray-300 cursor-not-allowed opacity-50"
                    : day.isCurrentMonth
                    ? "text-[#000] hover:bg-gray-100"
                    : "text-gray-400 cursor-not-allowed"
                )}
              >
                {day.date.getDate()}
              </button>
            ))}
          </div>

          {/* Next Month Indicator */}
          <div className="text-sm text-[#000] font-medium">
            {months[nextMonth.getMonth()]} {nextMonth.getFullYear()}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
