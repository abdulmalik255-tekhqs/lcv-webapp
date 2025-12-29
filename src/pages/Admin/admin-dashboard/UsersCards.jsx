import allocationsIcon from "../../../assets/admin-assets/active-issuers.svg";
import greenArrowIcon from "../../../assets/admin-assets/green-arrow.svg";
import rwaIcon from "../../../assets/admin-assets/active-assets.svg";
import databaseIcon from "../../../assets/admin-assets/active-database.svg";
import { Button, Card } from "../../../components/shared";
import { FaChevronRight } from "react-icons/fa6";

const SUMMARY_CARDS = [
  {
    label: "Verified Issuers",
    value: "18",
    change: "from last month",
    changeHighlight: "12.5%",
    changeColor: "text-[#000]",
    changeIcon: greenArrowIcon,
    icon: allocationsIcon,
    subHead: [
      { label: "Corporate", value: "347" },
      { label: "Institutional", value: "288" },
      { label: "Individual", value: "212" },
    ],
  },
  {
    label: "Total RWA Allocations",
    value: "247",
    change: "Active assets on platform",
    changeColor: "text-[#000]",
    icon: rwaIcon,
    subHead: [
      { label: "Real Estate", value: "1,247" },
      { label: "Private Credit", value: "892" },
      { label: "Equity Funds", value: "708" },
    ],
  },
  {
    label: "Total Tokens",
    value: "12",
    change: "63 investors (active)",
    changeColor: "text-[#000]",
    icon: databaseIcon,
    subHead: [
      { label: "ERC-20", value: "517" },
      { label: "ERC-721", value: "22" },
      { label: "Other", value: "50,153" },
    ],
  },
  {
    label: "Total RWA Allocations",
    value: "4",
    change: "Active assets on platform",
    changeColor: "text-[#000]",
    icon: rwaIcon,
    subHead: [
      { label: "KYC Submitted", value: "7" },
      { label: "Accepted", value: "4" },
      { label: "Invited", value: "3" },
    ],
  },
];

const Icon = ({ src }) => (
  <span className="flex items-center justify-center border border-gray-200 rounded-full p-2 !bg-[#FFFFFF] w-[48px] h-[48px]">
    <img src={src} alt="" className="h-8 w-8 md:h-4 md:w-4" />
  </span>
);

const UserCards = () => {
  return (
    <div className="bg-[#FAFAFC]  rounded-tr-[20px]">
      <section className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-4 md:gap-8 md:!p-6">
        {SUMMARY_CARDS.map((card) => (
          <Card
            key={card.label}
            className="flex min-h-[301px] flex-col items-start justify-between p-5 flex-1 rounded-[7px] !border-none bg-[#fff] "
          >
            <div className="flex items-center justify-between w-full">
              <p className="font-['Montserrat'] text-[15px] font-medium leading-[150%] text-[var(--Dark-Black,#000)] not-italic">
                {card.label}
              </p>
              <Icon src={card.icon} />
            </div>

            <p className="font-['Montserrat'] text-[32px] font-semibold leading-[120%] tracking-[0.64px] text-[#0A0A0A] not-italic">
              {card.value}
            </p>

            {/* Horizontal row */}
            <div className="w-full h-[0.5px] bg-[#D1D1D6]" />

            <div class="flex flex-col items-start justify-center self-stretch gap-2.5 pt-3">
              {card.subHead &&
                card.subHead.map((h) => (
                  <div className="flex justify-between items-center w-full ">
                    <div className="font-['Montserrat'] text-[11px] font-medium leading-[150%] text-[var(--Dark-Black,#000)] not-italic">
                      {h.label}
                    </div>
                    <div className="font-['Montserrat'] text-[15px] font-normal leading-[150%] text-[var(--Dark-Black,#000)] not-italic">
                      {h.value}
                    </div>
                  </div>
                ))}
            </div>

            <Button
              variant="secondary"
              size="md"
              className="w-full !justify-center !rounded-full gap-2 !border-[1.5px]  !border-[#1C1C1E] px-[15px] flex mt-3"
              icon={<FaChevronRight className="!h-3 !w-3" />}
              iconPosition="right"
              // onClick={() => navigate("/issuer/assets")}
            >
              View All
            </Button>
          </Card>
        ))}
      </section>
    </div>
  );
};

export default UserCards;