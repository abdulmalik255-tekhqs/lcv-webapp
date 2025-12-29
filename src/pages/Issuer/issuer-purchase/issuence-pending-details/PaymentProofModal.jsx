import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { FaRegCopy, FaCheckCircle } from "react-icons/fa";
import GenericModal from "@/components/shared/GenericModal";
import { Button, Card } from "@/components/shared";
import axiosInstance from "@/api/axiosInstance";
import urls from "@/constants/urls";
import useToast from "@/hooks/useCustomToast";

const PaymentProofModal = ({ isOpen, onClose, purchaseData }) => {
  const navigate = useNavigate();
  const { showBottomRightToast: showSuccessToast, showErrorToast } = useToast();

  const approveOrderMutation = useMutation({
    mutationFn: (purchaseRequestId) => {
      return axiosInstance.put(urls.ASSETS.APPROVE_ORDER(purchaseRequestId));
    },
    onSuccess: () => {
      showSuccessToast("Order approved successfully");
      onClose();
      navigate("/issuer/purchase-requests");
    },
    onError: (error) => {
      showErrorToast(
        error?.response?.data?.message || "Failed to approve order"
      );
    },
  });

  // Extract filename from URL
  const getFileNameFromUrl = (url) => {
    if (!url) return "Payment Proof";
    try {
      const urlParts = url.split("/");
      const fileName = urlParts[urlParts.length - 1];
      // Remove query parameters if any
      const cleanFileName = fileName.split("?")[0];
      // Decode URL encoding
      return decodeURIComponent(cleanFileName) || "Payment Proof";
    } catch {
      return "Payment Proof";
    }
  };

  // Truncate filename to 20 characters
  const truncateFileName = (fileName, maxLength = 20) => {
    if (!fileName) return "";
    if (fileName.length <= maxLength) return fileName;
    return fileName.substring(0, maxLength) + "...";
  };

  // Get file extension from URL
  const getFileExtension = (url) => {
    if (!url) return "";
    try {
      const fileName = url.split("/").pop().split("?")[0];
      return fileName.split(".").pop().toLowerCase();
    } catch {
      return "";
    }
  };

  // Handle view payment proof
  const handleViewProof = () => {
    if (purchaseData?.paymentProof) {
      window.open(purchaseData.paymentProof, "_blank");
    }
  };

  const handleSubmitAndVerify = () => {
    if (!purchaseData?.requestId || purchaseData.requestId === 'Nill') {
      showErrorToast("Purchase request ID is missing");
      return;
    }

    approveOrderMutation.mutate(purchaseData.requestId);
  };
  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title="Verify Payment Proof"
      subheader="Review the payment proof and confirm the transaction details match the purchase request."
    >
      <Card className="h-[400px] max-h-[400px] overflow-y-auto scrollbar-hide">
        <div>
          <p className="text-[15px] text-black">Purchase Details</p>
          <div className="border-b border-b-[#D1D1D6] mt-2 mb-3"></div>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium text-black">Purchaser</p>
              <p className="text-[15px] font-normal text-black">
                {purchaseData?.purchaserName || 'Nill'}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium text-black">
                Tokens Requested
              </p>
              <p className="text-[15px] font-normal text-black">
                {purchaseData?.tokensRequested !== 'Nill' 
                  ? Number(purchaseData.tokensRequested).toLocaleString() 
                  : 'Nill'}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium text-black">Amount Due</p>
              <p className="text-[15px] font-normal text-black">
                {purchaseData?.totalAmount || 'Nill'}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium text-black">Purchase ID</p>
              <div className="px-[7px] py-[2px] rounded-[4px] flex items-center gap-1 border border-[#D1D1D6] bg-[#FAFAFC]">
                <p className="text-[15px] font-normal text-black">
                  {purchaseData?.requestId && purchaseData.requestId !== 'Nill'
                    ? purchaseData.requestId.substring(0, 4)
                    : 'Nill'}
                </p>
                <FaRegCopy className="w-4 h-4 text-black" />
              </div>
            </div>
          </div>
        </div>
        <div className="py-6">
          <p className="text-[13px] font-semibold text-black mb-4">
            Payment Proof
          </p>
          {purchaseData?.paymentProof ? (
            <div className="flex items-center justify-between gap-3 p-4 rounded-lg bg-[#FAFAFC] border border-[#D1D1D6]">
              <div className="flex items-center gap-3 flex-grow min-w-0">
                <FaCheckCircle className="w-4 h-4 text-[#0D4BEF] flex-shrink-0" />
                <p className="text-[13px] font-normal text-black truncate">
                  {truncateFileName(getFileNameFromUrl(purchaseData.paymentProof))}
                  {getFileExtension(purchaseData.paymentProof) && (
                    <>
                      <span className="mx-2 text-[#48484A]">•</span>
                      <span className="text-[#48484A] uppercase">
                        {getFileExtension(purchaseData.paymentProof)}
                      </span>
                    </>
                  )}
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleViewProof}
                className="flex-shrink-0"
              >
                View
              </Button>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-[#FAFAFC] border border-[#D1D1D6]">
              <p className="text-[13px] text-[#48484A]">
                No payment proof available
              </p>
            </div>
          )}
        </div>
        {/* <div>
          <p className="text-[13px] font-semibold text-black mb-[15px]">
            Payment Details
          </p>
          <Dropdown
            label="Payment Method"
            options={[
              { value: "wire-transfer", label: "Wire Transfer" },
              { value: "ach", label: "ACH" },
            ]}
            hideLabel={true}
            selectedValue={selectedPaymentMethod}
            onChange={(value) => setSelectedPaymentMethod(value)}
          />
          <div className="mt-[15px]">
            <InputField
              label="Transaction Reference"
              hideLabel={true}
              inputClassName={"!py-4 !px-3"}
            />
          </div>

          <div
            className="flex items-center gap-2.5 mt-7 mb-[35px] cursor-pointer"
            onClick={handleToggleConfirm}
          >
            {isConfirmed ? (
              <MdCheckBox className="w-5 h-5 text-[#000000]" />
            ) : (
              <MdCheckBoxOutlineBlank className="w-5 h-5 text-[#AEAEB2]" />
            )}
            <p className="text-[13px] font-normal text-black">
              <span className="font-semibold">I confirm</span> this payment has
              been received and the details are accurate.
            </p>
          </div>
        
        </div> */}

        <div className="grid grid-cols-2 gap-4 ">
            <Button
              variant="secondary"
              size="sm"
              className="!h-[40px] !text-[17px]"
              onClick={onClose}
            >
              Cancel
            </Button>

           <Button
              variant="gradient"
              size="sm"
              className="!h-[40px] !text-[17px]"
              onClick={handleSubmitAndVerify}
              disabled={approveOrderMutation.isPending}
            >
              {approveOrderMutation.isPending ? "Submitting..." : "Verify Payment"}
            </Button> 
          </div>
      </Card>
    </GenericModal>
  );
};

export default PaymentProofModal;
