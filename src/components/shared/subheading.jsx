import React from "react";

/**
 * Usage:
 * <SubHeading>Manage all users across different roles</SubHeading>
 * <SubHeading className="text-left text-[#4A5565]">Custom text</SubHeading>
 */
const SubHeading = ({ children, className = "" }) => {
  return (
    <p
      className={`text-center font-['Montserrat'] text-[15px] font-normal leading-[18px] text-[#48484A] ${className}`}
    >
      {children}
    </p>
  );
};

export default SubHeading;