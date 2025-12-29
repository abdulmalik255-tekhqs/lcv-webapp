import { Card } from "../../../../components/shared";
import {
  FaCopy,
  FaDollarSign,
  FaCoins,
  FaShareNodes,
  FaComments,
} from "react-icons/fa6";
import activeAssetsIcon from "../../../../assets/admin-assets/active-database.svg";
import totalTokensIssuedIcon from "../../../../assets/admin-assets/issued.svg";
import activeRequestsIcon from "../../../../assets/admin-assets/messages.svg";
import totalAssetValueIcon from "../../../../assets/admin-assets/dollar-sign.svg";

// Account information data
const accountInfo = {
  primaryContact: "John Smith",
  email: "information@solarventure.com",
  phone: "+1 (555) 123-4567",
  registered: "Oct 15, 2024",
  lastActive: "Nov 10, 2025",
  status: "Active",
};

const SUMMARY_CARDS = [
  {
    label: "Assets Tokenized",
    value: "12",
    icon: activeAssetsIcon,
  },
  {
    label: "Total Tokens Issued",
    value: "450,000",
    icon: totalTokensIssuedIcon,
  },
  {
    label: "Active Requests",
    value: "8",
    icon: activeRequestsIcon,
  },
  {
    label: "Total Asset Value",
    value: "$13.5M",
    icon: totalAssetValueIcon,
  },
];

const Icon = ({ iconSrc }) => (
  <span className="flex items-center justify-center rounded-lg p-2 border border-[#E5E5EA] !rounded-full !bg-[#FFFFFF]">
    <img src={iconSrc} alt="" className="h-5 w-5" />
  </span>
);

const IssuersDetialsCard = () => {
  return (
    <div>
      <hr className="border-t border-[#D1D1D6]  border-1 mt-4 "></hr>
      <div className="mb-8 mt-4">
        <div className="flex flex-row gap-20">
          <div>
            <p className="text-[11px] font-medium text-[#000] mb-1">
              Primary Contact
            </p>
            <p className="text-[13px] font-medium text-[#000]">
              {accountInfo.primaryContact}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-[#000] mb-1">Email</p>
            <a
              href={`mailto:${accountInfo.email}`}
              className="text-[13px] font-medium text-[#0734A9] hover:underline"
            >
              {accountInfo.email.length > 25
                ? `${accountInfo.email.substring(0, 25)}...`
                : accountInfo.email}
            </a>
          </div>
          <div>
            <p className="text-[11px] font-medium text-[#000] mb-1">Phone</p>
            <p className="text-[13px] font-medium text-[#000]">
              {accountInfo.phone}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-[#000] mb-1">
              Registered
            </p>
            <p className="text-[13px] font-medium text-[#000]">
              {accountInfo.registered}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-[#000] mb-1">
              Last Active
            </p>
            <p className="text-[13px] font-medium text-[#000]">
              {accountInfo.lastActive}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-[#000] mb-1">Status</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#3BF69533] text-[#000]">
              {accountInfo.status}
            </span>
          </div>
        </div>
      </div>

      {/* Data Cards Section */}
      <section className="grid grid-cols-1 gap-2 md:grid-cols-4 md:gap-4">
        {SUMMARY_CARDS.map((card) => (
          <Card
            key={card.label}
            className="relative overflow-hidden p-3 md:!p-4 !bg-[#FAFAFC] rounded-lg border border-[#E5E5EA]"
          >
            <div className="flex items-start justify-between mb-2">
              <p className="text-[15px] font-medium text-[#000]">
                {card.label}
              </p>
              <Icon iconSrc={card.icon} />
            </div>
            <p className="text-[24px] font-semibold text-[#000] md:text-[32px]">
              {card.value}
            </p>
          </Card>
        ))}
      </section>
    </div>
  );
};

export default IssuersDetialsCard;
