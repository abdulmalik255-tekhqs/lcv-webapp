import { IoClose } from "react-icons/io5";
import messagaeIcon from "@/assets/admin-assets/messageIcon.svg";
import { FaExclamationTriangle } from "react-icons/fa";

// Option 1: Separate CustomErrorToast component
export function CustomErrorToast({ title, subtitle, closeToast }) {
  return (
    <div
      className={`
        flex 
        justify-evenly
        items-center 
        gap-2
        px-[15px] py-[12px]
        rounded-[7px]
        text-white
      bg-[#D70015]
      `}
    >
      {/* Left Icon */}
      <div className="flex w-10 h-10 justify-center items-center !rounded-full ">
       <FaExclamationTriangle size={20}  className="text-white text-lg mb-1"/>
      </div>
      {/* Middle Content */}
      <div className="flex flex-col">
        <p className="text-base font-semibold leading-none ">{title}</p>
        <p className="text-sm opacity-80 leading-none mt-1">{subtitle}</p>
      </div>

      {/* Close Icon */}
      <button onClick={closeToast}>
        <IoClose size={22} className="text-white mb-1" />
      </button>
    </div>
  );
}

// Option 2: Modified CustomToast component with variant support
export default function CustomToast({
  title,
  subtitle,
  closeToast,
  variant = "default",
}) {
  const getBackgroundClass = () => {
    switch (variant) {
      case "error":
        return "";
      case "success":
        return "bg-gradient-to-l from-[#065f46] to-[#059669]";
      case "info":
        return "bg-gradient-to-l from-[#000000] to-[#1F0A93]";
      default:
        return "bg-red-800";
    }
  };

  return (
    <div
      className={`
        flex 
        justify-evenly
        items-center 
        gap-6
        px-[15px] py-[12px]
        rounded-[7px]
        text-white
        shadow-[0_4px_12px_rgba(0,0,0,0.10)]
        ${getBackgroundClass()}
      `}
    >
      {/* Left Icon */}
      <div className="flex w-10 h-10 justify-center items-center !rounded-full ">
        <img
          src={messagaeIcon}
          width={16}
          height={16}
          className="text-white"
          alt="toast icon"
        />
      </div>
      {/* Middle Content */}
      <div className="flex flex-col">
        <p className="text-base font-semibold leading-none">{title}</p>
        <p className="text-sm opacity-80 leading-none mt-1">{subtitle}</p>
      </div>

      {/* Close Icon */}
      <button onClick={closeToast}>
        <IoClose size={22} className="text-white" />
      </button>
    </div>
  );
}
