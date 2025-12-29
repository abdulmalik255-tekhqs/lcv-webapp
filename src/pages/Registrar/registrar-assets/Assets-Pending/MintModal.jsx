import Button from "@/components/shared/button";
import GenericModal from "@/components/shared/GenericModal";
import { FaTriangleExclamation } from "react-icons/fa6";

const MintModal = ({ isOpen, onClose, onMint, onCancel, asset }) => {
  // Calculate total tokens from totalShares or use totalSupply
  const totalTokens = asset?.totalShares || asset?.totalSupply || "50,000";
  
  // Get token price
  const tokenPrice = asset?.tokenPrice || asset?.sharePrice?.replace("$", "") || "100";
  
  // Calculate capital target (total tokens * token price)
  const totalTokensNum = parseInt(totalTokens.replace(/,/g, "").replace("$", ""));
  const tokenPriceNum = parseInt(tokenPrice.replace(/,/g, "").replace("$", ""));
  const capitalTarget = asset?.totalOffering || 
    (totalTokensNum * tokenPriceNum).toLocaleString();

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title="Mint Tokens on Blockchain"
      subheader="Please review the asset details before minting tokens on the blockchain."
      zIndex="z-[70]"
    >
      {/* Asset Details */}
      <div className="mb-6 p-4 !bg-white rounded-lg shadow-md">
        <h3 className="text-[15px] font-semibold text-[#000] mb-2">
          Asset Details
        </h3>
        <hr className="border-t border-[#000] my-2 border-1"></hr>
        <div className="space-y-3 mt-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#000]">Asset Name</span>
            <span className="text-[15px] font-normal text-[#000]">
              {asset?.name || "N/A"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#000]">Issuer</span>
            <span className="text-[15px] font-normal text-[#000]">
              {asset?.issuer || "N/A"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#000]">
              Total Tokens to Mint
            </span>
                <span className="text-[15px] font-normal text-[#000]">
              {totalTokens}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#000]">Token Price</span>
            <span className="text-[15px] font-normal text-[#000]">
              ${tokenPrice}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#000]">Capital Target</span>
            <span className="text-[15px] font-normal text-[#000]">
              ${capitalTarget}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#000]">Asset Type</span>
            <span className="text-[15px] font-normal text-[#000]">
              {asset?.category || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Warning Message */}
      <div className="mb-6 p-4 bg-[#F2F2F7] border border-[#E5E5EA] rounded-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <FaTriangleExclamation className="w-5 h-5 text-[#000]" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-bold text-[#000] mb-1">
              This Action Cannot be Undone
            </p>
            <p className="text-[13px] font-medium text-[#364153]">
              Once confirmed, this asset will be minted on the Canton Network blockchain. All transaction data will be permanently recorded on the ledger.
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 ">
        <Button variant="secondary" onClick={onCancel} className="h-[40px] flex-1">
          Cancel
        </Button>
        <Button variant="gradient" onClick={onMint} className="h-[40px] flex-1">
          Mint Tokens
        </Button>
      </div>
    </GenericModal>
  );
};

export default MintModal;

