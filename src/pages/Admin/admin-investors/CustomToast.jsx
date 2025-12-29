import { FaCheckCircle } from "react-icons/fa";
import { IoSend, IoClose } from "react-icons/io5";
export default function CustomToast({ title, subtitle, closeToast }) {
  return (
    <div
      className="
        flex 
        justify-evenly
        items-center 
        gap-6
        px-[15px] py-[12px]
        rounded-[7px]
        text-white
        shadow-[0_4px_12px_rgba(0,0,0,0.10)]
        bg-gradient-to-l from-[#000000] to-[#1F0A93] 
      "
    >
      {/* Left Icon */}
      <div className="flex w-10 h-10 justify-center items-center !rounded-full bg-[#000]">
        <FaCheckCircle size={20} className="text-white" />
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
