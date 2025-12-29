import React, { useState, useEffect, useRef } from "react";
import { FaCamera, FaCopy, FaLock } from "react-icons/fa6";
import useProfile from "@/api/auth/useProfile";
import useUpdateProfile from "@/api/auth/useUpdateProfile";
import useUpdatePassword from "@/api/auth/useUpdatePassword";
import useUpdateProfilePic from "@/api/auth/useUpdateProfilePic";
import { useAuth } from "@/hooks/useAuth";
import InputField from "@/components/shared/InputField";
import Button from "@/components/shared/button";
import useToast from "@/hooks/useCustomToast";

function Setting() {
  const { user, logout } = useAuth();
  const { data: profileData } = useProfile(true);
  const updateProfileMutation = useUpdateProfile();
  const updatePasswordMutation = useUpdatePassword();
  const updateProfilePicMutation = useUpdateProfilePic();
  const {showBottomRightToast: showSuccessToast, showErrorToast } = useToast();
  const userProfile = profileData?.user || user;
  const userRole = profileData?.role || user?.role;

  // Get user info - handle both API response structure and fallback
  const firstName =
    userProfile?.first_name ||
    userProfile?.firstName ||
    userProfile?.name?.split(" ")[0] ||
    "";
  const lastName =
    userProfile?.last_name ||
    userProfile?.lastName ||
    userProfile?.name?.split(" ").slice(1).join(" ") ||
    "";
  const email = userProfile?.email || "";
  // const walletAddress =
  //   userProfile?.walletAddress || "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4";

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    targetCloseDate: "",
  });

  const [passwordData, setPasswordData] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);
  const profileFirstName =
    profileData?.user?.first_name || user?.first_name || user?.firstName || "";
  const profileLastName =
    profileData?.user?.last_name || user?.last_name || user?.lastName || "";
  const profileEmail = profileData?.user?.email || user?.email || "";
  const profilePicture =
    profileData?.user?.profile_pic || user?.profile_pic || "";

  useEffect(() => {
    if (
      !isEditingProfile &&
      (profileFirstName || profileLastName || profileEmail)
    ) {
      setFormData((prev) => {
        if (
          prev.firstName !== profileFirstName ||
          prev.lastName !== profileLastName ||
          prev.email !== profileEmail
        ) {
          return {
            firstName: profileFirstName,
            lastName: profileLastName,
            email: profileEmail,
            targetCloseDate: "",
          };
        }
        return prev;
      });
    }
  }, [profileFirstName, profileLastName, profileEmail, isEditingProfile]);

  // Generate initials
  const getInitials = (first, last) => {
    if (first && last) {
      return (first[0] + last[0]).toUpperCase();
    }
    if (first) {
      return first.substring(0, 2).toUpperCase();
    }
    return "AC";
  };

  const initials = getInitials(firstName, lastName);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await updateProfileMutation.mutateAsync({
        first_name: formData.firstName,
        last_name: formData.lastName,
      });

      // Update form data immediately from response
      if (response) {
        const updatedFirstName =
          response.first_name || response.firstName || "";
        const updatedLastName = response.last_name || response.lastName || "";

        setFormData((prev) => ({
          ...prev,
          firstName: updatedFirstName,
          lastName: updatedLastName,
        }));
      }

      showSuccessToast("Profile updated successfully");
      setIsEditingProfile(false);
    } catch (error) {
      showErrorToast(
        error?.response?.data?.message || "Failed to update profile"
      );
    }
  };

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showErrorToast("New password and confirm password do not match");
      return;
    }

    if (
      !passwordData.password ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      showErrorToast("Please fill in all password fields");
      return;
    }

    try {
      await updatePasswordMutation.mutateAsync({
        password: passwordData.password,
        new_password: passwordData.newPassword,
        confirm_password: passwordData.confirmPassword,
      });
      showSuccessToast(
        "Password changed successfully. You will be logged out."
      );
      // Logout after successful password change
      setTimeout(() => {
        logout();
      }, 1500);
    } catch (error) {
      showErrorToast(
        error?.response?.data?.message || "Failed to update password"
      );
    }
  };

  const handleProfilePicChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showErrorToast("Please select an image file");
      return;
    }

    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showErrorToast("Image size should be less than 5MB");
      return;
    }

    try {
      const response = await updateProfilePicMutation.mutateAsync(file);

      // The response is immediately updated in the query cache via onSuccess
      // The profilePicture will automatically update from the cache

      showSuccessToast("Profile picture updated successfully");
    } catch (error) {
      showErrorToast(
        error?.response?.data?.message || "Failed to update profile picture"
      );
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Profile Photo Section */}
      <div className="bg-white border border-[#E5E5EA] shadow-[0_0_30px_0_rgba(0,0,0,0.08)] rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="relative flex-shrink-0">
            <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full !bg-white flex items-center justify-center text-white font-semibold text-lg sm:text-xl border-1 border-transparent bg-gradient-to-r from-[#0734A9] via-[#0E1696] to-[#4B0792] p-0.5">
              <div className="h-full w-full rounded-full bg-black flex items-center justify-center overflow-hidden relative">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : null}
                {(!profilePicture || !profilePicture.trim()) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {initials}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[17px]  font-[500] text-[#000] mb-1">
              Profile Photo
            </h3>
            <p className="text-[13px] font-[400] text-[#48484A]">
              Update your profile photo.
            </p>
          </div>
          <div className="w-full sm:w-auto">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              className="hidden"
              disabled={updateProfilePicMutation.isPending}
            />
            <Button
              variant="gradient"
              size="md"
              icon={<FaCamera className="w-4 h-4" />}
              className="w-full sm:w-auto"
              disabled={updateProfilePicMutation.isPending}
              onClick={() => fileInputRef.current?.click()}
            >
              {updateProfilePicMutation.isPending ? "Uploading..." : "Edit"}
            </Button>
          </div>
        </div>
      </div>

      {/* Personal Details Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[17px] font-[700] text-[#000] mb-1">
              Personal Details
            </h3>
            <p className="text-[13px] font-[400] text-[#48484A]">
              Your personal information.
            </p>
          </div>
          {!isEditingProfile && (
            <Button
              variant="gradient"
              size="md"
              onClick={() => setIsEditingProfile(true)}
            >
              Edit
            </Button>
          )}
        </div>
        <div className="space-y-4">
          <InputField
            label="First Name"
            value={isEditingProfile ? formData.firstName : firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            readOnly={!isEditingProfile}
            className="bg-white"
            disabled={updateProfileMutation.isPending}
          />
          <InputField
            label="Last Name"
            value={isEditingProfile ? formData.lastName : lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            readOnly={!isEditingProfile}
            className="bg-white"
            disabled={updateProfileMutation.isPending}
          />
          <InputField
            label="Email Address"
            type="email"
            value={email}
            readOnly
            className="bg-white color-[#636366"
          />
        </div>
        {isEditingProfile && (
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                setIsEditingProfile(false);
                setFormData({
                  firstName: firstName,
                  lastName: lastName,
                  email: email,
                  targetCloseDate: "",
                });
              }}
              disabled={updateProfileMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="gradient"
              size="md"
              onClick={handleUpdateProfile}
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      {/* Canton Wallet Address Section */}
      {/* <div className="space-y-4">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-black mb-1">
            Canton Wallet Address
          </h3>
          <p className="text-sm text-gray-600">
            Your blockchain wallet address.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <InputField
              label="Canton Wallet Address"
              value={walletAddress}
              readOnly
              className="bg-white"
            />
          </div>
          <div className="flex items-end">
            <Button
              variant="gradient"
              size="md"
              icon={<FaCopy className="w-4 h-4" />}
              onClick={() => copyToClipboard(walletAddress)}
              className="w-full sm:w-auto whitespace-nowrap"
            >
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>
      </div> */}

      {/* Password Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-black mb-1">
              Password
            </h3>
            <p className="text-sm text-gray-600">
              Change your account password.
            </p>
          </div>
          {!isChangingPassword && (
            <Button
              variant="gradient"
              size="md"
              icon={<FaLock className="w-4 h-4" />}
              onClick={() => setIsChangingPassword(true)}
              className="whitespace-nowrap"
            >
              Change
            </Button>
          )}
        </div>
        {isChangingPassword && (
          <div className="space-y-4">
            <InputField
              label="Current Password"
              type="password"
              value={passwordData.password}
              onChange={(e) => handlePasswordChange("password", e.target.value)}
              className="bg-white"
              disabled={updatePasswordMutation.isPending}
            />
            <InputField
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) =>
                handlePasswordChange("newPassword", e.target.value)
              }
              className="bg-white"
              disabled={updatePasswordMutation.isPending}
            />
            <InputField
              label="Confirm New Password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                handlePasswordChange("confirmPassword", e.target.value)
              }
              className="bg-white"
              disabled={updatePasswordMutation.isPending}
            />
            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordData({
                    password: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
                disabled={updatePasswordMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="gradient"
                size="md"
                icon={<FaLock className="w-4 h-4" />}
                onClick={handleUpdatePassword}
                disabled={updatePasswordMutation.isPending}
              >
                {updatePasswordMutation.isPending
                  ? "Changing..."
                  : "Change Password"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Setting;
