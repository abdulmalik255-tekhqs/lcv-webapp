import Button from "@/components/shared/button";
import GenericModal from "@/components/shared/GenericModal";
import { FaTriangleExclamation } from "react-icons/fa6";

const PublishToMarketModal = ({ isOpen, onClose, onConfirm, onCancel, asset }) => {
  // Calculate total tokens from totalShares or use totalSupply
  const totalTokens = asset?.totalShares || asset?.totalSupply || "50,000";

  // Get token price
  const tokenPrice =
    asset?.tokenPrice || asset?.sharePrice?.replace("$", "") || "100";

 
  const totalOffering = asset?.totalOffering;

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title="Publish Asset to Marketplace"
      subheader="Once published, your asset listing will be visible to all Investors on the marketplace. Please confirm that all details are accurate before proceeding."
      zIndex="z-[70]"
    >
      {/* Asset Details */}
      <div className="mb-6 p-4 !bg-white rounded-lg shadow-md">
        <h3 className="text-[15px] font-semibold text-[#000] mb-2">
          Asset Details
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
            <span className="text-[11px] font-medium text-[#000]">
              Total Token Supply
            </span>
            <span className="text-[15px] font-normal text-[#000]">
              {totalTokens}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#000]">
              Token Price
            </span>
            <span className="text-[15px] font-normal text-[#000]">
              ${tokenPrice}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#000]">
              Total Offering
            </span>
            <span className="text-[15px] font-normal text-[#000]">
              ${totalOffering}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#000]">
              Asset Type
            </span>
            <span className="text-[15px] font-normal text-[#000]">
              {asset?.category || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="mb-6 p-4 bg-[#F2F2F7] border border-[#E5E5EA] rounded-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <FaTriangleExclamation className="w-5 h-5 text-[#000]" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-bold text-[#000] mb-1">
              Important Notice
            </p>
            <p className="text-[13px] font-medium text-[#364153]">
              Publishing this asset will make it available for investment. Ensure all information is complete and accurate.
            </p>
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
        <Button variant="gradient" onClick={onConfirm} className="h-[40px] flex-1">
          Confirm
        </Button>
      </div>
    </GenericModal>
  );
};

export default PublishToMarketModal;
