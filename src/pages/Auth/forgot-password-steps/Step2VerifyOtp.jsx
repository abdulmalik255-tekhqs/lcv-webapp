import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../../components/shared";
import useToast from "@/hooks/useCustomToast";
import { useForgotPasswordVerifyOtp, useForgotPassword } from "../../../api";

const CODE_LENGTH = 6;

const ForgotPasswordStep2 = ({
  formData,
  onNext,
  onBack,
  onUpdateFormData,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {showBottomRightToast: success, showErrorToast: showError } =
  useToast();

  // Get data from URL params as fallback
  const email = formData.email || searchParams.get("email") || "";
  const forgotPasswordCode =
    formData.forgotPasswordCode || searchParams.get("forgotPasswordCode") || "";

  const [code, setCode] = useState(
    formData.otp ? formData.otp.split("") : Array(CODE_LENGTH).fill("")
  );
  const inputRefs = useRef([]);
  const otpVerifyMutation = useForgotPasswordVerifyOtp();
  const forgotPasswordMutation = useForgotPassword();

  const isLoading =
    otpVerifyMutation.isPending || forgotPasswordMutation.isPending;

  useEffect(() => {
    // Check URL params first (they update synchronously)
    const urlEmail = searchParams.get("email");
    const urlCode = searchParams.get("forgotPasswordCode");

    const hasEmail = email || urlEmail;
    const hasCode = forgotPasswordCode || urlCode;

    if (!hasEmail || !hasCode) {
      navigate("/forgot-password?step=1", { replace: true });
      return;
    }
    inputRefs.current[0]?.focus();
  }, [email, forgotPasswordCode, searchParams, navigate]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    setCode((previous) => {
      const next = [...previous];
      next[index] = value;
      return next;
    });

    if (value && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      event.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH);

    if (!pasted) return;

    const padded = Array(CODE_LENGTH)
      .fill("")
      .map((_, index) => pasted[index] ?? "");

    setCode(padded);
    const nextFocusIndex = Math.min(pasted.length, CODE_LENGTH) - 1;
    inputRefs.current[Math.max(nextFocusIndex, 0)]?.focus();
    event.preventDefault();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isLoading) return;

    const isComplete = code.every((digit) => digit.trim().length === 1);
    if (!isComplete) {
      showError("Enter the 6-digit code to continue.");
      return;
    }

    const otp = code.join("");

    try {
      const response = await otpVerifyMutation.mutateAsync({
        email: email,
        code: forgotPasswordCode,
        otp: otp,
      });

      if (response?.code) {
        success("Identity verified.");
        onNext({ otp, forgotPasswordVerifyCode: response.code });
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Invalid verification code. Please try again.";
      showError(errorMessage);
      setCode(Array(CODE_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (!email || isLoading) return;

    try {
      const response = await forgotPasswordMutation.mutateAsync({ email });

      if (response?.code) {
        onUpdateFormData({ forgotPasswordCode: response.code });
        showBottomRightToast(`We sent a fresh verification code to ${email}.`);
        inputRefs.current[0]?.focus();
        setCode(Array(CODE_LENGTH).fill(""));
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to resend code. Please try again.";
      showError(errorMessage);
    }
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="text-center">
        <h2 className="text-[32px] mt-4 font-[500px] font-atacama text-[#000000]">
          Verify Your Identity
        </h2>
        <p className="mt-2 text-[15px] font-normal text-[#000000]">
          Enter the 6-digit code sent to{" "}
        </p>
        <span className="font-semibold text-[#000000] text-[15px]">
          {email || "your email"}
        </span>
      </div>

      <div
        className="flex flex-wrap justify-center gap-2"
        onPaste={handlePaste}
      >
        {code.map((digit, index) => (
          <input
            key={`code-${index}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            onChange={(event) => handleChange(index, event.target.value.trim())}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className="h-16 w-12 rounded-[14px] border border-[#AEAEB2] bg-[#F8F7FF] text-center text-2xl font-semibold text-[#120039] focus:border-[#5C00F0] focus:border-1.5 focus:outline-none sm:h-16 sm:w-12"
          />
        ))}
      </div>

     <Button
        type="submit"
        variant="gradient"
        disabled={isLoading}
        loading={isLoading}
        className="h-11 sm:h-12 text-sm sm:text-base font-semibold"
   
      >
        
          Continue
        
      </Button>
      <Button
        type="button"
        variant="secondary"
        className="h-11 sm:h-12 text-sm sm:text-base -mt-2 font-semibold w-full !rounded-full border-1.5 !border-[#1C1C1E] text-[#120039] hover:bg-[#f4f5fa]"
        onClick={onBack}
      >
        Back
      </Button>

      <div className="text-xs sm:text-[13px] text-[#1C1C1E] text-center">
        Didn't receive the code?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={isLoading}
          className="font-semibold text-[#000] hover:text-[#3400b5] underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Sending..." : "Resend"}
        </button>
      </div>
    </form>
  );
};

export default ForgotPasswordStep2;
