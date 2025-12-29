import React, { useState, useEffect } from "react";
import GenericModal from "@/components/shared/GenericModal";
import Button from "@/components/shared/button";
import { FaCopy } from "react-icons/fa6";

const PaymentInstructionsModal = ({
  isOpen,
  onClose,
  onBack,
  onSubmit,
  asset,
  isSubmitting = false,
}) => {
  const [isInvestorUploaded, setIsInvestorUploaded] = useState(false);
  const [isIssuerUploaded, setIsIssuerUploaded] = useState(false);
  const [isSubCheckConfirmed, setIsSubCheckConfirmed] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const reservationDate = asset?.created_at || "N/A";

  // Update submit button state when checkboxes change
  useEffect(() => {
    const isAnyCheckboxMarked = isInvestorUploaded || isIssuerUploaded;
    setIsSubmitDisabled(!isAnyCheckboxMarked || isSubmitting);
  }, [isInvestorUploaded, isIssuerUploaded, isSubmitting]);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;

    // Add 5 days
    date.setDate(date.getDate() + 5);

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const bankingInfo = {
    bankName: "First National Bank",
    accountName: "TechCorp Inc. Escrow Account",
    accountNumber: "9876543210",
    routingNumber: "021000021",
    swiftCode: "FNBUS33",
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleSubmit = () => {
    onSubmit?.();
  };

  const handleInvestorUploadedClick = () => {
    setIsInvestorUploaded(!isInvestorUploaded);
    // Uncheck issuer uploaded if checking investor uploaded (mutually exclusive)
    if (!isInvestorUploaded) {
      setIsIssuerUploaded(false);
    }
  };

  const handleIssuerUploadedClick = () => {
    setIsIssuerUploaded(!isIssuerUploaded);
    // Uncheck investor uploaded if checking issuer uploaded (mutually exclusive)
    if (!isIssuerUploaded) {
      setIsInvestorUploaded(false);
    }
  };

  const handleSubCheckClick = () => {
    setIsSubCheckConfirmed(!isSubCheckConfirmed);
  };

  // Reset states when modal closes/opens
  useEffect(() => {
    if (isOpen) {
      setIsInvestorUploaded(false);
      setIsIssuerUploaded(false);
      setIsSubCheckConfirmed(false);
      setIsSubmitDisabled(true);
    }
  }, [isOpen]);

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title="Payment Instructions"
      maxWidth="max-w-xl"
      className="bg-white"
    >
      <div className="space-y-6 h-[470px] min-h-[470px] overflow-y-auto scrollbar-hide">
        {/* Reservation Deadline */}
        <p className="text-[13px] font-normal text-[#000] text-center">
          Your tokens will be reserved until{" "}
          <strong>{formatDate(reservationDate)}</strong>. Your payment must be
          submitted and verified before this date to complete your purchase.
        </p>

        {/* <div className="flex flex-col items-start pt-2.5 border-t border-[#C7C7CC]">
          <div 
            className="flex items-start gap-2.5 py-2.5 cursor-pointer w-full"
            onClick={handleInvestorUploadedClick}
          >
            <div className="flex justify-center items-center w-5 h-5 rounded-[9999px] border border-[#C7C7CC] bg-white box-border flex-shrink-0">
              <input
                type="checkbox"
                checked={isInvestorUploaded}
                readOnly
                className="
                  w-[10px] h-[10px] rounded-full
                  appearance-none
                  bg-white
                  checked:bg-black
                  focus:outline-none
                  border-none
                  cursor-pointer
                "
              />
            </div>

            <div className="flex-1">
              <p className="text-[13px] font-semibold text-[#000]">
                Investor Uploaded
              </p>
              <p className="text-[13px] font-normal text-[#000]">
                You will be responsible for submitting and uploading proof of
                payment before the deadline above.
              </p>
            </div>
          </div>

          <div 
            className="flex items-start gap-2.5 py-2.5 cursor-pointer w-full"
            onClick={handleIssuerUploadedClick}
          >
            <div className="flex justify-center items-center w-5 h-5 rounded-[9999px] border border-[#C7C7CC] bg-white box-border flex-shrink-0">
              <input
                type="checkbox"
                checked={isIssuerUploaded}
                readOnly
                className="
                  w-[10px] h-[10px] rounded-full
                  appearance-none
                  bg-white
                  checked:bg-black
                  focus:outline-none
                  border-none
                  cursor-pointer
                "
              />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-[#000]">
                Issuer Uploaded
              </p>
              <p className="text-[13px] font-normal text-[#000]">
                Confirm payment details with the Issuer directly. They will
                upload proof and verify on your behalf.
              </p>
            </div>
          </div>

          {isIssuerUploaded && (
            <div 
              className="flex items-start gap-[10px] pt-[8px] pb-[8px] ps-6 cursor-pointer w-full"
              onClick={handleSubCheckClick}
            >
              <div className="flex justify-center items-center w-5 h-5 rounded-[5px] border border-[#C7C7CC] bg-white box-border relative flex-shrink-0">
                <input
                  type="checkbox"
                  checked={isSubCheckConfirmed}
                  readOnly
                  className="peer w-full h-full rounded-[5px] appearance-none bg-white 
                    checked:bg-black focus:outline-none border-none cursor-pointer"
                />
                <span
                  className="absolute text-white text-xs font-bold pointer-events-none 
                    opacity-0 peer-checked:opacity-100"
                >
                  ✓
                </span>
              </div>
              <p 
                className={`text-[13px] font-normal ${isIssuerUploaded && !isSubCheckConfirmed ? 'text-red-500' : 'text-black'}`}
              >
                <span className="font-semibold">I confirm </span>that I will
                coordinate payment and verification documents directly with the
                Issuer.
              </p>
            </div>
          )}
        </div> */}

        <div className="relative">
          <div className="flex flex-col items-start gap-[10px] p-[18px] pb-6 rounded-xl relative border border-[#E5E5EA] bg-white shadow-[0_0_30px_0_rgba(0,0,0,0.08)] z-50">
            <p className="text-black text-[15px] font-medium">
              Your Purchase ID
            </p>
            <div className="flex justify-between items-center w-full border-t border-[#D1D1D6] pt-[18px]">
              <p className="text-black text-[11px] font-medium">
                Purchase ID
              </p>
              <div className="flex items-center justify-end gap-[5px] rounded border border-[#D1D1D6] bg-[#FAFAFC] p-[2px_7px]">
                <p className="text-black text-[13px] font-medium text-ellipsis">
                  {" "}
                  PUR-2024-001{" "}
                </p>{" "}
                <button
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <FaCopy className="w-3 h-3 text-[#000]" />
                </button>
              </div>
            </div>
          </div>

          {/* Banking Information Section */}
          <div className="!-mt-3 relative z-10">
            <div className="bg-[#F2F2F7] rounded-lg border border-[#E5E5EA] p-4 space-y-3 pt-8">
              <h3 className="text-[15px] font-semibold text-[#000] mb-2">
                Banking Information
              </h3>
              <p className="text-[13px] font-normal text-[#000] mb-4">
                Use the information below to complete your ACH or wire transfer.
                Include your Purchase ID in the memo field to ensure your
                payment is matched to your request.
              </p>

              <div className="flex flex-col justify-center items-start pt-[12px] gap-[10px] border-t-[0.5px] border-[#D1D1D6] w-full">
                <div className="flex items-center justify-between w-full">
                  <span className="text-[11px] font-medium text-[#000]">
                    Bank Name
                  </span>
                  <span className="text-[15px] font-normal text-[#000]">
                    {bankingInfo.bankName}
                  </span>
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="text-[11px] font-medium text-[#000]">
                    Account Name
                  </span>
                  <span className="text-[15px] font-normal text-[#000]">
                    {bankingInfo.accountName}
                  </span>
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="text-[11px] font-medium text-[#000]">
                    Account Number
                  </span>
                  <div className="flex justify-end items-center gap-[5px] p-[2px_7px] rounded-[4px] border-[0.5px] border-[#C7C7CC] bg-[#FAFAFC]">
                    <span className="text-[13px] font-medium text-[#000]">
                      {bankingInfo.accountNumber}
                    </span>
                    <button
                      onClick={() => copyToClipboard(bankingInfo.accountNumber)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      title="Copy Account Number"
                    >
                      <FaCopy className="w-3 h-3 text-[#48484A]" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="text-[11px] font-medium text-[#000]">
                    Routing Number
                  </span>
                  <div className="flex justify-end items-center gap-[5px] p-[2px_7px] rounded-[4px] border-[0.5px] border-[#C7C7CC] bg-[#FAFAFC]">
                    <span className="text-[13px] font-medium text-[#000]">
                      {bankingInfo.routingNumber}
                    </span>
                    <button
                      onClick={() => copyToClipboard(bankingInfo.routingNumber)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      title="Copy Routing Number"
                    >
                      <FaCopy className="w-3 h-3 text-[#48484A]" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="text-[11px] font-medium text-[#000]">
                    SWIFT Code (for Wire Transfers)
                  </span>
                  <div className="flex justify-end items-center gap-[5px] p-[2px_7px] rounded-[4px] border-[0.5px] border-[#C7C7CC] bg-[#FAFAFC]">
                    <span className="text-[13px] font-medium text-[#000]">
                      {bankingInfo.swiftCode}
                    </span>
                    <button
                      onClick={() => copyToClipboard(bankingInfo.swiftCode)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      title="Copy SWIFT Code"
                    >
                      <FaCopy className="w-3 h-3 text-[#48484A]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="secondary"
            size="lg"
            onClick={onBack}
            className="flex-1 !rounded-full !text-[15px] font-[500] !bg-white !border-[#1C1C1E]"
          >
            Back
          </Button>
          <Button
            variant="gradient"
            size="lg"
            onClick={handleSubmit}
            // disabled={isSubmitDisabled}
            className="flex-1 !rounded-full !text-[15px] font-[500]"
          >
            {isSubmitting ? "Submitting..." : "Submit Purchase Request"}
          </Button>
        </div>
      </div>
    </GenericModal>
  );
};

export default PaymentInstructionsModal;