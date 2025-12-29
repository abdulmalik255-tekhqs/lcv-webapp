import React, { useState, useRef } from "react";
import GenericModal from "@/components/shared/GenericModal";
import Button from "@/components/shared/button";
import { FaCopy, FaCheck, FaXmark, FaTriangleExclamation } from "react-icons/fa6";
import { FaUpload } from "react-icons/fa";

const UploadPaymentProofModal = ({
  isOpen,
  onClose,
  onSubmit,
  purchaseRequestOrder,
  asset,
  isSubmitting = false,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  


  const formatPurchaseId = (id) => {
    if (!id) return "PUR-2024-001";
    const lastSegment = id.split("-").pop();
    const numericId = parseInt(lastSegment.substring(0, 3), 16) % 1000;
    return `PUR-2024-${String(numericId).padStart(3, "0")}`;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        alert("Please upload a PDF, JPG, or PNG file");
        return;
      }
      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        alert("File size must be less than 10MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }
    onSubmit?.(selectedFile);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const assetName = asset?.name || asset?.assetBusinessDetail?.company_name || "Riverside Athletic FC";
  const pricePerToken = purchaseRequestOrder?.price_per_token || asset?.initial_price || 1000;
  const tokensRequested = purchaseRequestOrder?.token_requested || 1000;
  const totalAmount = purchaseRequestOrder?.total_amount || tokensRequested * pricePerToken;
  const purchaseId = formatPurchaseId(purchaseRequestOrder?.id);
  const expirationDate = purchaseRequestOrder?.expiration_period;

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Payment Proof"
      subheader="Please upload your payment confirmation document to verify your purchase request. Acceptable formats include bank wire confirmations, transaction receipts, or payment screenshots."
      maxWidth="max-w-xl"
      className="bg-white "
    >
      <div className="space-y-6 h-[470px] min-h-[470px] overflow-y-auto scrollbar-hide">
        {/* Purchase Request Summary */}
        <div className="bg-[#FAFAFC] rounded-lg p-4 space-y-3">
          <h3 className="text-[15px] font-semibold text-[#000] mb-2">
            Purchase Request Summary
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#000]">Asset Name</span>
            <span className="text-[13px] font-normal text-[#000]">{assetName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#000]">Price per Token</span>
            <span className="text-[13px] font-normal text-[#000]">
              {pricePerToken}
            </span>
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

        {/* Payment Confirmation Document */}
        <div>
          <h3 className="text-[15px] font-semibold text-[#000] mb-2">
            Payment Confirmation Document
          </h3>
          <div className="flex items-start justify-between gap-4 mb-3">
            <p className="text-[12px] font-normal text-[#000] flex-1">
              Upload your wire transfer confirmation, bank receipt, or payment proof. Accepted
              formats: PDF, JPG, PNG (max 10MB)
            </p>
            <Button
              variant="secondary"
              size="md"
              onClick={handleUploadClick}
              className="!rounded-full !text-[13px] font-[500] !bg-white !border-[#1C1C1E] flex-shrink-0"
              icon={<FaUpload className="w-3 h-3" />}
              iconPosition="left"
            >
              Upload
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
            className="hidden"
          />
          {selectedFile && (
            <div className="bg-[#FAFAFC] rounded-lg p-3 flex items-center justify-between border border-[#E5E5EA]">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-5 h-5 rounded-full bg-[#248A3D] flex items-center justify-center flex-shrink-0">
                  <FaCheck className="w-3 h-3 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[#000] truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-[11px] font-normal text-[#48484A]">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="text-[13px] font-semibold text-[#FF3B30] hover:underline ml-2"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Upload Deadline */}
        {expirationDate && (
          <div className="bg-[#FAFAFC] rounded-lg p-4 flex items-start gap-3">
            <div className="w-5 h-5 flex-shrink-0 mt-0.5">
              <FaTriangleExclamation className="w-4 h-4 text-[#000]" />
            </div>
            <p className="text-[13px] font-medium text-[#000]">
              Please upload your payment proof by{" "}
              <span className="font-bold">{(expirationDate)}</span> to maintain your
              token reservation.
            </p>
          </div>
        )}

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
            variant="gradient"
            size="lg"
            onClick={handleSubmit}
            disabled={!selectedFile || isSubmitting}
            className="flex-1 !rounded-full !text-[15px] font-[500]"
          >
            {isSubmitting ? "Submitting..." : "Submit Payment Proof"}
          </Button>
        </div>
      </div>
    </GenericModal>
  );
};

export default UploadPaymentProofModal;

