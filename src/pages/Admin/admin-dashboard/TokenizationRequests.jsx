import kycReviewIcon from "../../../assets/admin-assets/kycReviewIcon.svg";
import activeUserIcon from "../../../assets/admin-assets/activeUserIcon.svg";
import { Button } from "../../../components/shared";
import CardData from "@/components/shared/CardData";
import { useNavigate } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa6";
import { FiPlus } from "react-icons/fi";
import { useState } from "react";
import InviteUserModal from "./InviteUserModal";

const SUMMARY_CARDS = [
  {
    label: "KYC Reviews",
    subHeading: "Awaiting Review",
    value: "430",
    icon: kycReviewIcon,
  },
  {
    label: "Active Users",
    subHeading: "Platform-Wide",
    value: "156",
    icon: activeUserIcon,
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
    status: "Pending",
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
    status: "Pending",
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
    action: "Review",
    id: 4,
  },
];

const TokenizationRequests = () => {
  const [isInviteOpen, setInviteOpen] = useState(false);

  const navigate = useNavigate();
  return (
    <div className="rounded-[7px] bg-white  flex flex-col gap-5 ">
      <div class="flex  items-center justify-between self-stretch px-[15px]">
        <h2 className="text-[15px] font-semibold leading-[150%] text-[#0A0A0A] not-italic">
          User Management
        </h2>

        <Button
          onClick={() => setInviteOpen(true)}
          variant="secondary"
          size="md"
          className="!justify-center !rounded-full  !border-[1.5px]  !border-[#1C1C1E] px-[15px] flex mt-3 h-[38px] min-w-[38px] items-center gap-2"
          icon={<FiPlus className="!h-4 !w-4 " />}
          iconPosition="left"
          // onClick={() => navigate("/issuer/assets")}
        >
          Invite User
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {SUMMARY_CARDS.map((card) => (
          <div
            key={card.label}
            className="flex flex-col gap-20 items-start justify-center self-stretch flex-1 p-[15px] !rounded-[7px] !border !border-[#E5E5EA] !bg-[#FAFAFC]"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-1">
                <div className="text-[15px] font-medium leading-[150%] text-[var(--Dark-Black,#000)] not-italic">
                  {" "}
                  {card.label}
                </div>
                <div class="font-montserrat text-[11px] font-normal leading-[150%] text-[var(--dark-gray-3,#48484A)] not-italic">
                  {" "}
                  {card.subHeading}
                </div>
              </div>
              <div className="flex w-12 h-12 flex-col justify-center items-center gap-2.5 rounded-[99px] border border-[#F2F2F7] bg-[#FFF]">
                <img src={card.icon} alt="" />
              </div>
            </div>

            <div class="flex flex-col items-start justify-end self-stretch flex-1 gap-[-1px]">
              <p class="text-[32px] font-semibold leading-[120%] tracking-[0.64px] text-[#0A0A0A] not-italic">
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Requests List */}
      <div className="space-y-3 mb-4">
        {REQUESTS.map((request, index) => (
          <div
            key={index}
            class="flex flex-col items-start self-stretch  border-b border-gray-200  pl-4 py-4 "
          >
            <div className="flex items-start justify-between w-full">
              <div className="flex-1">
                <h3 className=" text-[15px] font-semibold mb-1">
                  {request.company}
                </h3>
                <p className="text-[13px] font-medium mb-1 ">
                  {request.category}
                </p>
                <div className="text-[11px] font-normal  mb-2">
                  <p>
                    {request.assetId} • {request.requestId}
                  </p>
                  <p className=" text-[11px] font-normal">
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
      <InviteUserModal
        open={isInviteOpen}
        onClose={() => setInviteOpen(false)}
      />
    </div>
  );
};

export default TokenizationRequests;
