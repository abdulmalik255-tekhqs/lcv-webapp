import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { InputField, Button } from "../../../components/shared";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import useToast from "@/hooks/useCustomToast";
import { useForgotPasswordConfirm } from "../../../api";

const ForgotPasswordStep3 = ({
  formData,
  onUpdateFormData,
  onComplete,
  allFormData,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showBottomRightToast: success, showErrorToast: showError } = useToast();

  // Get all collected data - prioritize allFormData prop, then formData, then URL params
  const collectedData = allFormData || formData;
  const email = collectedData.email || searchParams.get("email") || "";
  const forgotPasswordVerifyCode =
    collectedData.forgotPasswordVerifyCode ||
    searchParams.get("forgotPasswordVerifyCode") ||
    "";
  const otp = collectedData.otp || searchParams.get("otp") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const confirmMutation = useForgotPasswordConfirm();

  const isSubmitting = confirmMutation.isPending;

  useEffect(() => {
    // Check URL params first (they update synchronously)
    const urlEmail = searchParams.get("email");
    const urlVerifyCode = searchParams.get("forgotPasswordVerifyCode");
    const urlOtp = searchParams.get("otp");

    const hasEmail = email || urlEmail;
    const hasVerifyCode = forgotPasswordVerifyCode || urlVerifyCode;
    const hasOtp = otp || urlOtp;

    if (!hasEmail || !hasVerifyCode || !hasOtp) {
      navigate("/forgot-password?step=1", { replace: true });
    }
  }, [email, forgotPasswordVerifyCode, otp, searchParams, navigate]);

  const handlePasswordChange = (event) => {
    const value = event.target.value;
    setPassword(value);
    setErrors((prev) => ({ ...prev, password: undefined }));
  };

  const handleConfirmPasswordChange = (event) => {
    const value = event.target.value;
    setConfirmPassword(value);
    setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    const nextErrors = {};

    if (!password || password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      // Send all collected data in one API call
      const confirmPayload = {
        email: email,
        code: forgotPasswordVerifyCode,
        otp: otp,
        password: password,
        confirm_password: confirmPassword,
      };

      const response = await confirmMutation.mutateAsync(confirmPayload);

      if (response?.success) {
        success("Successfully Reset Password!");
        // Clear form data
        onUpdateFormData({});
        // Wait a bit before redirecting to show success message
        setTimeout(() => {
          if (onComplete) {
            onComplete();
          }
        }, 1500);
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to reset password right now. Please try again.";
      showError(errorMessage);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="py-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold font-[atacama]">
          Reset Password
        </h2>
        <p className="mt-2 text-sm sm:text-[15px] font-normal text-[#000000]">
          Enter your new password below.
        </p>
      </div>

      <div className="relative w-full">
        <InputField
          label="New Password (at least 8 characters)"
          hideLabel
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="New Password (at least 8 characters)"
          required
          value={password}
          onChange={handlePasswordChange}
          error={errors.password}
          inputClassName="pr-12"
        />
        {password && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-[11px] p-1 text-gray-500 hover:text-gray-700 focus:outline-none z-10"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <AiOutlineEyeInvisible className="w-5 h-5" />
            ) : (
              <AiOutlineEye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      <div className="relative w-full">
        <InputField
          label="Confirm New Password"
          hideLabel
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Confirm New Password"
          required
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          error={errors.confirmPassword}
          inputClassName="pr-12"
        />
        {confirmPassword && (
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-[11px] p-1 text-gray-500 hover:text-gray-700 focus:outline-none z-10"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? (
              <AiOutlineEyeInvisible className="w-5 h-5" />
            ) : (
              <AiOutlineEye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

       <Button
        type="submit"
        variant="gradient"
        disabled={isSubmitting}
        loading={isSubmitting}
        className="h-11 sm:h-12 text-sm sm:text-base font-semibold"
   
      >
        
          Continue
        
      </Button>
      <Button
        type="button"
        variant="secondary"
        className="h-11 sm:h-12 -mt-2 text-sm sm:text-base font-semibold w-full !rounded-full border-1.5 !border-[#1C1C1E] text-[#120039] hover:bg-[#f4f5fa]"
        onClick={handleBackToLogin}
      >
        Back to Login
      </Button>
    </form>
  );
};

export default ForgotPasswordStep3;
