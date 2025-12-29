import Button from "@/components/shared/button";
import GenericModal from "@/components/shared/GenericModal";
import WalletAddress from "@/components/shared/WalletAddress";
import { FaTriangleExclamation } from "react-icons/fa6";

const ApproveIssuanceModal = ({ isOpen, onClose, onMint, onCancel, asset, purchaserName }) => {
  // Calculate total tokens from tokensRequested or totalShares
  const tokensToIssue =
    asset?.tokensRequested || asset?.totalShares || asset?.totalSupply || "500";


    console.log(asset);

  // Get total amount
  const totalAmount = asset?.totalAmount || asset?.totalOffering || "$50,000";

  // Get wallet address
  const walletAddressFull =
    asset?.walletAddressFull ||
    asset?.walletAddress ||
    asset?.address ||
    "0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c";

  // Get request ID
  const requestIdFull = asset?.requestId || asset?.id || "REQ-2025-042";

  // Get purchaser
  const purchaser = purchaserName ||"N/A";

  // Get token breakdown values
  const fromIssuerTreasury =
    asset?.fromIssuerTreasury || tokensToIssue || "1,000";
  const mintOnDemand = asset?.mintOnDemand || "0";

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title="Issue Tokens"
      subheader="Review the details below to issue tokens to the buyer."
      zIndex="z-[70]"
      className="w-3xl h-[600px] overflow-y-auto scrollbar-hide"
    >
      {/* Issuance Request Details */}
      <div className="mb-6 p-4 !bg-white rounded-lg shadow-sm">
        <h3 className="text-[15px] font-semibold text-[#000] mb-2">
          Issuance Request Details
        </h3>
        <hr className="border-t border-[#000] my-2 border-1"></hr>
        <div className="space-y-3 mt-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#000]">
              Asset Name
            </span>
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
              Purchaser
            </span>
            <span className="text-[15px] font-normal text-[#000]">
              {purchaser}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#000]">
              Wallet Address
            </span>
            <WalletAddress
              value={walletAddressFull}
              title="Copy wallet address"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#000]">
                Tokens to Issue
              </span>
              <span className="text-[15px] font-normal text-[#000]">
                {tokensToIssue}
              </span>
            </div>
            <div className="ml-4 pl-3 border-l-2 border-[#8B5CF6] mt-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-[#000]">
                  From Issuer Treasury
                </span>
                <span className="text-[13px] font-normal text-[#000]">
                  {fromIssuerTreasury}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-[#000]">
                  Mint on Demand
                </span>
                <span className="text-[13px] font-normal text-[#000]">
                  {mintOnDemand}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#000]">
              Total Amount
            </span>
            <span className="text-[15px] font-normal text-[#000]">
              {totalAmount}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#000]">
              Request ID
            </span>
            <WalletAddress value={requestIdFull} title="Copy request ID" />
          </div>
        </div>
      </div>

      {/* Warning Message */}
      <div className="mb-6 p-4 bg-[#FAFAFC] border border-[#E5E5EA] rounded-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <FaTriangleExclamation className="w-5 h-5 text-[#000]" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-medium text-[#364153]">
              Once confirmed, the tokens will be issued to the purchaser on the
              Canton Network blockchain. All transaction data will be
              permanently recorded on the ledger.
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 ">
        <Button
          variant="secondary"
          onClick={onCancel}
          className="h-[40px] flex-1"
        >
          Cancel
        </Button>
        <Button variant="gradient" onClick={onMint} className="h-[40px] flex-1">
          Issue Tokens
        </Button>
      </div>
    </GenericModal>
  );
};

export default ApproveIssuanceModal;
