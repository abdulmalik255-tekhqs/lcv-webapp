import React from "react";
import GenericModal from "@/components/shared/GenericModal";
import Button from "@/components/shared/button";
import { FaCheck, FaCopy } from "react-icons/fa6";

const PaymentProofSubmittedModal = ({
  isOpen,
  onClose,
  purchaseRequestOrder,
  asset,
  submittedData,
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Dec 10, 2025, 09:54 PM";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const formatPurchaseId = (id) => {
    if (!id) return "PUR-2024-001";
    const lastSegment = id.split("-").pop();
    const numericId = parseInt(lastSegment.substring(0, 3), 16) % 1000;
    return `PUR-2024-${String(numericId).padStart(3, "0")}`;
  };

  const assetName =
    asset?.name ||
    asset?.assetBusinessDetail?.company_name ||
    "Riverside Athletic FC";
  const purchaseId = formatPurchaseId(
    purchaseRequestOrder?.id || submittedData?.purchaseId
  );
  const documentName =
    submittedData?.documentName || "Wire-Transfer-Confirmation-12-10-2025.pdf";
  const submittedOn = submittedData?.submittedOn || new Date().toISOString();
  const status = purchaseRequestOrder?.status || "Awaiting Issuer Verification";

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title="Payment Proof Submitted"
      subheader="Your payment confirmation has been successfully uploaded and is now under review."
      maxWidth="max-w-xl"
      className="bg-white "
    >
      <div className="space-y-6">
        {/* Submission Successful */}
        <div className="bg-[#FAFAFC] rounded-lg p-4 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#248A3D] flex items-center justify-center flex-shrink-0">
            <FaCheck className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-[15px] font-semibold text-[#000] mb-2">
              Submission Successful
            </h3>
            <p className="text-[13px] font-normal text-[#000]">
              Your payment proof has been uploaded and forwarded to the Issuer
              for verification. You will be notified once the verification is
              complete.
            </p>
          </div>
        </div>

        {/* Purchase Request Summary */}
        <div className="bg-[#FAFAFC] rounded-lg p-4 space-y-3">
          <h3 className="text-[15px] font-semibold text-[#000] mb-2">
            Purchase Request Summary
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#000]">Status</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-[600] bg-[#FF707333] text-[#000]">
              {status}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#000]">
              Submitted On
            </span>
            <span className="text-[13px] font-normal text-[#000]">
              {formatDate(submittedOn)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#000]">
              Document
            </span>
            <span className="text-[13px] font-normal text-[#000]">
              {documentName}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#000]">
              Purchase ID
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium text-[#000]">
                {purchaseId}
              </span>
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

        {/* Close Button */}
        <Button
          variant="secondary"
          size="lg"
          onClick={onClose}
          className="w-full !rounded-full !text-[15px] font-[500] !bg-white !border-[#1C1C1E]"
        >
          Close
        </Button>
      </div>
    </GenericModal>
  );
};

export default PaymentProofSubmittedModal;
