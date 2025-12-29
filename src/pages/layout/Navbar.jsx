import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../../assets";
import Notifications from "@/assets/Notifications";
import { useAuth } from "@/hooks/useAuth";
import useProfile from "@/api/auth/useProfile";
import logoutIcon from "../../assets/admin-assets/logout.svg";
import settingsIcon from "../../assets/admin-assets/setting-black.svg";
import Settings from "@/assets/Settings";
import bellIcon from "../../assets/admin-assets/bell.svg";
import badgeIcon from "../../assets/admin-assets/badge.svg";
import GenericModal from "@/components/shared/GenericModal";
import Setting from "./Setting";

const Navbar = ({ name = "LCV Dashboard" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout, role: storedRole } = useAuth();
  const { data: profileData } = useProfile(true);
  const userProfile = profileData?.user || user;
  const userRole = profileData?.role || storedRole || userProfile?.role || "User";

  // Get first_name and last_name from API response
  const firstName = userProfile?.first_name || userProfile?.firstName || userProfile?.name?.split(" ")[0] || "";
  const lastName = userProfile?.last_name || userProfile?.lastName || userProfile?.name?.split(" ").slice(1).join(" ") || "";
  const userName = firstName && lastName 
    ? `${firstName} ${lastName}` 
    : firstName || lastName || userProfile?.name || "User Name";

  // Generate initials
  const getInitials = (first, last) => {
    if (first && last) {
      return (first[0] + last[0]).toUpperCase();
    }
    if (first) {
      return first.substring(0, 2).toUpperCase();
    }
    if (last) {
      return last.substring(0, 2).toUpperCase();
    }
    return "AC";
  };

  const initials = getInitials(firstName, lastName);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  const handleLogout = () => {
    setIsModalOpen(false);
    logout();
  };

  const handleSettingsClick = () => {
    setIsSettingsModalOpen(true);
    setIsModalOpen(false);
  };


  const handleAvatarClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <header className="relative h-60 w-full bg-gradient-to-b from-black via-[#16003a] to-[#5c00c7] px-4">
      <div className="px-8 !py-3 flex w-full items-center justify-between sm:px-10 sm:py-2">
        <div className="flex items-center gap-2 sm:gap-3 ml-2 ">
          <span>
            <Logo className="h-6 w-auto text-white sm:h-8" />
          </span>
          <div className="flex items-center gap-2 sm:gap-3 md:pl-[115px]">
            <div className="h-8 sm:h-12 border-r border-gray-700 mx-4 " />
            <img src={badgeIcon}/>
            <span className="text-white text-sm sm:text-base font-medium">
              {name}
            </span>
          </div>
        </div>
        <div
          className="flex items-center gap-2 sm:gap-3 relative "
          ref={modalRef}
        >
          <Notifications className=" text-white  cursor-pointer" />
          <div className="mt-1">
            <button onClick={handleSettingsClick} className="cursor-pointer">
              <Settings 
                className=" text-white  cursor-pointer" 
              />
            </button>
          </div>
          <div
            className="flex items-center rounded-full border border-[#0D4BEF] border-2  md:text-[17px] font-medium text-white  sm:text-[12px] cursor-pointer hover:opacity-80 transition-opacity w-[48px] h-[48px] justify-center"
            onClick={handleAvatarClick}
          >
            {initials}
          </div>

          {/* Dropdown Modal */}
          {isModalOpen && (
            <div className="absolute right-0 top-12 sm:top-14 mt-2 w-72 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
              {/* User Profile Section */}
              <div className="px-4 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="relative rounded-full border border-[#1042ED] p-0.5 border-2">
                    <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center text-white font-semibold text-sm">
                      {initials}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold text-black">
                      {userName}
                    </p>
                    <p className="text-sm text-gray-500">{userRole}</p>
                  </div>
                </div>
              </div>

              {/* Navigation Options */}
              <div className="py-2">
                <button
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  onClick={() => setIsModalOpen(false)}
                >
                  <span className="text-sm font-medium text-black">
                    Notifications
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-semibold">
                      2
                    </span>
                    <img
                      src={bellIcon}
                      alt="Notifications"
                      className="h-4 w-4"
                    />
                  </div>
                </button>

                <button
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  onClick={handleSettingsClick}
                >
                  <span className="text-sm font-medium text-black">
                    Settings
                  </span>
                  <img src={settingsIcon} alt="Settings" className="h-4 w-4" />
                </button>

                {/* <button
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  onClick={handleVerifyKYCClick}
                >
                  <span className="text-sm font-medium text-black">
                    Verify KYC
                  </span>
                </button> */}
              </div>

              {/* Separator */}
              <div className="border-t border-gray-200"></div>

              {/* Logout */}
              <div className="py-2">
                <button
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  onClick={handleLogout}
                >
                  <span className="text-sm font-medium text-black">Logout</span>
                  <img src={logoutIcon} alt="Logout" className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      <GenericModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        title="Settings"
        subheader="Manage your profile and account settings"
        maxWidth="max-w-3xl"
        className="bg-white max-h-[90vh] overflow-y-auto scrollbar-hide"
      >
        <div className="pb-4">
          <Setting />
        </div>
      </GenericModal>
    </header>
  );
};

export default Navbar;
