import { useNavigate } from "react-router-dom";
import Button from "@/components/shared/button";
import GenericModal from "@/components/shared/GenericModal";
import { FaCheck } from "react-icons/fa6";

const SuccessModal = ({ isOpen, onClose, onContinue, onCancel }) => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/registrar/assets");
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title="Asset Tokenization Approved"
      subheader="The asset tokenization request has been successfully approved."
      zIndex="z-[60]"
      className="!bg-white"
    >
      {/* Success Message Box */}
      <div className="mb-6 p-4  rounded-lg border border-[#E5E5EA] bg-[#FAFAFC]">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-700 flex items-center justify-center">
            <FaCheck className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#000] mb-1">
              Request Approved
            </p>
            <p className="text-sm font-normal text-[#000]">
              This asset is now ready to be minted on the blockchain.
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-60">
        <Button variant="secondary" onClick={handleCancel} className="flex-1 h-[40px]">
          Close
        </Button>
        <Button variant="gradient" onClick={onContinue} className="flex-1 h-[40px]">
          Continue to Mint
        </Button>
      </div>
    </GenericModal>
  );
};

export default SuccessModal;

