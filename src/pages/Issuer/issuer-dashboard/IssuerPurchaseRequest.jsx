import reviewIcon from "../../../assets/issuer-assets/review.svg";
import dollarSignIcon from "../../../assets/admin-assets/dollar-sign.svg";
import arrowRightIcon from "../../../assets/admin-assets/arrow-right.svg";
import { Button } from "../../../components/shared";
import CardData from "@/components/shared/CardData";
import { useNavigate } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa6";

const SUMMARY_CARDS = [
  {
    label: "Need Verification",
    value: "12",
    icon: reviewIcon,
  },
  {
    label: "Total Pending Value",
    value: "$2.4M",
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
    status: "Awaiting Review",
    date: "Nov 5",
    statusType: "review",
    id: 1,
  },
  {
    company: "TechStart AI Platform",
    category: "Enterprise Analytics",
    assetId: "AST-2025-001",
    issuanceId: "TIR-2025-048",
    contact: "UBS Wealth Management",
    email: "dkumar@ubs.com",
    status: "Awaiting Review",
    date: "Nov 6",
    statusType: "review",
    id: 2,
  },
  {
    company: "Urban Development Co",
    category: "Real Estate Development",
    assetId: "AST-2025-018",
    issuanceId: "TIR-2025-062",
    contact: "Morgan Stanley Wealth",
    email: "james.chen@ms.com",
    status: "Awaiting Review",
    date: "Nov 7",
    statusType: "review",
    id: 3,
  },
];

const IssuerPurchaseRequest = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h2 className="text-xl font-semibold text-[#0A0A0A] mb-4">
        Purchase Requests
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {SUMMARY_CARDS.map((card) => (
          <CardData
            key={card.label}
            label={card.label}
            value={card.value}
            icon={card.icon}
            iconAlignment="right"
          />
        ))}
      </div>

      {/* Issuances List */}
      <div className="space-y-3 mb-4">
        {ISSUANCES.map((issuance, index) => (
          <div
            key={index}
            className="border-b border-[#E5E5EA] pl-4 py-4"
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
                    className={`flex items-center rounded-full overflow-hidden border border-1.75 !border-[#A494FF] text-[11px] font-semibold ${
                      issuance.statusType === "review"
                        ? "border-[#A494FF]"
                        : "border-[#A494FF]"
                    }`}
                  >
                    <span
                      className={`px-3 py-1 border-r rounded-r-full !border-[#A494FF] border-1.75 `}
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(155, 60, 255, 0.1) 0%, rgba(45, 103, 255, 0.1) 100%)",
                      }}
                    >
                      {issuance.status}
                    </span>
                    <span className="px-3 py-1 text-[11px] text-[#48484A] font-[400] bg-white">
                      {issuance.date}
                    </span>
                  </div>
                </div>
                </div>
              </div>
              <div className="flex items-end justify-end">
                <Button
                  variant="gradient"
                  size="sm"
                  className="!rounded-full text-[13px] font-[500] !text-white !border-none"
                  onClick={() =>
                    navigate(
                      `/registrar/tokenization-issuance-queue/issued-details/${issuance.id}`
                    )
                  }
                >
                  Review
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-[400] text-[#000] cursor-pointer hover:text-gray-900">
          + 5 More 
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="!rounded-full border !border-black !text-[#000] !font-semibold h-[38px]"
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

export default IssuerPurchaseRequest;
