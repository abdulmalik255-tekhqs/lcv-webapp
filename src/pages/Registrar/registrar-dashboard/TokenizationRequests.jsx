import awaitingIcon from "../../../assets/admin-assets/awaiting.svg";
import dollarSignIcon from "../../../assets/admin-assets/dollar-sign.svg";
import arrowRightIcon from "../../../assets/admin-assets/arrow-right.svg";
import { Button } from "../../../components/shared";
import CardData from "@/components/shared/CardData";
import { useNavigate } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa6";

const SUMMARY_CARDS = [
  {
    label: "Awaiting Review",
    value: "8",
    icon: awaitingIcon,
  },
  {
    label: "Ready to Mint",
    value: "1",
    icon: dollarSignIcon,
  },
];

const REQUESTS = [
  {
    company: "Urban Development Co",
    category: "Real Estate Development",
    assetId: "AST-2025-018",
    requestId: "REQ-2025-138",
    contact: "Urban Properties LLC",
    email: "development@urban.com",
    status: "Awaiting Review",
    date: "Nov 3",
    statusType: "pending",
    action: "Review",
    id: 1,
  },
  {
    company: "HealthTech Diagnostics",
    category: "Medical Devices",
    assetId: "AST-2025-008",
    requestId: "REQ-2025-124",
    contact: "MedTech Innovations",
    email: "michael.torres@medtech.com",
    status: "Awaiting Review",
    date: "Nov 4",
    statusType: "pending",
    action: "Review",
    id: 2,
  },
  {
    company: "Green Energy Solutions",
    category: "Renewable Energy",
    assetId: "AST-2025-005",
    requestId: "REQ-2025-118",
    contact: "GreenTech Holdings",
    email: "sarah.chen@greentech.com",
    status: "Awaiting Review",
    date: "Nov 6",
    statusType: "pending",
    action: "Review",
    id: 3,
  },
  {
    company: "TechStart AI Platform",
    category: "Enterprise Analytics",
    assetId: "AST-2025-001",
    requestId: "REQ-2025-112",
    contact: "TechCorp Inc.",
    email: "john.smith@techcorp.com",
    status: "Ready to Mint",
    date: "Nov 8",
    statusType: "minted",
    action: "Mint",
    id: 4,
  },
];

const TokenizationRequests = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h2 className="text-xl font-semibold text-[#0A0A0A] mb-4">
        Asset Tokenization Requests
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

      {/* Requests List */}
      <div className="space-y-3 mb-4">
        {REQUESTS.map((request, index) => (
          <div
            key={index}
            className="border-b border-gray-200 pl-4 py-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-[700] text-[#0A0A0A] mb-1">
                  {request.company}
                </h3>
                <p className="text-[13px] font-[500] text-[#000000] mb-1 ">
                  {request.category}
                </p>
                <div className="text-[11px] text-[#48484A] font-[400] space-y-0.5 mb-2">
                  <p>
                    {request.assetId} • {request.requestId}
                  </p>
                  <p>
                    {request.contact} • {request.email}
                  </p>
                </div>
                <div className="flex items-center">
                  <div
                    className={`flex items-center rounded-full overflow-hidden border text-[11px] font-semibold ${
                      request.statusType === "pending"
                        ? "border-[#A494FF]"
                        : "border-[#3BF695]"
                    }`}
                  >
                    <span
                      className={`px-3 py-1 border rounded-full `}
                      style={{
                        background:
                        request.statusType === "pending"
                            ? "linear-gradient(135deg, rgba(155, 60, 255, 0.1) 0%, rgba(45, 103, 255, 0.1) 100%)"
                            : "#3BF69533",
                      }}
                    >
                      {request.status}
                    </span>
                    <span className="px-3 py-1 text-xs text-[#48484A] font-[400] bg-white">
                      {request.date}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <Button
                  variant="gradient"
                  size="sm"
                  className="!rounded-full text-[13px] font-[500] !text-white"
                  onClick={() =>
                    navigate(
                      request.statusType === "minted"
                        ? `/registrar/assets/minted-details/${request.id}`
                        : `/registrar/assets/pending-review/${request.id}`
                    )
                  }
                >
                  {request.action}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between ">
        <span className="text-[13px] font-[400] text-[#000000] cursor-pointer hover:text-gray-900">
          + 5 More Requests
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="!rounded-full border !border-black "
         icon={<FaChevronRight className="!h-3 !w-3" />}
          iconPosition="right"
          onClick={() => navigate("/registrar/assets")}
        >
          View All
        </Button>
      </div>
    </div>
  );
};

export default TokenizationRequests;
