import React from "react";

import GenericModal from "@/components/shared/GenericModal";
import { FaRegCopy, FaCheckCircle } from "react-icons/fa";
import { Button } from "@/components/shared";

const VerifiedPaymentModal = ({ isOpen, onClose }) => {
  // Sample file data - in real app, this would come from props or API
  const paymentProofFile = {
    name: "Wire_Transfer_Receipt.pdf",
    size: 2516582, // 2.4 MB in bytes
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleViewFile = () => {
    // Handle file view logic here
    console.log("View file:", paymentProofFile.name);
  };

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title="Verified Payment Details"
      subheader=""
    >
      <div className="mt-6">
        <div
          className="w-full bg-white p-[18px] pb-6 shadow-[0px_0px_30px_0px_rgba(0,0,0,0.08)]
rounded-xl"
        >
          <p className="text-[15px] text-black">Purchase Details</p>
          <div className="border-b border-b-[#D1D1D6] mt-2 mb-3"></div>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium text-black">
                Payment Method
              </p>
              <p className="text-[15px] font-normal text-black">
                Wire Transfer
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium text-black">
                Transaction Reference
              </p>
              <div className="px-[7px] py-[2px] rounded-[4px] flex items-center gap-1 border border-[#D1D1D6] bg-[#FAFAFC]">
                <p className="text-[15px] font-normal text-black">
                  PUR-2024-001
                </p>
                <FaRegCopy className="w-4 h-4 text-black" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-[18px] py-6">
          <div className="flex-grow">
            <p className="text-[13px] font-semibold text-black">
              Payment proof
            </p>
            <div className="mt-3">
              <div className="flex items-center justify-between gap-3 p-4 rounded-lg  border border-[#D1D1D6]">
                <div className="flex items-center gap-3 flex-grow">
                  <FaCheckCircle className="w-4 h-4 text-[#0D4BEF] flex-shrink-0" />
                  <p className="text-[13px] text-black truncate font-semibold">
                    {paymentProofFile.name}
                    <span className="mx-2 text-[#48484A]">•</span>
                    <span className="text-[#48484A]">
                      {formatFileSize(paymentProofFile.size)}
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleViewFile}
                  className="px-4 py-2 rounded-full bg-[#F2F2F7] text-[13px] font-bold text-black hover:bg-[#E5E5E5] flex-shrink-0 border border-[#E5E5EA]"
                >
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            size="sm"
            className="!h-[50px] !text-[17px] !px-20"
          >
            Close
          </Button>

          <Button
            variant="gradient"
            size="sm"
            className="!h-[50px] !text-[17px] flex-1"
          >
            Continue to Send to Registrar
          </Button>
        </div>
      </div>
    </GenericModal>
  );
};

export default VerifiedPaymentModal;
