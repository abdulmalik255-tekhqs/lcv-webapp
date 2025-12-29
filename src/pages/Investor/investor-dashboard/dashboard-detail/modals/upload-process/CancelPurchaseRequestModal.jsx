import React from "react";
import GenericModal from "@/components/shared/GenericModal";
import Button from "@/components/shared/button";
import { FaCopy, FaTriangleExclamation } from "react-icons/fa6";

const CancelPurchaseRequestModal = ({
  isOpen,
  onClose,
  onConfirm,
  purchaseRequestOrder,
  asset,
  isSubmitting = false,
}) => {


  const formatPurchaseId = (id) => {
    if (!id) return "PUR-2024-001";
    const lastSegment = id.split("-").pop();
    const numericId = parseInt(lastSegment.substring(0, 3), 16) % 1000;
    return `PUR-2024-${String(numericId).padStart(3, "0")}`;
  };

  const handleConfirm = () => {
    onConfirm?.();
  };

  const assetName = asset?.name || asset?.assetBusinessDetail?.company_name || "Riverside Athletic FC";
  const tokensRequested = purchaseRequestOrder?.token_requested || 1000;
  const totalAmount = purchaseRequestOrder?.total_amount || 1000000;
  const purchaseId = formatPurchaseId(purchaseRequestOrder?.id);

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title="Cancel Purchase Request"
      subheader="Are you sure you want to cancel this purchase request? This action cannot be undone and your token reservation will be released."
      maxWidth="max-w-xl"
      className="bg-white"
    >
      <div className="space-y-6">
        {/* Request Details */}
        <div className="bg-white rounded-lg border border-[#E5E5EA] p-4 space-y-3">
          <h3 className="text-[15px] font-semibold text-[#000] mb-2">Request Details</h3>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#000]">Asset Name</span>
            <span className="text-[13px] font-normal text-[#000]">{assetName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#000]">Tokens Requested</span>
            <span className="text-[13px] font-normal text-[#000]">
              {tokensRequested}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#000]">Total Amount</span>
            <span className="text-[13px] font-normal text-[#000]">
              {totalAmount}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#000]">Purchase ID</span>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium text-[#000]">{purchaseId}</span>
              <button
                onClick={() => navigator.clipboard.writeText(purchaseId)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Copy Purchase ID"
              >
                <FaCopy className="w-3 h-3 text-[#48484A]" />
              </button>
            </div>
          </div>
        </div>

        {/* Warning Section */}
        <div className="bg-white rounded-lg border border-[#E5E5EA] p-4 flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <FaTriangleExclamation className="w-5 h-5 text-[#FF9500]" />
          </div>
          <div className="flex-1">
            <h3 className="text-[15px] font-semibold text-[#000] mb-2">
              This Action Cannot Be Undone
            </h3>
            <p className="text-[13px] font-normal text-[#000]">
              Once you cancel this purchase request, your token reservation will be released and
              you will need to create a new purchase request if you wish to invest in this asset.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="secondary"
            size="lg"
            onClick={onClose}
            className="flex-1 !rounded-full !text-[15px] font-[500] !bg-white !border-[#1C1C1E]"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex-1 !rounded-full !text-[15px] font-[500] !bg-[#FF3B30] hover:!bg-[#FF2D20]"
          >
            {isSubmitting ? "Cancelling..." : "Confirm Cancellation"}
          </Button>
        </div>
      </div>
    </GenericModal>
  );
};

export default CancelPurchaseRequestModal;

