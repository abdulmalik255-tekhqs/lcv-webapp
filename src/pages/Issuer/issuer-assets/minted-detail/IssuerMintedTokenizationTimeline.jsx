import { FaArrowRight, FaCheck } from "react-icons/fa6";

const IssuerMintedTokenizationTimeline = () => {
  const steps = [
    {
      id: 1,
      label: "Issuer Asset Submission",
      date: "Nov 15, 2025",
      completed: true,
    },
    {
      id: 2,
      label: "Registrar Review",
      date: "REG-2025-001",
      completed: true,
    },
    {
      id: 3,
      label: "Asset Minted",
      status: "Pending",
      isCurrent: true,
    },
    {
      id: 4,
      label: "Published",
      date: null,
      completed: false,
    },
  ];

  return (
    <div className="space-y-4">
      <span className="text-[15px] font-medium text-[#000] !font-['Montserrat']">
        Tokenization Timeline
      </span>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        {steps.map((step) => {
          const isStepCompleted = step.completed;
          const isCurrent = step.isCurrent && !isStepCompleted;
          const isFuture = !isStepCompleted && !isCurrent;

          return (
            <div
              key={step.id}
              className="relative flex items-start gap-4 pb-6 last:pb-0"
            >
              {/* Icon */}
              <div className="relative z-16 flex-shrink-0">
                {isStepCompleted ? (
                  <div className="w-6 h-6 rounded-full bg-[#0734A9] flex items-center justify-center">
                    <FaCheck className="w-3 h-3 text-white" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-6 h-6  rounded-full !bg-white !border-2 !border-[#0734A9] flex items-center justify-center">
                    <FaArrowRight className="w-3 h-3 text-[#0734A9]" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full !bg-white  flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 ">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[#000]">
                    {step.label}
                  </p>
                </div>
                {step.date && (
                  <p className="text-xs text-gray-600 mt-1">
                    {step.date}
                  </p>
                )}
                {step.status && (
                  <p className="text-xs text-[#0734A9] font-medium mt-1">
                    {step.status}
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

export default IssuerMintedTokenizationTimeline;
