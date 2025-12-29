import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Card,
  Stepper,
} from "../../components/shared";
import { Logo } from "../../assets";
import Step1Email from "./signup-steps/Step1Email";
import Step2VerifyIdentity from "./signup-steps/Step2VerifyIdentity";
import Step3Passwords from "./signup-steps/Step3Passwords";
import Step4Name from "./signup-steps/Step4Name";
import LoginFooterComponent from "../layout/LoginFooter";

const TOTAL_STEPS = 4;

const SignUp = () => {
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
    otpRequestCode: searchParams.get("otpRequestCode") || "",
    otpVerifyCode: searchParams.get("otpVerifyCode") || "",
    otp: searchParams.get("otp") || "",
    password: searchParams.get("password") || "",
    confirmPassword: "",
    firstName: searchParams.get("firstName") || "",
    lastName: searchParams.get("lastName") || "",
    invitationId: searchParams.get("invitation_id") || "",
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
        setFormData(newFormData);
        // Update URL params with both step and form data
        updateUrlParams({ step: nextStep.toString(), ...stepUpdates });
      } else {
        // Just update step in URL
        updateUrlParams({ step: nextStep.toString() });
      }
      
      // Update step state - this triggers re-render with updated formData
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
          <Step1Email
            formData={formData}
            onNext={handleNext}
            onUpdateFormData={updateFormData}
          />
        );
      case 2:
        return (
          <Step2VerifyIdentity
            formData={formData}
            onNext={handleNext}
            onBack={handleBack}
            onUpdateFormData={updateFormData}
          />
        );
      case 3:
        return (
          <Step3Passwords
            formData={formData}
            onNext={handleNext}
            onBack={handleBack}
            onUpdateFormData={updateFormData}
          />
        );
      case 4:
        return (
          <Step4Name
            formData={formData}
            onUpdateFormData={updateFormData}
            onComplete={handleComplete}
            // Pass all collected data as prop to ensure Step4 has everything
            allFormData={formData}
          />
        );
      default:
        return null;
    }
  };

  // Sync step from URL when URL changes (but not when we're updating it ourselves)
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
          <Card className="w-full rounded-[20px] border-none bg-white px-4  sm:px-8 md:px-16 lg:px-24 xl:px-[200px] !py-[24px] ">
            <Stepper currentStep={currentStep} totalSteps={TOTAL_STEPS} className="!pb-[48px]" />
            {renderStep()}
          </Card>
        </div>
      </section>

      <LoginFooterComponent />
    </main>
  );
};

export default SignUp;
