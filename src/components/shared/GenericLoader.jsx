import { useEffect, useState } from "react";
import greenCheck from "@/assets/admin-assets/check.svg";
// Icons
import validatingBlue from "@/assets/admin-assets/validating-blue.svg";
import connectingBlue from "@/assets/admin-assets/connecting-blue.svg";
import connectingGray from "@/assets/admin-assets/connecting-gray.svg";
import walletBlue from "@/assets/admin-assets/creating-blue.svg";
import walletGray from "@/assets/admin-assets/creating-gray.svg";
import issuingBlue from "@/assets/admin-assets/minting-blue.svg";
import issuingGray from "@/assets/admin-assets/minting-gray.svg";
import recordingBlue from "@/assets/admin-assets/recording-blue.svg";
import recordingGray from "@/assets/admin-assets/recording-gray.svg";
import confirmingBlue from "@/assets/admin-assets/confirming-blue.svg";
import confirmingGray from "@/assets/admin-assets/confirming-gray.svg";
const steps = [
  {
    label: "Validating Request Data",
    activeIcon: validatingBlue,
    pendingIcon: validatingBlue, // Will be styled with grayscale when pending
  },
  {
    label: "Connecting to Canton Network",
    activeIcon: connectingBlue,
    pendingIcon: connectingGray,
  },
  {
    label: "Verifying Purchaser Wallet",
    activeIcon: walletBlue,
    pendingIcon: walletGray,   // <-- THIS FIXES STEP2
  },
  {
    label: "Issuing Tokens to Purchaser",
    activeIcon: issuingBlue,
    pendingIcon: issuingGray,
  },
  {
    label: "Recording Transaction",
    activeIcon: recordingBlue,
    pendingIcon: recordingGray,
  },
  {
    label: "Confirming on Ledger",
    activeIcon: confirmingBlue,
    pendingIcon: confirmingGray,
  },
];
const GenericLoader = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [allStepsDone, setAllStepsDone] = useState(false);
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setCompletedSteps([]);
      setAllStepsDone(false);
      return;
    }
    // Reset state when opening
    setCurrentStep(0);
    setCompletedSteps([]);
    setAllStepsDone(false);
    let stepIndex = 0;
    const timers = [];
    const process = () => {
      setCurrentStep(stepIndex);
      const t = setTimeout(() => {
        const currentStepIndex = stepIndex; // Capture the current step index
        // Mark current step as completed
        setCompletedSteps((prev) => {
          if (prev.includes(currentStepIndex)) {
            return prev;
          }
          return [...prev, currentStepIndex];
        });
        // Move to next step
        if (currentStepIndex < steps.length - 1) {
          stepIndex = currentStepIndex + 1;
          // Small delay to ensure React has processed the completedSteps update
          const nextStepTimer = setTimeout(() => {
            process();
          }, 100);
          timers.push(nextStepTimer);
        } else {
          // Last step completed - show final state
          setCurrentStep(-1);
          // After showing all completed with checkmarks, keep them visible
          const f = setTimeout(() => {
            setAllStepsDone(true);
            setTimeout(() => {
              if (onComplete) {
                onComplete();
              } else if (onClose) {
                onClose();
              }
            }, 800);
          }, 600);
          timers.push(f);
        }
      }, 1500);
      timers.push(t);
    };
    process();
    return () => timers.forEach(clearTimeout);
  }, [isOpen, onClose, onComplete]);
  const getStepStatus = (i) => {
    // Priority: final > completed > active > pending
    if (allStepsDone) return "final";
    // Check if step is completed (in completedSteps array and not currently active)
    if (completedSteps.includes(i) && currentStep !== i) return "completed";
    // Check if step is currently active
    if (currentStep === i) return "active";
    // Otherwise it's pending
    return "pending";
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-[80] flex items-center justify-center p-6">
      <div className="bg-[#FAFAFC] w-full max-w-xl rounded-[14px] p-6 shadow-xl">
        {/* Title */}
        <h2 className="text-center font-['Atacama'] mt-6 font-normal text-[24px] leading-[120%] tracking-[0%] text-[#000] mb-2">
          Issuing Tokens on Blockchain
        </h2>
        <p className="text-center font-['Montserrat'] font-normal text-[15px] leading-[150%] tracking-[0%] text-[#000] mb-6">
          Please wait while we process your request.
        </p>
        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 border-t border-[#E5E5EA]" />
          <p className="text-center text-[13px] font-bold text-[#000] whitespace-nowrap">
            Status
          </p>
          <div className="flex-1 border-t border-[#E5E5EA]" />
        </div>
        <div className="space-y-3">
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            const isCompleted = status === "completed";
            const isActive = status === "active";
            const isPending = status === "pending";
            const isFinal = status === "final";
            /** PRIORITY: final > completed > active > pending */
            const isFirstStep = index === 0;
            let icon = step.pendingIcon;
            let border = "border-gray-300";
            let labelColor = "text-gray-400";
            let spinner = false;
            let check = false;
            let iconClass = "w-4 h-4";
            // Check final state first (all steps done)
            if (isFinal) {
              icon = step.activeIcon;
              border = "border-[#0734A9]";
              labelColor = "text-[#000]";
              check = true;
            }
            // Check completed state (step is done, but not all steps are done yet)
            else if (isCompleted) {
              icon = step.activeIcon;
              border = "border-[#0734A9]";
              labelColor = "text-[#000]";
              check = true; // Show checkmark immediately when step completes
            }
            // Check active state (currently processing)
            else if (isActive) {
              icon = step.activeIcon;
              border = "border-[#0734A9]";
              labelColor = "text-[#000]";
              spinner = true;
            }
            // Check pending state (not started yet)
            else if (isPending) {
              // First step always shows blue, even when pending
              if (isFirstStep) {
                icon = step.activeIcon;
                border = "border-[#0734A9]";
                labelColor = "text-[#000]";
              } else {
                icon = step.pendingIcon;
                border = "border-gray-300";
                labelColor = "text-gray-400";
                iconClass += " opacity-50 grayscale";
              }
            }
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#E5E5EA] shadow-sm"
              >
                <div className="flex items-center gap-3">
                  {/* Icon with spinner */}
                  <div className="relative flex-shrink-0 w-8 h-8">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white ${border}`}
                    >
                      <img src={icon} alt={step.label} className={iconClass} />
                    </div>
                    {spinner && (
                      <div className="absolute inset-0 rounded-full pointer-events-none" style={{ zIndex: 20 }}>
                        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#0734A9] border-r-[#0734A9] animate-spin" style={{ animationDuration: "0.8s" }} />
                      </div>
                    )}
                  </div>
                  {/* Label */}
                  <p className={`text-[13px] font-medium ${labelColor}`}>
                    {step.label}
                  </p>
                </div>
                {/* Green checkmark */}
                {check && (
                  <div className="flex-shrink-0">
                    <img src={greenCheck} alt="Completed" className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default GenericLoader;