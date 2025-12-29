import activeHoldersIcon from "../../../assets/admin-assets/active-holders.svg";
import individualIcon from "../../../assets/admin-assets/individuals.svg";
import activeAssetsIcon from "../../../assets/admin-assets/active-assets.svg";
import valueIcon from "../../../assets/admin-assets/value.svg";
import { Card } from "../../../components/shared";

const SUMMARY_CARDS = [
  {
    label: "Total Shareholders",
    value: "17",
    change: "Unique Token Holders",
    icon: activeHoldersIcon,
  },
  {
    label: "Institutional / Individual",
    value: "8/9",
    change: "Shareholder Breakdown",
    icon: individualIcon,
  },
  {
    label: "Total Value Held",
    value: "$59.7M",
    change: "Across All Assets",
      icon: valueIcon,
  },
  {
    label: "Active Assets",
    value: "87",
    change: "With Shareholders",
    icon: activeAssetsIcon,
  },
];

const Icon = ({ src }) => (
  <span className="flex items-center justify-center border border-gray-200 rounded-full p-2 !bg-[#FFFFFF]">
    <img src={src} alt="" className="h-6 w-6 md:h-4 md:w-4" />
  </span>
);

const ShareHoldersCard = () => {
  return (
    <div className=" ">
      <section className="grid grid-cols-1 gap-2 p-4 md:grid-cols-4 md:gap-4 md:!p-6">
        {SUMMARY_CARDS.map((card) => (
          <Card
            key={card.label}
            className="relative overflow-hidden p-3 md:!p-4 !bg-[#FAFAFC]"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-[13px] font-medium text-[#000] md:text-[15px]">
                  {card.label}
                </p>
                {card.change && (
                  <p className="text-[11px] text-[#666] md:text-[12px] mt-0.5">
                    {card.change}
                  </p>
                )}
              </div>
              <Icon src={card.icon} />
            </div>
            <p className="text-[24px] font-semibold text-[#0A0A0A] md:text-[32px]">
              {card.value}
            </p>
          </Card>
        ))}
      </section>
    </div>
  );
};

export default ShareHoldersCard;
