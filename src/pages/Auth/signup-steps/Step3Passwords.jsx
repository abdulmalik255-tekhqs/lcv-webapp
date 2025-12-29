import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { InputField, Button } from "../../../components/shared";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Step3Passwords = ({ formData, onNext, onBack, onUpdateFormData }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get data from URL params as fallback (in case formData hasn't updated yet)
  const email = formData.email || searchParams.get("email") || "";
  const otpVerifyCode =
    formData.otpVerifyCode || searchParams.get("otpVerifyCode") || "";

  const [password, setPassword] = useState(formData.password || "");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!email || !otpVerifyCode) {
      navigate("/signup?step=1", { replace: true });
    }
  }, [email, otpVerifyCode, navigate]);

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

  const handleSubmit = (event) => {
    event.preventDefault();
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

    // Pass password data to Step4 - no API calls here
    onNext({ password, confirmPassword });
  };

  const handleBackToLogin = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/login");
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className=" py-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold font-[atacama]">
          Create Account
        </h2>
      </div>

      <div className="relative w-full">
        <InputField
          label="Password (at least 8 characters)"
          hideLabel
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Password (at least 8 characters)"
          required
          value={password}
          onChange={handlePasswordChange}
          error={errors.password}
          inputClassName="pr-12"
        />
        {/* {password && ( */}
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
        {/* )} */}
      </div>

      <div className="relative w-full">
        <InputField
          label="Confirm Password"
          hideLabel
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Confirm Password"
          required
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          error={errors.confirmPassword}
          inputClassName="pr-12"
        />
        {/* {confirmPassword && ( */}
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
        {/* )} */}
      </div>

      <Button
        type="submit"
        variant="gradient"
        className="h-11 sm:h-12 text-sm sm:text-base font-semibold w-full"
        // loading={isLoading}
      >
        Continue
      </Button>

      <Button
        type="button"
        variant="secondary"
        className="h-11 sm:h-12 -mt-2 text-sm sm:text-[17px] font-medium w-full !rounded-full border-1.5 !border-[#1C1C1E] text-[#1C1C1E] hover:bg-[#f4f5fa]"
        onClick={handleBackToLogin}
      >
        Back to Login
      </Button>
    </form>
  );
};

export default Step3Passwords;
