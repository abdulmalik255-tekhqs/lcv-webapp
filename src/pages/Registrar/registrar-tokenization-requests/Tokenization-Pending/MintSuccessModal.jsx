import Button from "@/components/shared/button";
import GenericModal from "@/components/shared/GenericModal";
import { FaCheck, FaCopy } from "react-icons/fa6";
import cantonIcon from "@/assets/admin-assets/canton.svg";

const MintSuccessModal = ({ isOpen, onClose, asset, transactionData }) => {
  // Default transaction data if not provided
  const txData = transactionData || {
    tokensMinted: asset?.totalShares || asset?.totalSupply || "50,000",
    txHash: "0x8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c",
    blockNumber: "15,847,392",
    network: "Canton Network",
    timestamp: new Date().toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }),
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(txData.txHash);
    // You can add a toast notification here
  };

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title="Tokens Successfully Minted"
      subheader=""
      zIndex="z-[90]"
      className="!bg-white"
    >
      {/* Success Confirmation Section */}
      <div className="mb-6 p-4 !bg-[#FAFAFC] rounded-lg border border-[#E5E5EA]">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-6 h-6 mt-4 rounded-full bg-green-700 flex items-center justify-center">
            <FaCheck className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-[#000] mb-1">
              Transaction Successful
            </p>
            <p className="text-[13px] font-normal text-[#000]">
              The asset has been successfully minted on the Canton Network blockchain.
            </p>
          </div>
        </div>
      </div>

      {/* Transaction Details */}
      <div className="mb-6 !bg-[#FAFAFC] rounded-lg border border-[#E5E5EA] p-4">
        <h3 className="text-[13px] font-normal text-[#000] mb-4">
          Transaction Details
        </h3>
        <hr className="border-t border-[#000] my-2 border-1"></hr>
        <div className="space-y-3">
          <div className="flex items-center justify-between ">
            <span className="text-[13px] font-normal text-[#000] !mt-2">Asset Name</span>
            <span className="text-[13px] font-medium text-[#000]">
              {asset?.name || "N/A"}
            </span>
          </div>
          <hr className="border-t border-[#E5E5EA] my-2 border-1"></hr>
          <div className="flex items-center justify-between py-1">
            <span className="text-[13px] font-normal text-[#000]">Tokens Minted</span>
            <span className="text-[13px] font-medium text-[#000]">
              {txData.tokensMinted}
            </span>
          </div>
          <hr className="border-t border-[#E5E5EA] my-2 border-1"></hr>
          <div className="flex items-center justify-between py-1">
            <span className="text-[13px] font-normal text-[#000]">Tx Hash</span>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium text-[#000] max-w-[200px] truncate">
                {txData.txHash}
              </span>
              <button
                onClick={handleCopyHash}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <FaCopy className="w-4 h-4 text-[#000]" />
              </button>
            </div>
          </div>
          <hr className="border-t border-[#E5E5EA] my-2 border-1"></hr>
          <div className="flex items-center justify-between py-1">
            <span className="text-[13px] font-normal text-[#000]">Block Number</span>
            <span className="text-[13px] font-medium text-[#000]">
              {txData.blockNumber}
            </span>
          </div>
          <hr className="border-t border-[#E5E5EA] my-2 border-1"></hr>
          <div className="flex items-center justify-between py-1">
            <span className="text-[13px] font-normal text-[#000]">Network</span>
            <div className="flex items-center gap-1">
              <img src={cantonIcon} alt="Canton Icon" className="w-6 h-6" />
              <span className="text-[13px] font-medium text-[#000]">
                {txData.network}
              </span>
            </div>
          </div>
          <hr className="border-t border-[#E5E5EA] my-2 border-1"></hr>
          <div className="flex items-center justify-between py-1">
            <span className="text-[13px] font-normal text-[#000]">Timestamp</span>
            <span className="text-[13px] font-medium text-[#000]">
              {txData.timestamp}
            </span>
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="flex gap-3">
        <Button variant="gradient" onClick={onClose} className="flex-1 h-[40px]">
          Close
        </Button>
      </div>
    </GenericModal>
  );
};

export default MintSuccessModal;

