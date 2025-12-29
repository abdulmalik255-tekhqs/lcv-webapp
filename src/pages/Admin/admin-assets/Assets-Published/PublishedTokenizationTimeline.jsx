import { FaCheck } from "react-icons/fa6";

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Format date with time
const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const PublishedTokenizationTimeline = ({ asset }) => {
  const assetRegistrar = asset?.assetRegistrar || {};
  const registrarId = assetRegistrar?.id?.substring(0, 8).toUpperCase() || "REG-XXXX";
  
  const steps = [
    {
      id: 1,
      label: "Issuer Asset Submission",
      subText: formatDate(asset?.created_at) || "N/A",
    },
    {
      id: 2,
      label: "Registrar Reviewed",
      subText: assetRegistrar?.id
        ? [`REG-${registrarId}`, formatDate(asset?.updated_at) || "N/A"]
        : formatDate(asset?.updated_at) || "N/A",
    },
    {
      id: 3,
      label: "Tokens Minted",
      subText: assetRegistrar?.id
        ? [`REG-${registrarId}`, formatDateTime(asset?.updated_at) || "N/A"]
        : formatDateTime(asset?.updated_at) || "N/A",
    },
    {
      id: 4,
      label: "Published",
      subText: formatDate(asset?.updated_at) || "N/A",
    },
  ];

  return (
    <div className="pt-8">
      <h4 className="text-[20px] font-[500] text-[#000] mb-6 !font-['Atacama']">
        Tokenization Timeline
      </h4>
      <div className="relative mt-6">
        {/* Vertical line */}
        <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-[#E5E5EA]"></div>

        {steps.map((step, index) => (
          <div
            key={step.id}
            className="relative flex items-start gap-4 pb-6 last:pb-0"
          >
            {/* Icon - All completed (blue circle with white checkmark) */}
            <div className="relative z-10 flex-shrink-0">
              <div className="w-5 h-5 rounded-full bg-[#0734A9] flex items-center justify-center">
                <FaCheck className="w-3 h-3 text-white" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 pt-0.5">
              <p className="text-[15px] font-medium text-[#000] mb-1">
                {step.label}
              </p>
              {Array.isArray(step.subText) ? (
                <div className="space-y-0.5">
                  {step.subText.map((text, idx) => (
                    <p key={idx} className="text-[13px] font-normal text-[#000]">
                      {text}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] font-normal text-[#000]">
                  {step.subText}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublishedTokenizationTimeline;
