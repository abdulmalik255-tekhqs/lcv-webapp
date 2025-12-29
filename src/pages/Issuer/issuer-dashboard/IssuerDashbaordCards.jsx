import shareHoldersIcon from "../../../assets/admin-assets/active-holders.svg";
import completedTransactionsIcon from "../../../assets/admin-assets/completed-transactions.svg";
import totalAssetsIcon from "../../../assets/admin-assets/total-assets.svg";
import dollarSignIcon from "../../../assets/admin-assets/dollar-sign.svg";
import arrowRightIcon from "../../../assets/admin-assets/arrow-right.svg";
import { Card, Button } from "../../../components/shared";
import CardData from "@/components/shared/CardData";
import { useNavigate } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa6";

const RIGHT_SECTION_CARDS = [
  {
    label: "Active Asset Holders",
    value: "347",
    icon: shareHoldersIcon,
    iconAlignment: "right",
  },
  {
    label: "Completed Issuances",
    value: "28",
    icon: completedTransactionsIcon,
    iconAlignment: "right",
  },
];

const LEFT_SECTION_CARDS = [
  {
    label: "Total Assets",
    value: "12",
    icon: totalAssetsIcon,
    iconAlignment: "right",
  },
  {
    label: "Total Capital Raised",
    value: "$2.8M",
    icon: dollarSignIcon,
    iconAlignment: "right",
  },
];

const IssuerDashbaordCards = () => {
  const navigate = useNavigate();
  return (
    <div className="p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Left Section */}
        <Card className="p-4 md:p-4 ">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {LEFT_SECTION_CARDS.map((card) => (
              <CardData
                key={card.label}
                label={card.label}
                value={card.value}
                icon={card.icon}
                iconAlignment={card.iconAlignment}
              />
            ))}
          </div>
          <Button
            variant="secondary"
            size="md"
            className="w-full !justify-center !rounded-[99px] !text-[#000] !font-[600] !text-[13px] gap-2 !border-[1.5px] border-[#1C1C1E] h-[38px]"
            icon={<FaChevronRight className="!h-3 !w-3" />}
            iconPosition="right"
            onClick={() => navigate("/issuer/assets")}
          >
            View Assets
          </Button>
        </Card>

        {/* Right Section */}
        <Card className="p-4 md:p-4 ">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {RIGHT_SECTION_CARDS.map((card) => (
              <CardData
                key={card.label}
                label={card.label}
                value={card.value}
                icon={card.icon}
              />
            ))}
          </div>
          <Button
            variant="secondary"
            size="md"
            className="w-full !justify-center !rounded-[99px] !text-[#000] !font-[600] !text-[13px] gap-2 !border-[1.5px] border-[#1C1C1E] h-[38px]"
            icon={<FaChevronRight className="!h-3 !w-3" />}
            iconPosition="right"
            onClick={() => navigate("/registrar/shareholders")}
          >
            View Shareholders
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default IssuerDashbaordCards;
