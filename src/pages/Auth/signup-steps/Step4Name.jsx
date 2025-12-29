import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { InputField, Button } from "../../../components/shared";
import { FieldCross } from "../../../assets";
import useToast from "@/hooks/useCustomToast";
import { useSignup } from "../../../api";

const Step4Name = ({ formData, onUpdateFormData, onComplete, allFormData }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showBottomRightToast: success, showErrorToast: showError } = useToast();

  // Get all collected data - prioritize allFormData prop, then formData, then URL params
  const collectedData = allFormData || formData;
  const email = collectedData.email || searchParams.get("email") || "";
  const otpVerifyCode =
    collectedData.otpVerifyCode || searchParams.get("otpVerifyCode") || "";
  const password = collectedData.password || searchParams.get("password") || "";
  const confirmPassword =
    collectedData.confirmPassword || searchParams.get("confirmPassword") || "";
  const otp = collectedData.otp || searchParams.get("otp") || "";

  const [firstName, setFirstName] = useState(formData.firstName || "");
  const [lastName, setLastName] = useState(formData.lastName || "");
  const [errors, setErrors] = useState({});
  const signupMutation = useSignup();

  const isSubmitting = signupMutation.isPending;

  useEffect(() => {
    if (!email || !otpVerifyCode || !password) {
      navigate("/signup?step=1", { replace: true });
    }
  }, [email, otpVerifyCode, password, navigate]);

  const handleFirstNameChange = (event) => {
    const value = event.target.value;
    setFirstName(value);
    setErrors((prev) => ({ ...prev, firstName: undefined }));
    if (onUpdateFormData) {
      onUpdateFormData({ firstName: value });
    }
  };

  const handleLastNameChange = (event) => {
    const value = event.target.value;
    setLastName(value);
    setErrors((prev) => ({ ...prev, lastName: undefined }));
    if (onUpdateFormData) {
      onUpdateFormData({ lastName: value });
    }
  };

  const handleClearFirstName = () => {
    setFirstName("");
    setErrors((prev) => ({ ...prev, firstName: undefined }));
    if (onUpdateFormData) {
      onUpdateFormData({ firstName: "" });
    }
  };

  const handleClearLastName = () => {
    setLastName("");
    setErrors((prev) => ({ ...prev, lastName: undefined }));
    if (onUpdateFormData) {
      onUpdateFormData({ lastName: "" });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    const nextErrors = {};

    if (!firstName.trim()) {
      nextErrors.firstName = "First name is required.";
    }

    if (!lastName.trim()) {
      nextErrors.lastName = "Last name is required.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      // Collect all data from all steps and send in one API call
      const signupPayload = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email,
        password: password,
        confirm_password: confirmPassword || password,
        code: otpVerifyCode,
        otp: otp,
      };

      const response = await signupMutation.mutateAsync(signupPayload);

      if (response) {
        success("Account created successfully! Redirecting to login...");
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
        "Unable to create account right now. Please try again.";
      showError(errorMessage);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className=" py-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold font-[atacama]">
          Create Account
        </h2>
      </div>

      <InputField
        label="First Name"
        hideLabel
        name="firstName"
        type="text"
        autoComplete="given-name"
        placeholder="First Name"
        required
        value={firstName}
        onChange={handleFirstNameChange}
        error={errors.firstName}
        clearButton={firstName ? <FieldCross /> : null}
        onClear={handleClearFirstName}
      />

      <InputField
        label="Last Name"
        hideLabel
        name="lastName"
        type="text"
        autoComplete="family-name"
        placeholder="Last Name"
        required
        value={lastName}
        onChange={handleLastNameChange}
        error={errors.lastName}
        clearButton={lastName ? <FieldCross /> : null}
        onClear={handleClearLastName}
      />

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
        className="h-11 sm:h-12 -mt-2 text-sm sm:text-[17px] font-medium w-full !rounded-full border-1.5 !border-[#1C1C1E] text-[#1C1C1E] hover:bg-[#f4f5fa]"
        onClick={handleBackToLogin}
      >
        Back to Login
      </Button>
    </form>
  );
};

export default Step4Name;
