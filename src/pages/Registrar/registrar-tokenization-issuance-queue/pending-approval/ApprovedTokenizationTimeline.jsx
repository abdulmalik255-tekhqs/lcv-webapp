import { useState } from "react";
import { FaArrowRight, FaCheck, FaCircle } from "react-icons/fa6";

const ApprovedTokenizationTimeline = ({ currentStep = 4 }) => {
  const [completedSteps, setCompletedSteps] = useState([1, 2, 3]);

  const steps = [
    {
      id: 1,
      label: "Purchase Request Submitted",
      date: "Nov 12, 2025",
      completed: true,
    },
    {
      id: 2,
      label: "Issuer Verified",
      date: "Nov 13, 2025",
      completed: true,
    },
    {
      id: 3,
      label: "Send to Registrar",
      date: "Nov 14, 2025",
      completed: true,
    },
    {
      id: 4,
      label: "Approve & Issue",
      date: null,
      completed: false,
      isCurrent: true,
      actionRequired: true,
    },
  ];

  const handleStepClick = (step) => {
    if (step.actionRequired && !completedSteps.includes(step.id)) {
      // Mark this step as completed
      setCompletedSteps((prev) => [...prev, step.id]);

      // If there's a next step, you could mark it as current here
      // For now, just mark the clicked step as completed
    }
  };

  return (
    <div className="space-y-4">
      <span className="text-[15px] font-medium text-[#000] !font-['Montserrat']">
        Purchase Request Timeline
      </span>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        {steps.map((step, index) => {
          const isStepCompleted =
            completedSteps.includes(step.id) || step.completed;
          const isCurrent = step.isCurrent && !isStepCompleted;
          const isFuture = !isStepCompleted && !isCurrent;
          const hasActionRequired = step.actionRequired && !isStepCompleted;

          return (
            <div
              key={step.id}
              className={`relative flex items-start gap-4 pb-6 last:pb-0 ${
                hasActionRequired ? "cursor-pointer hover:opacity-80" : ""
              }`}
              onClick={() => hasActionRequired && handleStepClick(step)}
            >
              {/* Icon */}
              <div className="relative z-10 flex-shrink-0">
                {isStepCompleted ? (
                  <div className="w-6 h-6 rounded-full bg-[#0734A9] flex items-center justify-center">
                    <FaCheck className="w-3 h-3 text-white" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-6 h-6 rounded-full bg-[#0734A9] flex items-center justify-center">
                    <FaArrowRight className="w-3 h-3 text-white" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full !bg-white !border-2 !border-[#0734A9] flex items-center justify-center">
                    <FaArrowRight className="w-3 h-3 text-[#000]" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <div className="flex items-start justify-start flex-col gap-2">
                  <p
                    className={`text-sm font-medium ${
                      isStepCompleted || isCurrent
                        ? "text-[#000]"
                        : "text-[#000]"
                    }`}
                  >
                    {step.label}
                  </p>
                  {hasActionRequired && (
                    <span className="text-xs font-medium text-[#0734A9]">
                      Action Required
                    </span>
                  )}
                </div>
                {step.date && (
                  <p
                    className={`text-xs ${
                      isStepCompleted || isCurrent
                        ? "text-gray-600"
                        : "text-[#000]"
                    }`}
                  >
                    {step.date}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApprovedTokenizationTimeline;
