import cantonIcon from "@/assets/admin-assets/canton.svg";
import { TOKENIZATION_REQUESTS_DATA } from "@/constants/registrar";
import { FaCopy } from "react-icons/fa6";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
import { useParams } from "react-router-dom";

function PublishedBlockchainTransaction() {
  const { id } = useParams();
  const asset = TOKENIZATION_REQUESTS_DATA.find(
    (item) => item.id === Number(id)
  );

  // Extended asset data with additional fields from the image
  const extendedAsset = asset
    ? {
        ...asset,
        name: "Premium Downtown Office Tower",
        assetId: "AST-2025-001",
        category: "Commercial Real Estate",
        requestId: "REQ-2024-1159",
        issuer: "TechCorp Inc.",
        issuerEmail: "contact@techcorp.com",
        date: "Nov 15, 2024",
        totalOffering: "$5,000,000",
        sharePrice: "$100",
        totalShares: "50,000",
        minInvestment: "$10,000",
        propertyAddress: "123 Main St, San Francisco, CA 94105",
        targetCloseDate: "Dec 31, 2024",
        expectedReturns: "8-12% annually",
        description:
          "Prime commercial office building in downtown San Francisco with long-term tenants. Class A property with modern amenities, underground parking, and excellent public transportation access. Current occupancy rate of 95% with stable cash flows.",
        documents: [
          { name: "Property-Appraisal-Report.pdf", size: "2.3 MB" },
          { name: "Title-Deed.pdf", size: "2.3 MB" },
          { name: "Financial-Statement.pdf", size: "2.3 MB" },
          { name: "Operating-Agreement.pdf", size: "2.3 MB" },
        ],
        contactPhone: "(415) 555-0123",
        registrationStatus: "Active",
        tokenPrice: "100",
        approvalDate: "Nov 15, 2024",
        requestStatus: "Minted",
      }
    : null;

  return (
    <div className=" pt-8">
      <h3 className="text-[15px] font-medium text-[#000]  !font-['Montserrat']">
        Blockchain Transaction
      </h3>
      <div className="space-y-3 mt-6">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium text-[#000]">
            Transaction Hash
          </p>
          <div className="flex items-center gap-2 border border-[#E5E5EA] rounded-md p-1 bg-[#FAFAFC]">
            <p className="text-[13px] font-medium text-[#000]">0x7d4S..34D7</p>
            <button
              onClick={() => {
                navigator.clipboard.writeText("0x7d4S..34D7");
              }}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <FaCopy className="w-3 h-3 text-[#000]" />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium text-[#000]">Tokens</p>
          <p className="text-[13px] font-medium text-[#000]">500,000</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium text-[#000]">Timestamp</p>
          <p className="text-[13px] font-medium text-[#000]">
            Nov 16, 2025, 2:30 PM PST
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium text-[#000]">
            Contract Address
          </p>
          <div className="flex items-center gap-2 border border-[#E5E5EA] rounded-md p-1 bg-[#FAFAFC]">
            <p className="text-[13px] font-medium text-[#000]">0xTh47..Df4y</p>
            <button
              onClick={() => {
                navigator.clipboard.writeText("0xTh47..Df4y");
              }}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <FaCopy className="w-3 h-3 text-[#000]" />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium text-[#000]">Block Number</p>
          <p className="text-[13px] font-medium text-[#000]">#15,234,567</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium text-[#000]">Network</p>
          <div className="flex items-center gap-1">
            <p className="text-[13px] font-medium text-[#000]">Canton</p>
            <img src={cantonIcon} alt="Canton Icon" className="w-6 h-6" />
          </div>
        </div>
      </div>
      <div className="mt-4 !text-end !justify-end !items-end">
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[#0734A9] hover:underline text-[13px] font-medium justify-end items-end"
        >
          View on CantonScan
          <HiArrowTopRightOnSquare className="w-4 h-4" />
        </a>
      </div>
      <hr className="border-t border-[#E5E5EA] px-8 border-1 !mt-6"></hr>
    </div>
  );
}

export default PublishedBlockchainTransaction;
