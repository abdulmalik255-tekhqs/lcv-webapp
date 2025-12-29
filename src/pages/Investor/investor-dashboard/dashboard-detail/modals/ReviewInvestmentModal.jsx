import React, { useState } from "react";
import GenericModal from "@/components/shared/GenericModal";
import Button from "@/components/shared/button";

const ReviewInvestmentModal = ({ asset, isOpen, onClose, onContinue }) => {
  const [isChecked, setIsChecked] = useState(false);

 

  const handleContinue = () => {
    if (isChecked) {
      onContinue?.();
    }
  };

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title="Review Investment"
      subheader="Please review your investment details before proceeding to payment."
      maxWidth="max-w-2xl"
      className="bg-white"
    >
      <div className="space-y-6 ">
        {/* Investment Summary Card */}
        <div className="flex flex-col items-start gap-4.5  rounded-xl bg-white p-[18px_18px_24px_18px] shadow-[0_0_30px_0_rgba(0,0,0,0.08)]">
          <h3 className="text-[15px] font-medium text-[#000] mb-4 font-['Montserrat']">
            Investment Summary
          </h3>
          <div className="flex flex-col items-start justify-center  border-t-[#D1D1D6] border-t-[0.5px] gap-2.5 pt-3 w-full">
            <div className="flex items-center justify-between w-full">
              <p className="text-[11px] font-medium text-[#000] mb-1 font-['Montserrat']">
                Asset Name
              </p>
              <p className="text-[15px] font-normal text-[#000] font-['Montserrat']">
                {asset?.name || "N/A"}
              </p>
            </div>
            <div className="flex items-center justify-between w-full">
              <p className="text-[11px] font-medium text-[#000] mb-1 font-['Montserrat']">
                Token Quantity
              </p>
              <p className="text-[15px] font-normal text-[#000] font-['Montserrat']">
                {asset?.total_supply || 0}
              </p>
            </div>
            <div className="flex items-center justify-between w-full">
              <p className="text-[11px] font-medium text-[#000] mb-1 font-['Montserrat']">
                Price per Token
              </p>
              <p className="text-[15px] font-normal text-[#000] font-['Montserrat']">
                {asset?.initial_price}
              </p>
            </div>
            <div className="flex items-center justify-between w-full">
              <p className="text-[11px] font-medium text-[#000] mb-1 font-['Montserrat']">
                Total Investment Amount
              </p>
              <p className="text-[15px] font-normal text-[#000] font-['Montserrat']">
                {asset?.assetBusinessDetail?.minimum_investment}
              </p>
            </div>
            <div className="flex items-center justify-between w-full">
              <p className="text-[11px] font-medium text-[#000] mb-1 font-['Montserrat']">
                Expected Return
              </p>
              <p className="text-[15px] font-normal text-[#000] font-['Montserrat']">
                {asset?.assetBusinessDetail?.minimum_annual_return}% annually
              </p>
            </div>
            <div className="flex items-center justify-between w-full">
              <p className="text-[11px] font-medium text-[#000] mb-1 font-['Montserrat']">
                Investment Term
              </p>
              <p className="text-[15px] font-normal text-[#000] font-['Montserrat']">
                {asset?.assetBusinessDetail?.expected_term || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Checkbox */}
        <div className="flex items-start  gap-2.5 pr-[30px] py-2 pt-2 pb-3 mt-[18px]">
          <input
            type="checkbox"
            id="risk-acknowledgment"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className={`
              mt-1 w-5 h-5 rounded
              border border-[#E5E5EA]
              appearance-none cursor-pointer
              checked:bg-black checked:border-black
              checked:before:content-['✓']
              checked:before:text-white
              checked:before:flex checked:before:items-center checked:before:justify-center
              checked:before:w-full checked:before:h-full
              text-sm
              focus:outline-none focus:ring-0
            `}
          />
          <label
            htmlFor="risk-acknowledgment"
            className="text-[13px] font-normal text-[#000] cursor-pointer"
          >
            I <strong>understand</strong> this investment involves risk and I
            have reviewed the offering documents.
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex p-[15px_24px_24px_24px] items-center gap-[18px] ">
          <Button
            variant="secondary"
            size="lg"
            onClick={onClose}
            className=" !rounded-full !text-[15px] font-[500] !bg-white !border-[#1C1C1E] !px-5"
            style={{ width:"30%" }}
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            size="lg"
            onClick={handleContinue}
            disabled={!isChecked}
            className="flex-1 !rounded-full !text-[15px] font-[500]"
             style={{ width:"70%" }}
          >
            Continue to Payment Instructions
          </Button>
        </div>
      </div>
    </GenericModal>
  );
};

export default ReviewInvestmentModal;
