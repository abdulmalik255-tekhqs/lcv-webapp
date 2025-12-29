import { FaChevronRight, FaArrowRight, FaCheck } from "react-icons/fa6";
import infoIcon from "@/assets/issuer-assets/info-circle.svg";
import guideIcon from "@/assets/issuer-assets/guide.svg";
import requiredIcon from "@/assets/issuer-assets/required.svg";
import supportIcon from "@/assets/issuer-assets/contact.svg";
function TokenizationRequirementsSidebar({
  filledSections,
  activeSection,
  onSectionClick,
}) {
  const sections = [
    {
      key: "basicInformation",
      label: "Basic Information",
    },
    {
      key: "businessDetails",
      label: "Business Details",
    },
    {
      key: "financialInformation",
      label: "Financial Information",
    },
    {
      key: "tokenizationDetails",
      label: "Tokenization Details",
    },
    {
      key: "legalCompliance",
      label: "Legal & Compliance Documents",
    },
    {
      key: "reviewSubmit",
      label: "Review & Submit",
    },
  ];

  const getSectionStatus = (sectionKey) => {
    if (activeSection === sectionKey) return "active";
    if (filledSections[sectionKey]) return "filled";
    return "pending";
  };

  return (
    <div className="space-y-6 my-4 px-4 ">
      {/* Tokenization Requirements */}
      <div className="bg-white  rounded-tr-[24px]">
        <h3 className="text-[15px] font-semibold text-[#000] mb-4 font-['Montserrat']">
          Tokenization Requirements
        </h3>
        <div className="relative">
          {/* Vertical connecting line - starts after first circle, ends before last circle */}
          <div className="absolute left-[9px] top-[25px] bottom-[16px] w-[2px] bg-[#E5E5EA]"></div>

          <div className="space-y-0">
            {sections.map((section, index) => {
              const status = getSectionStatus(section.key);
              const isActive = status === "active";
              const isFilled = status === "filled";
              const isPending = status === "pending";

              return (
                <button
                  key={section.key}
                  onClick={() => onSectionClick(section.key)}
                  className="w-full flex items-center gap-3 py-2 transition-colors relative z-10"
                >
                  <div
                    className={`rounded-full flex items-center justify-center flex-shrink-0 ${
                      isActive
                        ? "bg-white border-2 border-[#0734A9] w-5 h-5"
                        : isFilled
                        ? "bg-[#0734A9] w-5 h-5"
                        : "bg-white border-2 border-[#E5E5EA] w-3 h-3 ml-1"
                    }`}
                  >
                    {isActive && (
                      <FaArrowRight className="w-3 h-3 text-[#000]" />
                    )}
                    {isFilled && !isActive && (
                      <FaCheck className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span
                    className={`text-[13px] font-medium ${
                      isActive ? "text-[#000]" : isFilled ? "text-[#000]" : "text-[#636366]"
                    } ${isPending ? "text-[#000] ml-1" : "text-[#636366]"}`}
                  >
                    {section.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <hr className="border-t border-[#E5E5EA]"></hr>
      {/* What Happens Next */}
      <div className="bg-white   flex items-start justify-start gap-2 ">
      <h3 className="text-[15px] font-medium text-[#000] font-['Montserrat']">
          What Happens Next 
        </h3>
        <div className="flex items-start gap-2 !space-y-0 !my-0">
            <img src={infoIcon} alt="info" className="w-3 h-3 mt-1" />
          </div>
        </div>
        <div className="bg-white  px-4">
        <ul className="space-y-2 text-[13px] font-medium text-[#364153] list-disc marker:text-[#0734A9]">
          <li>
            Submit your request to the registrar for approval and minting.
          </li>
          <li>
            Once approved, you can add additional marketing and media info and
            publish to the marketplace.
          </li>
          <li>If your submission is denied, you can edit and resubmit.</li>
        </ul>
      </div>
      <hr className="border-t border-[#E5E5EA]"></hr>

      {/* Need Help? */}
      <div className="bg-white">
        <h3 className="text-[15px] font-medium text-[#364153] mb-4 font-['Montserrat']">
          Need Help?
        </h3>
        <div className="space-y-5">
          <a href="#" className="flex items-center justify-between ">
            <div className="flex items-center gap-3">
              <img src={guideIcon} alt="info" className="w-3 h-3 mt-1" />
              <span className="text-[13px] text-[#364153] font-medium">
                RWA Tokenization Guide
              </span>
            </div>
            <FaChevronRight className="w-3 h-3 text-gray-500" />
          </a>
          <a href="#" className="flex items-center justify-between ">
            <div className="flex items-center gap-3">
              <img src={requiredIcon} alt="info" className="w-3 h-3 mt-1" />
              <span className="text-[13px] text-[#364153] font-medium">
                Required Documents Checklist
              </span>
            </div>
            <FaChevronRight className="w-3 h-3 text-gray-500" />
          </a>
          <a href="#" className="flex items-center justify-between ">
            <div className="flex items-center gap-3">
              <img src={supportIcon} alt="info" className="w-3 h-3 mt-1" />
              <span className="text-[13px] text-[#364153] font-medium">
                Contact Support
              </span>
            </div>
            <FaChevronRight className="w-3 h-3 text-gray-500" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default TokenizationRequirementsSidebar;
