import databaseIcon from "../../../assets/admin-assets/database.svg";
import dollarSignIcon from "../../../assets/admin-assets/dollar-sign.svg";
import arrowRightIcon from "../../../assets/admin-assets/arrow-right.svg";
import { Button } from "../../../components/shared";
import CardData from "@/components/shared/CardData";
import { useNavigate } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa6";

const SUMMARY_CARDS = [
  {
    label: "KYC Reviews",
    subHeading: "Awaiting Review",
    value: "430",
    icon: databaseIcon,
  },
  {
    label: "Capital Raised",
    subHeading: "Through platform",
    value: "156",
    icon: dollarSignIcon,
  },
  {
    label: "Active Users",
    subHeading: "Platform-Wide",
    value: "156",
    icon: dollarSignIcon,
  },
];

const ISSUANCES = [
  {
    company: "Green Energy Solutions",
    category: "Renewable Energy",
    assetId: "AST-2025-005",
    issuanceId: "TIR-2025-051",
    contact: "Michael Thompson",
    email: "m.thompson@yahoo.com",
    status: "Ready to Issue",
    date: "Nov 5",
    details: "20,000 Tokens - $200,000",
    statusType: "ready",
    id: 1,
  },
  {
    company: "TechStart AI Platform",
    category: "Enterprise Analytics",
    assetId: "AST-2025-001",
    issuanceId: "TIR-2025-048",
    contact: "UBS Wealth Management",
    email: "dkumar@ubs.com",
    status: "Ready to Issue",
    date: "Nov 6",
    details: "25,000 Tokens - $250,000",
    statusType: "ready",
    id: 2,
  },
  {
    company: "Urban Development Co",
    category: "Real Estate Development",
    assetId: "AST-2025-018",
    issuanceId: "TIR-2025-062",
    contact: "Morgan Stanley Wealth",
    email: "james.chen@ms.com",
    status: "Ready to Issue",
    date: "Nov 7",
    details: "30,000 Tokens - $300,000",
    statusType: "ready",
    id: 3,
  },
  {
    company: "HealthTech Diagnostics",
    category: "Medical Devices",
    assetId: "AST-2025-012",
    issuanceId: "TIR-2025-089",
    contact: "Jennifer Park",
    email: "jpark@gmail.com",
    status: "Ready to Issue",
    date: "Nov 8",
    details: "75,000 Tokens - $500,000",
    statusType: "ready",
    id: 4,
  },
];

const IssuanceQueue = () => {
  const navigate = useNavigate();
  return (
    <div className="rounded-[7px] bg-white  flex flex-col gap-5  ">
      <div class="flex  items-center justify-between self-stretch px-[15px] my-[13px]">
        <h2 className="font-['Montserrat'] text-[15px] font-semibold leading-[150%] text-[#0A0A0A] not-italic">
          Platform Activity
        </h2>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {SUMMARY_CARDS.map((card) => (
          <div
            key={card.label}
            className="flex flex-col gap-[18px] items-start justify-center self-stretch flex-1 p-[15px] !rounded-[7px] !border !border-[#E5E5EA] !bg-[#FAFAFC]"
          >
            <div className="flex flex-col gap-3 w-full">
              <div className="flex w-12 h-12 flex-col justify-center items-center gap-2.5 rounded-[99px] border border-[#F2F2F7] bg-[#FFF]">
                <img src={card.icon} alt="" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="font-['Montserrat'] text-[15px] font-medium leading-[150%] text-[var(--Dark-Black,#000)] not-italic">
                  {" "}
                  {card.label}
                </div>
                <div class="font-montserrat text-[11px] font-normal leading-[150%] text-[var(--dark-gray-3,#48484A)] not-italic">
                  {" "}
                  {card.subHeading}
                </div>
              </div>
            </div>
            <div class="flex flex-col items-start justify-end self-stretch flex-1 gap-[-1px]">
              <p class="font-['Montserrat'] text-[32px] font-semibold leading-[120%] tracking-[0.64px] text-[#0A0A0A] not-italic">
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Issuances List */}
      <div className="space-y-3 mb-4">
        {ISSUANCES.map((issuance, index) => (
          <div
            key={index}
            className="border-b border-gray-200 pl-4 py-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-[700] text-[#0A0A0A] mb-1">
                  {issuance.company}
                </h3>
                <p className="text-[13px] font-[500] text-[#000000] mb-1 ">
                  {issuance.category}
                </p>
                <div className="text-[11px] text-[#48484A] font-[400] space-y-0.5 mb-2">
                  <p>
                    {issuance.assetId} • {issuance.issuanceId}
                  </p>
                  <p>
                    {issuance.contact} • {issuance.email}
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center">
                    <div
                      className={`flex items-center rounded-full overflow-hidden border text-[11px] font-semibold ${
                        issuance.statusType === "minted"
                          ? "border-[#A494FF]"
                          : "border-[#3BF695]"
                      }`}
                    >
                      <span
                        className={`px-3 py-1 border rounded-full `}
                        style={{
                          background:
                            issuance.statusType === "minted"
                              ? "linear-gradient(135deg, rgba(155, 60, 255, 0.1) 0%, rgba(45, 103, 255, 0.1) 100%)"
                              : "#3BF69533",
                        }}
                      >
                        {issuance.status}
                      </span>
                      <span className="px-3 py-1 text-xs text-[#48484A] font-[400] bg-white">
                        {issuance.date}
                      </span>
                    </div>
                    <p className="text-[13px] font-semibold !text-[#48484A] px-1.5">
                      20,000 Tokens
                    </p>{" "}
                    •
                    <p className="text-[13px] font-semibold !text-[#48484A] px-1.5">
                      $200,000
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-end">
                <Button
                  variant=""
                  size="sm"
                  className="!rounded-full flex !h-[38px] !min-w-[38px] !items-center !justify-center self-stretch gap-2 border-[0.5px] border-[#D1D1D6]"
                  onClick={() =>
                    navigate(
                      `/registrar/tokenization-issuance-queue/issued-details/${issuance.id}`
                    )
                  }
                >
                  <img src={arrowRightIcon} alt="" />{" "}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-[400] text-[#000000] cursor-pointer hover:text-gray-900">
          + 42 More Requests
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="!rounded-full border !border-black"
          icon={<FaChevronRight className="!h-3 !w-3" />}
          iconPosition="right"
          onClick={() => navigate("/registrar/tokenization-issuance-queue")}
        >
          View All
        </Button>
      </div>
    </div>
  );
};

export default IssuanceQueue;