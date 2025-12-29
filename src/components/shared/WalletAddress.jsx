import { FaCopy } from "react-icons/fa6";

const WalletAddress = ({ value, title = "Copy to clipboard" }) => {
  // Truncate address to show first 5 and last 3 characters
  const truncateAddress = (address) => {
    if (!address || address.length <= 8) return address;
    const firstFive = address.substring(0, 5);
    const lastThree = address.substring(address.length - 3);
    return `${firstFive}...${lastThree}`;
  };

  const truncatedValue = truncateAddress(value);
  const fullValue = value || "";

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-lg border border-gray-200">
      <span className="text-[13px] font-medium text-[#000]">
        {truncatedValue}
      </span>
      <button
        onClick={() => copyToClipboard(fullValue)}
        className="p-1 hover:bg-gray-200 rounded transition-colors"
        title={title}
      >
        <FaCopy className="w-3 h-3 text-[#000]" />
      </button>
    </div>
  );
};

export default WalletAddress;
