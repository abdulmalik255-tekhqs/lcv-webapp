import { Card } from "../../../components/shared";
import dollarSignIcon from "../../../assets/admin-assets/dollar-sign.svg";
import trendingIcon from "../../../assets/investor-assets/trending.svg";
import walletIcon from "../../../assets/investor-assets/wallet.svg";
import { useGetInvestorStats } from "../../../api/investors";
import { useMemo } from "react";

const Icon = ({ src }) => (
  <span className="flex items-center justify-center rounded-full p-2 bg-[#FAFAFC] border border-[#E5E5EA]">
    <img src={src} alt="" className="h-3 w-3 md:h-4 md:w-4" />
  </span>
);

// Format value: use billion, trillion, etc. for large numbers
const formatValue = (value) => {
  if (!value && value !== 0) return { type: "normal", value: "0" };
  
  // Convert to number (handles both regular numbers and scientific notation strings)
  const num = typeof value === "string" && (value.includes("e") || value.includes("E"))
    ? parseFloat(value)
    : parseFloat(value) || 0;
  
  const absNum = Math.abs(num);
  
  // Define units in ascending order
  const units = [
    { value: 1e6, name: "Million", short: "M" },
    { value: 1e9, name: "Billion", short: "B" },
    { value: 1e12, name: "Trillion", short: "T" },
    { value: 1e15, name: "Quadrillion", short: "Qa" },
    { value: 1e18, name: "Quintillion", short: "Qi" },
    { value: 1e21, name: "Sextillion", short: "Sx" },
    { value: 1e24, name: "Septillion", short: "Sp" },
    { value: 1e27, name: "Octillion", short: "Oc" },
    { value: 1e30, name: "Nonillion", short: "No" },
    { value: 1e33, name: "Decillion", short: "Dc" },
  ];
  
  // Find the appropriate unit (largest unit that the number is greater than or equal to)
  let selectedUnit = null;
  for (let i = units.length - 1; i >= 0; i--) {
    if (absNum >= units[i].value) {
      selectedUnit = units[i];
      break;
    }
  }
  
  // If number is large enough to use a unit, format it
  if (selectedUnit) {
    const divided = num / selectedUnit.value;
    // Format to 2 decimal places, removing trailing zeros
    const formatted = divided % 1 === 0
      ? divided.toString()
      : divided.toFixed(2).replace(/\.?0+$/, "");
    
    return {
      type: "unit",
      value: formatted,
      unit: selectedUnit.short,
      fullUnit: selectedUnit.name,
    };
  }
  
  // Otherwise, format with commas
  return {
    type: "normal",
    value: num.toLocaleString("en-US", {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }),
  };
};

const InvestorDashbaordCards = () => {
  const { data: statsData, isLoading } = useGetInvestorStats();

  const dashboardCards = useMemo(() => {
    const stats = statsData?.stats || {};
    const approved = stats.approved || { amount: 0, tokens: 0 };
    const pending = stats.pending || { amount: 0, tokens: 0 };

    
    return [
      {
        label: "Portfolio value",
        value: approved.amount,
        icon: dollarSignIcon,
      },
      {
        label: "Pending Approval",
        value: pending.amount,
        icon: walletIcon,
      },
      {
        label: "Approved tokens",
        value: approved.tokens,
        icon: dollarSignIcon,
      },
      {
        label: "Pending tokens",
        value: pending.tokens,
        icon: trendingIcon,
      },
    ];
  }, [statsData]);

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card
              key={i}
              className="p-5 md:p-5 rounded-lg !border-1.5 border-[#E5E5EA] !shadow-sm !bg-white relative animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {dashboardCards.map((card) => {
          const formatted = formatValue(card.value);
          
          return (
            <Card
              key={card.label}
              className="p-5 md:p-6 rounded-lg !border-1.5 border-[#E5E5EA] !shadow-sm !bg-white relative hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-2">
                <p className="text-[15px] font-medium text-[#000] leading-tight">{card.label}</p>
                <Icon src={card.icon} />
              </div>
              {formatted.type === "unit" ? (
                <div className="flex items-baseline gap-1 flex-wrap">
                  <span className="text-[24px] md:text-[28px] lg:text-[32px] font-[600] text-[#000] leading-tight">
                    {formatted.value}
                  </span>
                  <span className="text-[20px] md:text-[24px] lg:text-[28px] font-[600] text-[#000] leading-tight">
                    {formatted.unit}
                  </span>
                </div>
              ) : (
                <p className="text-[28px] md:text-[32px] lg:text-[36px] font-[600] text-[#000] leading-tight">
                  {formatted.value}
                </p>
              )}
              {card.date || card.status ? (
                <p className="text-[13px] md:text-[13px] text-[#48484A] font-[400] mt-2">
                  {card.date || card.status}
                </p>
              ) : null}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default InvestorDashbaordCards;
