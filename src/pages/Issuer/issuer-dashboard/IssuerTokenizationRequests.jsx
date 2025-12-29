import dollarSignIcon from "../../../assets/admin-assets/dollar-sign.svg";
import arrowRightIcon from "../../../assets/admin-assets/arrow-right.svg";
import awaitingIcon from "../../../assets/issuer-assets/search-icon.svg";
import readyToPublishIcon from "../../../assets/issuer-assets/publish.svg";
import { Button } from "../../../components/shared";
import CardData from "@/components/shared/CardData";
import { useNavigate } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa6";

const SUMMARY_CARDS = [
  {
    label: "Assets Under Review",
    value: "3",
    icon: awaitingIcon,
  },
  {
    label: "Assets Ready to Publish",
    value: "2",
    icon: readyToPublishIcon,
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
    action: "Under Review",
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
    statusType: "publish",
    action: "Publish",
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
    statusType: "revise",
    action: "Revise",
    id: 3,
  },
];

const IssuerTokenizationRequests = () => {
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
            className="border-b border-gray-200 pl-4 py-4 hover:shadow-sm "
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
                    className={`flex items-center rounded-full overflow-hidden border border-1 !border-[#A494FF] text-[11px] font-semibold ${
                      request.statusType === "pending"
                        ? "border-[#A494FF]"
                        : "border-[#A494FF]"
                    }`}
                  >
                    <span
                      className={`px-3 py-1 border-r rounded-r-full !border-[#A494FF] border-1 `}
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(155, 60, 255, 0.1) 0%, rgba(45, 103, 255, 0.1) 100%)",
                      }}
                    >
                      {request.status}
                    </span>
                    <span className="px-3 py-1 text-[11px] text-[#48484A] font-[400] bg-white">
                      {request.date}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <Button
                  variant={
                    request.statusType === "pending" ? "ghost" : "gradient"
                  }
                  size="sm"
                  className={`!rounded-full !text-[13px] !font-[600] !h-[38px] !border-none ${
                    request.statusType === "pending"
                      ? "!bg-[#AEAEB2] !text-[#FFFFFF] hover:!bg-gray-200 hover:!text-[#000]"
                      : "!text-[#FFFFFF] "
                  }`}
                  onClick={() =>
                    navigate(
                      request.statusType === "minted"
                        ? `/issuer/assets/minted-details/${request.id}`
                        : `/issuer/assets/pending-review/${request.id}`
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
        <span className="text-[13px] font-[400] text-[#000] cursor-pointer hover:text-gray-900">
          + 2 More
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="!rounded-full border !border-black !text-[#000] !h-[38px] !font-semibold "
          icon={<FaChevronRight className="!h-3 !w-3" />}
          iconPosition="right"
          onClick={() => navigate("/issuer/assets")}
        >
          View All
        </Button>
      </div>
    </div>
  );
};

export default IssuerTokenizationRequests;
