import totalAssetsIcon from "../../../assets/admin-assets/total-assets.svg";
import dollarSignIcon from "../../../assets/admin-assets/dollar-sign.svg";
import returnsIcon from "../../../assets/admin-assets/returnsIcon.svg";
import monthlyIncomeIcon from "../../../assets/admin-assets/monthlyIncomeIcon.svg";
import { Card, Button } from "../../../components/shared";
import CardData from "@/components/shared/CardData";
import { FaChevronRight } from "react-icons/fa6";

const RIGHT_SECTION_CARDS = [
  {
    label: "Portfolio Value",
    subHeading: "as of November 30, 2025",
    value: "$199,992,000",
    icon: dollarSignIcon,
  },
  {
    label: "Total Returns",
    value: "$25,242,000",
    icon: returnsIcon,
    changeIndicator: "14.4",
  },
  {
    label: "Total Invested",
    subHeading: "Original Capital",
    value: "$174,750,000",
    icon: totalAssetsIcon,
  },
  {
    label: "Monthly Income",
    subHeading: "November 2025",
    value: "$2,103,500",
    icon: monthlyIncomeIcon,
  },
];

const InvestorPortfolioCards = () => {
  return (
    <div className="p-4 flex md:px-[25px] md:py-[24px] items-start self-stretch bg-light-gray-7 border-t border-[#E5E5EA] border-b ">
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 w-full">
        {RIGHT_SECTION_CARDS.map((card) => (
          <Card
            key={card.label}
            className="p-[15px] rounded-[7px] !border-none bg-[#FFFFFF] shadow-[0_0_30px_0_rgba(0,0,0,0.08)] flex min-h-[145px] flex-col justify-center items-start flex-1 flex-shrink-0 flex-basis-0"
          >
            <div className="flex flex-col gap-4 w-full">
              <div className="flex justify-between items-center ">
                <div className="flex flex-col">
                  <div className=" text-[#000] font-['Montserrat'] text-[15px] font-medium leading-[150%] ">
                    {card.label}
                  </div>
                  <p className="text-[#48484A] font-['Montserrat'] text-[13px] font-[400] leading-[150%] ">
                    {card.subHeading}
                  </p>
                </div>
                <div className="flex w-12 h-12 flex-col justify-center items-center gap-2.5 rounded-[99px] border border-[#F2F2F7] bg-[#FAFAFC]">
                  {" "}
                  <img src={card.icon} alt="" />
                </div>
              </div>

              <div className="text-[#000] font-['Montserrat'] text-[32px]   font-semibold leading-[120%] tracking-[0.64px]">
                {card.value}{" "}
                {card.changeIndicator ? (
                  <span className="font-['Montserrat'] text-[13px] font-medium leading-[150%] text-[#248A3D]">
                    +{card.changeIndicator}%
                  </span>
                ) : (
                  ""
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InvestorPortfolioCards;
