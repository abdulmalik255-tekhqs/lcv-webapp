import React from "react";

/**
 * Usage:
 * <Heading>Invite User</Heading>
 * <Heading className="text-left text-[#4A5565]">User Management</Heading>
 */
const Heading = ({ children, className = "" }) => {
  return (
    <h2
      className={`text-center font-['Montserrat'] text-[32px] font-bold leading-[120%] tracking-[0.64px] text-[var(--Dark-Black,#000)] ${className}`}
    >
      {children}
    </h2>
  );
};

export default Heading;