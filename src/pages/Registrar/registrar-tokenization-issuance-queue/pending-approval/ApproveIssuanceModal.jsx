import Button from "@/components/shared/button";
import GenericModal from "@/components/shared/GenericModal";
import WalletAddress from "@/components/shared/WalletAddress";

const ApproveIssuanceModal = ({ isOpen, onClose, onMint, onCancel, asset }) => {
  // Calculate total tokens from tokensRequested or totalShares
  const tokensToIssue = asset?.tokensRequested || asset?.totalShares || asset?.totalSupply || "500";

  // Get total amount
  const totalAmount = asset?.totalAmount || asset?.totalOffering || "$50,000";

  // Get wallet address
  const walletAddressFull = asset?.walletAddressFull || asset?.walletAddress || asset?.address || "0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c";

  // Get request ID
  const requestIdFull = asset?.requestId || asset?.id || "REQ-2025-042";

  // Get purchaser
  const purchaser = asset?.purchaser || asset?.purchaserContact || "N/A";

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title="Approve Token Issuance"
      subheader="Please review the purchase request details before approving token issuance."
      zIndex="z-[70]"
      className="w-3xl"
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
            <WalletAddress value={walletAddressFull} title="Copy wallet address" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#000]">
              Tokens to Issue
            </span>
            <span className="text-[15px] font-normal text-[#000]">
              {tokensToIssue}
            </span>
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
          Approve Request
        </Button>
      </div>
    </GenericModal>
  );
};

export default ApproveIssuanceModal;
