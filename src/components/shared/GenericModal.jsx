import { AiOutlineClose } from "react-icons/ai";

const GenericModal = ({
  isOpen,
  onClose,
  title,
  subheader,
  children,
  maxWidth = "max-w-xl",
  className = "",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <div
        className={`w-full ${maxWidth} rounded-[14px] bg-[#FAFAFC] px-6 pb-6 relative pt-[40px] ${className}`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <AiOutlineClose className="text-[#000000] text-center text-[17px] font-[400] leading-[24px] font-['Font Awesome 7 Pro']" />{" "}
        </button>

        {/* Title */}
        {title && (
          <h2 className=" font-['Atacama'] mt-6  text-[24px]  font-normal !mb-[5px]  text-[#000000] text-center font-['Atacama VAR'] text-[24px] font-[400] leading-[150%] ">
            {title}
          </h2>
        )}

        {/* Subheader */}
        {subheader && (
          <p className="text-center font-['Montserrat'] font-normal  text-[13px] text-[#000] mb-6">
            {subheader}
          </p>
        )}

        {/* Content */}
        {children}
      </div>
    </div>
  );
};

export default GenericModal;
