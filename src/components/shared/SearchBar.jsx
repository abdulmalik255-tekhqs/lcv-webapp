import { HiMagnifyingGlass } from "react-icons/hi2";
import searchIcon from "../../assets/issuer-assets/search.svg";
const SearchBar = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  inputClassName = "",
  ...rest
}) => {
  return (
    <div className={`relative w-full  ${className}`}>
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#5D07B7]">
        <img src={searchIcon} alt="search" className="h-3.5 w-3.5" />
      </span>
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-full border bg-slate-50 border-[#E5E5EA] py-3 pl-9 pr-4 text-xs text-[#000] placeholder:text-[#636366] placeholder:font-medium focus:border-[#5D07B7] focus:outline-none focus:ring-[#0E1696] ${inputClassName}`}
        {...rest}
      />
    </div>
  );
};

export default SearchBar;

