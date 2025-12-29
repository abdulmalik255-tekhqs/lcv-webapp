import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { InputField, Button } from "../../../components/shared";
import { FieldCross } from "../../../assets";
import { isValidEmail } from "../../../utils";
import SubHeading from "@/components/shared/subheading";
import { useValidateEmail, useSignupOtpRequest } from "../../../api";
import useToast from "@/hooks/useCustomToast";

const Step1Email = ({ formData, onNext, onUpdateFormData }) => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(formData.email || "");
  const [error, setError] = useState("");
  const validateEmailMutation = useValidateEmail();
  const otpRequestMutation = useSignupOtpRequest();
  const {showBottomRightToast: success, showErrorToast: showError } = useToast();

  const isLoading = validateEmailMutation.isPending || otpRequestMutation.isPending;

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
      // Extract invitation ID from URL params
      const invitationIdParam = searchParams.get("invitation");
      console.log("Raw invitation param:", invitationIdParam);
      console.log("All search params:", Object.fromEntries(searchParams.entries()));
      
      // Only include invitation_id if it exists and is not empty
      let invitationId = null;
      if (invitationIdParam && typeof invitationIdParam === "string" && invitationIdParam.trim() !== "") {
        invitationId = invitationIdParam.trim();
      }

      console.log("Processed invitation ID:", invitationId);
      console.log("Invitation ID type:", typeof invitationId);
      console.log("Invitation ID truthy check:", !!invitationId);

      // Step 1: Validate email
      const validateResponse = await validateEmailMutation.mutateAsync({ email });
      
      if (validateResponse?.is_taken) {
        showError("Email is already registered");
        return;
      }

      // Step 2: Request OTP - build payload conditionally
      const otpPayload = { email };
      if (invitationId) {
        otpPayload.invitation_id = invitationId;
      }

      console.log("Final OTP Payload being sent:", JSON.stringify(otpPayload, null, 2));
      console.log("Payload keys:", Object.keys(otpPayload));
      const otpResponse = await otpRequestMutation.mutateAsync(otpPayload);
      
      if (otpResponse?.code) {
        const updates = invitationId
          ? { 
              email,
              otpRequestCode: otpResponse.code,
              invitation_id: invitationId
            }
          : { 
              email,
              otpRequestCode: otpResponse.code
            };
        
        success("Verification code sent to your email");
        // onNext will handle updating formData and URL params
        onNext(updates);
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to process your request. Please try again.";
      showError(errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <div className="py-[48px] text-center">
        <h2 className="text-[32px] sm:text-3xl font-normal mb-[10px] font-['Atacama']">
          Create Account
        </h2>
        <SubHeading>
          Create an account now to unlock detailed insights, performance data,
          and full access to all investment opportunities.
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
        maxLength={60}
className="!mb-[24px]"
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

      <div className="text-[13px] !mt-[24px] font-normal text-[#48484A] text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-[#073BC3] pl-1 font-medium font-[13px]">
          Sign in
        </Link>
      </div>

    </form>
  );
};

export default Step1Email;
