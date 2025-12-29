import dollarSignIcon from "../../../assets/admin-assets/dollar-sign.svg";
import investorIcon from "../../../assets/admin-assets/investorIcon.svg";
import assetsIcon from "../../../assets/admin-assets/assetsIcon.svg";
import institutionalIcon from "../../../assets/admin-assets/institutionalIcon.svg";

const SUMMARY_CARDS = [
  {
    label: "Total Investors",
    subHeading: "All Accounts",
    value: "19",
    icon: investorIcon,
  },
  {
    label: "Asset Owners",
    subHeading: "Active Token Holders",
    value: "8",
    icon: assetsIcon,
  },
  {
    label: "Total Assets Tokenized",
    subHeading: "Across All Assets",
    value: "$26.7M",
    icon: dollarSignIcon,
  },
  {
    label: "Institutional /",
    subLabel: " Individual",
    subHeading: "Investor Breakdown",
    value: "9 / 10",
    icon: institutionalIcon,
  },
];

function UserCards() {
  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 mt-[30px] px-[15px]">
        {SUMMARY_CARDS.map((card) => (
          <div
            key={card.label}
            className="flex flex-col gap-12 items-start justify-center self-stretch flex-1 p-[15px] !rounded-[7px] !border !border-[#E5E5EA] !bg-[#FAFAFC]"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-1">
                <div className="text-[15px] font-[500] text-[#000]">
                  {" "}
                  {card.label}
                </div>
                {card.subLabel && (
                  <div className="text-[15px] font-[500] text-[#000]">
                    {" "}
                    {card.subLabel}
                  </div>
                )}
                <div class="text-[11px] font-[400] text-[#48484A]">
                  {" "}
                  {card.subHeading}
                </div>
              </div>
              <div className="flex w-12 h-12 flex-col justify-center items-center gap-2.5 rounded-[99px] border border-[#F2F2F7] bg-[#FFF]">
                <img src={card.icon} alt="" />
              </div>
            </div>

            <div class="flex flex-col items-start justify-end self-stretch flex-1 gap-[-1px]">
              <p class="text-[32px] font-[600] text-[#0A0A0A]">
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
export default UserCards;
