import React from "react";
import { useNavigate } from "react-router-dom";
import GenericModal from "@/components/shared/GenericModal";
import Button from "@/components/shared/button";
import { FaCheck, FaCopy } from "react-icons/fa6";

const PurchaseRequestSubmittedModal = ({ isOpen, onClose, purchaseData }) => {
  const navigate = useNavigate();



  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const purchaseId = purchaseData?.purchaseId || "PUR-2024-001";

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title="Purchase Request Submitted"
      subheader="Your investment request has been successfully submitted."
      maxWidth="max-w-xl"
      className="bg-white"
    >
      <div className="space-y-6 h-[495px] min-h-[435px] overflow-y-auto scrollbar-hide">
        {/* What Happens Next */}
        <div className="flex items-center gap-[18px] rounded-xl border border-[#E5E5EA] bg-[#FAFAFC] p-[18px]">
          <div className="w-5 h-5 rounded-full bg-[#248A3D] flex items-center justify-center flex-shrink-0">
            <FaCheck className="w-3 h-3 text-white" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-[#000] mb-2">
              What Happens Next
            </h3>
            <p className="text-[13px] font-normal text-[#000]">
              Complete your payment and upload confirmation. Once verified by
              the Issuer, your request will be submitted to the Registrar for
              token issuance.
            </p>
          </div>
        </div>

        {/* Purchase Summary */}
        <div className="flex flex-col items-start gap-[18px]  p-[18px_18px_24px_18px] rounded-[12px] border-[0.5px] border-[#E5E5EA] bg-[#FAFAFC]">
          <h3 className="text-[15px] font-medium text-[#000] ">
            Purchase Summary
          </h3>
          <div className="flex flex-col items-start justify-center gap-[10px] pt-[12px] border-t-[0.5px] border-[#D1D1D6] w-full">
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] font-medium text-[#000]">
                Purchase ID
              </span>
              <div className="flex items-center justify-end gap-[5px] p-[2px_7px] rounded-[4px] border-[0.5px] border-[#D1D1D6] bg-white">
                <span className="text-[13px] font-medium text-[#000]">
                  {purchaseId}
                </span>
                <button
                  onClick={() => copyToClipboard(purchaseId)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Copy Purchase ID"
                >
                  <FaCopy className="w-3 h-3 text-[#48484A]" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between  w-full">
              <span className="text-[11px] font-medium text-[#000]">
                Tokens Reserved Until
              </span>
              <span className="text-[13px] font-medium text-[#000]">
                {purchaseData?.reservationDate || "Dec 10, 2024"}
              </span>
            </div>
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] font-medium text-[#000]">
                Asset Name
              </span>
              <span className="text-[13px] font-medium text-[#000]">
                {purchaseData?.assetName || "Riverside Athletic FC"}
              </span>
            </div>
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] font-medium text-[#000]">
                Tokens Requested
              </span>
              <span className="text-[13px] font-medium text-[#000]">
                {purchaseData?.tokens || 1000}
              </span>
            </div>
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] font-medium text-[#000]">
                Total Amount
              </span>
              <span className="text-[13px] font-medium text-[#000]">
                {purchaseData?.totalAmount ||
                  (purchaseData?.tokens || 1000) *
                      (purchaseData?.pricePerToken || 1000)}
              </span>
            </div>
            <div className="flex items-center justify-between  w-full">
              <span className="text-[11px] font-medium text-[#000]">
                Payment Handled by
              </span>
              <span className="text-[13px] font-medium text-[#000]">
                {purchaseData?.paymentHandledBy || "Investor"}
              </span>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <Button
          variant="secondary"
          size="lg"
          onClick={() => navigate("/investor/opportunities")}
          className="w-full !rounded-full !text-[15px] font-[500] !bg-white !border-[#1C1C1E]"
        >
          Close
        </Button>
      </div>
    </GenericModal>
  );
};

export default PurchaseRequestSubmittedModal;
