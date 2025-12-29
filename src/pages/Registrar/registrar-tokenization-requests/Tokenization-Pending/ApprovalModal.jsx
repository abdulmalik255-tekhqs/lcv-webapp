import Button from "@/components/shared/button";
import GenericModal from "@/components/shared/GenericModal";
import SuccessModal from "./SuccessModal";
import MintModal from "./MintModal";
import GenericLoader from "@/components/shared/GenericLoader";
import MintSuccessModal from "./MintSuccessModal";
import { useState } from "react";
import validatingBlue from "@/assets/admin-assets/validating-blue.svg";
import connectingBlue from "@/assets/admin-assets/connecting-blue.svg";
import connectingGray from "@/assets/admin-assets/connecting-gray.svg";
import creatingBlue from "@/assets/admin-assets/creating-blue.svg";
import creatingGray from "@/assets/admin-assets/creating-gray.svg";
import mintingBlue from "@/assets/admin-assets/minting-blue.svg";
import mintingGray from "@/assets/admin-assets/minting-gray.svg";
import recordingBlue from "@/assets/admin-assets/recording-blue.svg";
import recordingGray from "@/assets/admin-assets/recording-gray.svg";
import confirmingBlue from "@/assets/admin-assets/confirming-blue.svg";
import confirmingGray from "@/assets/admin-assets/confirming-gray.svg";

const ApprovalModal = ({ isOpen, onClose, onApprove, asset }) => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [isLoaderOpen, setIsLoaderOpen] = useState(false);
  const [isMintSuccessOpen, setIsMintSuccessOpen] = useState(false);

  // Calculate total tokens from totalShares or use totalSupply
  const totalTokens =
    asset?.totalShares?.replace(/,/g, "") || asset?.totalSupply || "50,000";

  // Get token price
  const tokenPrice =
    asset?.tokenPrice || asset?.sharePrice?.replace("$", "") || "100";

  // Calculate capital target (total tokens * token price)
  const capitalTarget =
    asset?.totalOffering ||
    (
      parseInt(totalTokens.replace(/,/g, "")) *
      parseInt(tokenPrice.replace("$", "").replace(/,/g, ""))
    ).toLocaleString();

  const handleApprove = () => {
    // Close approval modal and open success modal
    onApprove();
    setIsSuccessModalOpen(true);
  };

  const handleCloseAll = () => {
    // Close all modals
    setIsSuccessModalOpen(false);
    setIsMintModalOpen(false);
    setIsLoaderOpen(false);
    setIsMintSuccessOpen(false);
    onClose();
  };

  const handleContinueToMint = () => {
    // Close success modal and open mint modal
    setIsSuccessModalOpen(false);
    setIsMintModalOpen(true);
  };

  const handleMint = () => {
    // Close mint modal and open loader
    setIsMintModalOpen(false);
    setIsLoaderOpen(true);
  };

  const handleLoaderComplete = () => {
    // Close loader and open success modal
    setIsLoaderOpen(false);
    setIsMintSuccessOpen(true);
  };

  const handleMintSuccessClose = () => {
    // Close success modal and all modals
    setIsMintSuccessOpen(false);
    handleCloseAll();
  };

  const handleCancelSuccess = () => {
    setIsSuccessModalOpen(false);
  };

  const handleCancelMint = () => {
    setIsMintModalOpen(false);
  };

  return (
    <>
      <GenericModal
        isOpen={isOpen && !isSuccessModalOpen && !isMintModalOpen}
        onClose={onClose}
        title="Confirm Asset Tokenization Approval"
        subheader="Please review the asset details before approving this asset for tokenization."
      >
        {/* Asset Details */}
        <div className="mb-6 p-4 !bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-[#000] mb-4">
            Asset Details
          </h3>
          <hr className="border-t border-[#E5E5EA] my-3 border-1"></hr>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#000]">
                Asset Name
              </span>
              <span className="text-[13px] font-medium text-[#000]">
                {asset?.name || "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#000]">
                Issuer
              </span>
              <span className="text-[13px] font-medium text-[#000]">
                {asset?.issuer || "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#000]">
                Total Tokens to Mint
              </span>
              <span className="text-[13px] font-medium text-[#000]">
                {totalTokens}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#000]">
                Token Price
              </span>
              <span className="text-[13px] font-medium text-[#000]">
                ${tokenPrice}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#000]">
                Capital Target
              </span>
              <span className="text-[13px] font-medium text-[#000]">
                ${capitalTarget}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#000]">
                Asset Type
              </span>
              <span className="text-[13px] font-medium text-[#000]">
                {asset?.category || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1 h-[40px]"
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            onClick={handleApprove}
            className="flex-1 h-[40px]"
          >
            Approve Tokenization
          </Button>
        </div>
      </GenericModal>

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseAll}
        onContinue={handleContinueToMint}
        onCancel={handleCancelSuccess}
      />

      <MintModal
        isOpen={isMintModalOpen && !isLoaderOpen && !isMintSuccessOpen}
        onClose={handleCloseAll}
        onMint={handleMint}
        onCancel={handleCancelMint}
        asset={asset}
      />

      <GenericLoader
        isOpen={isLoaderOpen}
        onClose={handleCloseAll}
        onComplete={handleLoaderComplete}
      />

      <MintSuccessModal
        isOpen={isMintSuccessOpen}
        onClose={handleMintSuccessClose}
        asset={asset}
      />
    </>
  );
};

export default ApprovalModal;
