import dollarSignIcon from "../../../../assets/admin-assets/dollar-sign.svg";
import activeAssetsIcon from "../../../../assets/admin-assets/assets.svg";
import issuersIcon from "../../../../assets/admin-assets/issued.svg";
import tokensIcon from "../../../../assets/admin-assets/active-database.svg";
import { Card } from "../../../../components/shared";
import { FaCopy } from "react-icons/fa6";

// Account information data
const accountInfo = {
  institution: "Morgan Stanley Wealth",
  contactName: "James Chen",
  email: "institutional@morganstanley.com",
  phone: "+1 (555) 987-6543",
  shareholderSince: "Aug 10, 2025",
  lastActive: "Oct 25, 2025",
  walletAddress: "0x8fyZ..2d1c",
  walletAddressFull: "0x8fyZ1234567890abcdef1234567890abcdef2d1c",
};

const SUMMARY_CARDS = [
  {
    label: "Total Portfolio Value",
    subtext: "Across All Holdings",
    value: "$350,000",
    icon: dollarSignIcon,
  },
  {
    label: "Assets Held",
    subtext: "Active Investments",
    value: "3",
    icon: activeAssetsIcon,
  },
  {
    label: "Issuers",
    subtext: "Investment Diversification",
    value: "2",
    icon: issuersIcon,
  },
  {
    label: "Total Tokens Held",
    subtext: "All Assets Combined",
    value: "8,500",
    icon: tokensIcon,
  },
];

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};

const Icon = ({ src }) => (
  <span className="flex items-center justify-center rounded-full border border-gray-200 p-2 !bg-[#FFFFFF]">
    <img src={src} alt="" className="h-5 w-5" />
  </span>
);

const ShareHoldersDetialsCard = () => {
  return (
    <div>
        <hr className="border-t border-[#D1D1D6]  border-1 mt-4 "></hr>
      <div className="mb-8 mt-4">
        <div className="flex flex-row  gap-16">
          <div>
            <p className="text-[11px] font-medium text-[#000] mb-1">
              Institution
            </p>
            <p className="text-[13px] font-semibold text-[#000] ">
              {accountInfo.institution}
            </p>
            <p className="text-[11px] font-normal text-[#48484A] text-[#000]">
              {accountInfo.contactName}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-[#000] mb-1">Email</p>
            <a
              href={`mailto:${accountInfo.email}`}
              className="text-[13px] font-medium text-[#0734A9] hover:underline"
            >
              {accountInfo.email}
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
              Shareholder Since
            </p>
            <p className="text-[13px] font-medium text-[#000]">
              {accountInfo.shareholderSince}
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
            <p className="text-[11px] font-medium text-[#000] mb-1">
              Wallet Address
            </p>
            <div className="flex items-center gap-2">
              <p className="text-[13px] font-medium text-[#000]">
                {accountInfo.walletAddress}
              </p>
              <button
                onClick={() => copyToClipboard(accountInfo.walletAddressFull)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Copy wallet address"
              >
                <FaCopy className="w-3 h-3 text-[#000]" />
              </button>
            </div>
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
              <div className="flex-1">
                <p className="text-[15px] font-medium text-[#000] mb-1">
                  {card.label}
                </p>
                {card.subtext && (
                  <p className="text-[11px] font-normal text-[#666]">
                    {card.subtext}
                  </p>
                )}
              </div>
              <Icon src={card.icon} />
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

export default ShareHoldersDetialsCard;
