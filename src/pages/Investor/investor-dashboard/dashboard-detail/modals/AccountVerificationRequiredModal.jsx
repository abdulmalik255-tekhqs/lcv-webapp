import React from "react";
import GenericModal from "@/components/shared/GenericModal";
import Button from "@/components/shared/button";
import { useNavigate } from "react-router-dom";

const AccountVerificationRequiredModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleVerifyAccount = () => {
    onClose();
    navigate("/verify-kyc");
  };

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title="Account Verification Required"
      subheader="Complete identity verification to invest on the platform."
      maxWidth="max-w-xl"
      className="bg-white px-[40px]"
    >
      <div
        className="space-y-6  flex
  p-[18px]
  flex-col
  items-start
  gap-[18px]
  flex-1
  rounded-[12px] bg-white shadow-[0_0_30px_0_rgba(0,0,0,0.08)]"
      >
        {/* Items Needed Section */}
        <div>
          <h3 className="text-[15px] font-semibold text-[#000] mb-3">
            Items Needed for Account Verification
          </h3>
          <ul className="space-y-2 text-[13px] font-normal text-[#000]">
            <li className="flex items-start">
              <span className="mr-2 text-[#0D4BEF] ">•</span>
              <span>Personal Information (incl. tax ID)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-[#0D4BEF] ">•</span>
              <span>Photos of government issued ID and a selfie</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-[#0D4BEF]">•</span>
              <span>Accreditation status information (if applicable)</span>
            </li>
          </ul>
          <p className="text-[11px] font-medium text-[#0A0A0A] pt-[18px] font-['Montserrat']">
            Verification typically takes 2-5 business days.
          </p>
        </div>

        {/* Processing Time Note */}
      </div>
      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 w-full">
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
          onClick={handleVerifyAccount}
          className="flex-1 !rounded-full !text-[15px] font-[500]"
        >
          Verify Account
        </Button>
      </div>
    </GenericModal>
  );
};

export default AccountVerificationRequiredModal;
