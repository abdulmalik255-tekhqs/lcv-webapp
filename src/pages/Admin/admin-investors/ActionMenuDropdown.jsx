import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { HiOutlineDotsVertical } from "react-icons/hi";

const ActionMenuDropdown = ({
  investor,
  onResendInvitation,
  onDelete,
  onInviteToKYC,
  onDisable,
  onRevoke,
  onSuspend,
  onReactivate,
  onRejected,
  onApproved,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = () => {
      updatePosition();
    };

    // Update position on scroll
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  const handleButtonClick = (e) => {
    e.stopPropagation();
    updatePosition();
    setIsOpen(!isOpen);
  };

  const getMenuOptions = () => {
    const status = investor?.status;

    if (status === "Invited") {
      return [
        {
          label: "Resend Invitation",
          action: onResendInvitation,
          type: "toast",
        },
        { label: "Delete", action: onDelete, type: "modal" },
      ];
    }

    if (status === "Basic") {
      return [
        { label: "Invite to KYC", action: onInviteToKYC, type: "toast" },
        { label: "Disable", action: onDisable, type: "modal" },
        { label: "Revoke", action: onRevoke, type: "modal" },
      ];
    }

    if (status === "Asset Holder") {
      return [
        { label: "Suspend", action: onSuspend, type: "modal" },
        { label: "Disable", action: onDisable, type: "modal" },
        { label: "Revoke", action: onRevoke, type: "modal" },
      ];
    }

    if (status === "Suspended") {
      return [
        { label: "Reactivate", action: onReactivate, type: "toast" },
        { label: "Disable", action: onDisable, type: "modal" },
        { label: "Revoke", action: onRevoke, type: "modal" },
      ];
    }

    if (status === "Disabled") {
      return [
        { label: "Reactivate", action: onReactivate, type: "toast" },
        { label: "Suspend", action: onSuspend, type: "modal" },
        { label: "Revoke", action: onRevoke, type: "modal" },
      ];
    }
    if (status === "Verified") {
      return [{ label: "Reactivate", action: onReactivate, type: "toast" }];
    }
    if (status === "In Review") {
      return [
        { label: "Rejected", action: onRejected, type: "toast" },
        { label: "Approved", action: onApproved, type: "toast" },
      ];
    }
    if (status === "Approved") {
      return [
        { label: "Rejected", action: onRejected, type: "toast" },
      ];
    }
    if (status === "Rejected") {
      return [
        { label: "Approved", action: onApproved, type: "toast" },
      ];
    }
    if (status === "Denied") {
      return [{ label: "Reactivate", action: onReactivate, type: "toast" }];
    }
    return [];
  };

  const menuOptions = getMenuOptions();

  const handleOptionClick = (option) => {
    option.action?.();
    setIsOpen(false);
  };

  if (menuOptions.length === 0) return null;

  return (
    <>
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={handleButtonClick}
          className="flex w-12 h-12 flex-col justify-center items-center gap-2.5 rounded-[99px] border border-[#D1D1D6] border-opacity-100 bg-[#FFF] hover:bg-gray-50 transition-colors"
        >
          <HiOutlineDotsVertical className="h-5 w-5 text-[#666]" />
        </button>
      </div>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: `${position.top}px`,
              left: `${position.left - 120}px`,
              zIndex: 9999,
            }}
            className="w-48 bg-white rounded-lg shadow-lg border border-gray-200"
          >
            {menuOptions.map((option, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOptionClick(option);
                }}
                className={`w-full px-4 py-3 text-left text-sm font-medium ${
                  index === menuOptions.length - 1
                    ? "text-red-600"
                    : "text-[#000]"
                } hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg`}
              >
                {option.label}
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
};

export default ActionMenuDropdown;
