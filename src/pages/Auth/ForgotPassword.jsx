import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Card,
  Stepper,
} from "../../components/shared";
import { Logo } from "../../assets";
import LoginFooterComponent from "../layout/LoginFooter";
import ForgotPasswordStep1 from "./forgot-password-steps/Step1Email";
import ForgotPasswordStep2 from "./forgot-password-steps/Step2VerifyOtp";
import ForgotPasswordStep3 from "./forgot-password-steps/Step3NewPassword";

const TOTAL_STEPS = 3;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get initial state from URL params
  const stepFromUrl = parseInt(searchParams.get("step") || "1", 10);
  const [currentStep, setCurrentStep] = useState(
    stepFromUrl >= 1 && stepFromUrl <= TOTAL_STEPS ? stepFromUrl : 1
  );

  // Initialize form data from URL params
  const [formData, setFormData] = useState({
    email: searchParams.get("email") || "",
    forgotPasswordCode: searchParams.get("forgotPasswordCode") || "",
    forgotPasswordVerifyCode: searchParams.get("forgotPasswordVerifyCode") || "",
    otp: searchParams.get("otp") || "",
    password: searchParams.get("password") || "",
    confirmPassword: "",
  });

  // Update URL params when form data or step changes
  const updateUrlParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    
    setSearchParams(newParams, { replace: true });
  };

  const updateFormData = (updates) => {
    setFormData((prev) => {
      const newData = { ...prev, ...updates };
      // Update URL params with new data
      updateUrlParams(updates);
      return newData;
    });
  };

  const handleNext = (stepUpdates = {}) => {
    if (currentStep < TOTAL_STEPS) {
      const nextStep = currentStep + 1;
      
      // Update form data and URL params together
      if (Object.keys(stepUpdates).length > 0) {
        const newFormData = { ...formData, ...stepUpdates };
        // Update formData state
        setFormData(newFormData);
        // Update URL params with both step and form data (URL updates are synchronous)
        updateUrlParams({ step: nextStep.toString(), ...stepUpdates });
      } else {
        // Just update step in URL
        updateUrlParams({ step: nextStep.toString() });
      }
      
      // Update step state - this triggers re-render
      // Step components read from URL params as fallback, so they'll have the data
      setCurrentStep(nextStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      updateUrlParams({ step: prevStep.toString() });
    } else {
      navigate("/login");
    }
  };

  const handleComplete = () => {
    // Clear URL params and redirect to login
    navigate("/login", { replace: true });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ForgotPasswordStep1
            formData={formData}
            onNext={handleNext}
            onUpdateFormData={updateFormData}
          />
        );
      case 2:
        return (
          <ForgotPasswordStep2
            formData={formData}
            onNext={handleNext}
            onBack={handleBack}
            onUpdateFormData={updateFormData}
          />
        );
      case 3:
        return (
          <ForgotPasswordStep3
            formData={formData}
            onUpdateFormData={updateFormData}
            onComplete={handleComplete}
            allFormData={formData}
          />
        );
      default:
        return null;
    }
  };

  // Sync step from URL when URL changes
  useEffect(() => {
    const stepFromUrl = parseInt(searchParams.get("step") || "1", 10);
    if (stepFromUrl >= 1 && stepFromUrl <= TOTAL_STEPS && stepFromUrl !== currentStep) {
      setCurrentStep(stepFromUrl);
    }
  }, [searchParams, currentStep]);

  return (
    <main className="flex min-h-screen flex-col bg-[#f4f5fa] !w-full">
      <header className="relative h-40 sm:h-48 md:h-60 w-full bg-gradient-to-b from-black via-[#16003a] to-[#5c00c7]">
        <div className="flex mt-8 sm:mt-12 items-center justify-center cursor-pointer" onClick={() => navigate("/")}>
          <Logo className="!h-12 w-auto text-white sm:h-8" />
        </div>
      </header>

      <section className="relative z-10 flex flex-1 justify-center px-4 sm:px-6">
        <div className="-mt-14 sm:-mt-20 md:-mt-24 w-full max-w-4xl py-4">
          <Card className="w-full rounded-[20px] border-none bg-white px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[200px] py-6 md:py-10 sm:py-[24px]">
            <Stepper currentStep={currentStep} totalSteps={TOTAL_STEPS} />
            {renderStep()}
          </Card>
        </div>
      </section>

      <LoginFooterComponent />
    </main>
  );
};

export default ForgotPassword;
