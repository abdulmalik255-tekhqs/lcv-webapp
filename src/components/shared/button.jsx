import clsx from "clsx";
import { useRef, useState } from "react";

const baseStyles =
  "inline-flex border-[1.6px]  rounded-[99px] text-[17px] items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

const variants = {
  primary:
    "rounded-full bg-black text-white text-[Montserrat]  hover:!bg-black hover:!text-white border-[1.6px] focus-visible:outline-primary-500",
  secondary:
    "rounded-full  bg-white text-[#1C1C1E] text-[Montserrat]  border border-[1.6px] border-[#1C1C1E] hover:!bg-gray-100 hover:!text-[#000] focus-visible:outline-primary-500 hover:opacity-80" ,
  subtle:
    "rounded-full bg-primary-50 text-[#000] text-[Montserrat] border-[1.6px]  hover:!bg-gray-200 hover:!text-white focus-visible:outline-primary-400",
  ghost:
    "rounded-full text-[#000] text-[Montserrat]  hover:!bg-gray-100  border-[1.6px]  focus-visible:outline-primary-200",
  gradient:
    "rounded-full bg-gradient-to-r from-[#0734A9] via-[#0E1696] to-[#4B0792] border-[1.6px] text-[#FFFFFF] text-[Montserrat] font-[500] focus-visible:outline-primary-500 hover:!bg-black hover:![background-image:none] hover:!text-white",
    upload:
    "rounded-full bg-white text-[#000] border-[1.6px] text-[#000] text-[Montserrat] font-[500] focus-visible:outline-primary-500 hover:!bg-black hover:![background-image:none] hover:!text-white",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-full h-[38px]",
  md: "px-4 py-2 text-sm rounded-full",
  lg: "px-5 py-2.5 text-base rounded-full",
  xl: "px-6 py-3 text-base rounded-full",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className,
  icon,
  iconPosition = "left",
  onClick,
  disabled,
  loading = false,
  ...rest
}) => {
  const [isTemporarilyDisabled, setIsTemporarilyDisabled] = useState(false);
  const timeoutRef = useRef(null);



  
  
  const isDisabled = disabled || isTemporarilyDisabled || loading;

  return (
    <button
      className={clsx(
        baseStyles, 
        variants[variant], 
        sizes[size], 
        loading && variant === 'gradient' && 'btn-gradient-loading',
        loading && variant === 'upload' && 'btn-upload-loading',
        className
      )}
      onClick={onClick}
      disabled={isDisabled}
      {...rest}
    >
      {icon && iconPosition === "left" ? icon : null}
      <span>{children}</span>
      {icon && iconPosition === "right" ? icon : null}
    </button>
  );
};

export default Button;
