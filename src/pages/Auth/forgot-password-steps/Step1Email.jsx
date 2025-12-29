import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { InputField, Button } from "../../../components/shared";
import { FieldCross } from "../../../assets";
import { isValidEmail } from "../../../utils";
import SubHeading from "@/components/shared/subheading";
import { useForgotPassword } from "../../../api";
import useToast from "@/hooks/useCustomToast";

const ForgotPasswordStep1 = ({ formData, onNext, onUpdateFormData }) => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(formData.email || "");
  const [error, setError] = useState("");
  const forgotPasswordMutation = useForgotPassword();
  const { showBottomRightToast: success, showErrorToast: showError } = useToast();

  const isLoading = forgotPasswordMutation.isPending;

  const handleChange = (event) => {
    const value = event.target.value;
    setEmail(value);
    setError("");
    onUpdateFormData({ email: value });
  };

  const handleClear = () => {
    setEmail("");
    setError("");
    onUpdateFormData({ email: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setError("Email address is required.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (isLoading) return;

    try {
      const response = await forgotPasswordMutation.mutateAsync({ email });

      if (response?.code) {
        success("Verification code sent to your email");
        // onNext will handle updating formData and URL params
        onNext({ email, forgotPasswordCode: response.code });
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to send verification code. Please try again.";
      showError(errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="py-4 sm:py-6 md:py-8 text-center">
        <h2 className="text-[32px] sm:text-3xl font-medium mb-3 font-[atacama]">
          Forgot Password?
        </h2>
        <SubHeading>
          Enter your email address and we'll send you a verification code to
          reset your password.
        </SubHeading>
      </div>

      <InputField
        label="Email address"
        hideLabel
        name="email"
        type="email"
        autoComplete="email"
        placeholder="Email address"
        required
        value={email}
        onChange={handleChange}
        error={error}
        clearButton={email ? <FieldCross /> : null}
        onClear={handleClear}
      />

       <Button
        type="submit"
        variant="gradient"
        disabled={isLoading}
        loading={isLoading}
        className="h-11 sm:h-12 text-sm sm:text-base font-semibold"
   
      >
        
          Continue
        
      </Button>

      <div className="text-xs sm:text-[13px] text-[#1C1C1E] text-center">
        Remember your password?{" "}
        <Link to="/login" className="text-[#131DBB] pl-1 font-medium">
          Sign in
        </Link>
      </div>
    </form>
  );
};

export default ForgotPasswordStep1;
