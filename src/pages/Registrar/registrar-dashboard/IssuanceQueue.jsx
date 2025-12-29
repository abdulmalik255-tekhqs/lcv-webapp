import databaseIcon from "../../../assets/admin-assets/database.svg";
import dollarSignIcon from "../../../assets/admin-assets/dollar-sign.svg";
import arrowRightIcon from "../../../assets/admin-assets/arrow-right.svg";
import { Button } from "../../../components/shared";
import CardData from "@/components/shared/CardData";
import { useNavigate } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa6";

const SUMMARY_CARDS = [
  {
    label: "Ready to Issue",
    value: "12",
    icon: databaseIcon,
  },
  {
    label: "Total Value",
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
    <div>
      <h2 className="text-xl font-semibold text-[#0A0A0A] mb-4">
        Token Issuance Queue
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
                  variant="gradient"
                  size="sm"
                  className="!rounded-full text-[13px] font-[500] !text-white"
                  onClick={() =>
                    navigate(
                      `/registrar/tokenization-issuance-queue/issued-details/${issuance.id}`
                    )
                  }
                >
                  Issue Tokens
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-[400] text-[#000000] cursor-pointer hover:text-gray-900">
          + 5 More Requests
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
