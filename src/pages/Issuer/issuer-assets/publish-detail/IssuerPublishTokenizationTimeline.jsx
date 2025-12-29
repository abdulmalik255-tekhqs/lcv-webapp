import { FaCheck } from "react-icons/fa6";

const IssuerPublishTokenizationTimeline = () => {
  const steps = [
    {
      id: 1,
      label: "Issuer Asset Submission",
      date: "Nov 15, 2025",
      completed: true,
    },
    {
      id: 2,
      label: "Registrar Reviewed",
      referenceNumber: "REG-2025-098",
      date: "Nov 16, 2025",
      completed: true,
    },
    {
      id: 3,
      label: "Tokens Minted",
      referenceNumber: "REG-2025-126",
      date: "Nov 16, 2025, 2:30 PM PST",
      completed: true,
    },
    {
      id: 4,
      label: "Published",
      date: "Nov 18, 2025",
      completed: true,
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
          return (
            <div
              key={step.id}
              className="relative flex items-start gap-4 pb-6 last:pb-0"
            >
              {/* Icon */}
              <div className="relative z-16 flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-[#0734A9] flex items-center justify-center">
                  <FaCheck className="w-3 h-3 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 ">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[#000]">
                    {step.label}
                  </p>
                </div>
                {step.referenceNumber && (
                  <p className="text-xs text-gray-600 mt-1">
                    {step.referenceNumber}
                  </p>
                )}
                {step.date && (
                  <p className="text-xs text-gray-600 mt-1">
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

export default IssuerPublishTokenizationTimeline;
