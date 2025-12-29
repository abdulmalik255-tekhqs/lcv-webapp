import Button from "@/components/shared/button";
import GenericModal from "@/components/shared/GenericModal";
import { FaCheck } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const MintSuccessModal = ({ isOpen, onClose, asset, transactionData }) => {
  const navigate = useNavigate();

  const handleContinue = () => {
    onClose();
    navigate("/registrar/tokenization-issuance-queue");
  };

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Approved"
      subheader="The purchase request has been approved and is ready for token issuance."
      zIndex="z-[90]"
      className="!bg-white h-[500px]"
    >
      {/* Success Confirmation Section */}
      <div className="h-[300px] overflow-y-auto">
      <div className="mb-6 p-4 !bg-[#FAFAFC] rounded-lg  border border-[#E5E5EA]">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-700 flex items-center justify-center">
            <FaCheck className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-medium text-[#000]">
              Proceed to issue tokens to the purchaser's wallet.
            </p>
          </div>
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
          Close
        </Button>
        <Button
          variant="gradient"
          onClick={handleContinue}
          className="flex-1 h-[40px]"
        >
          Continue to Issue Tokens
        </Button>
      </div>
    </GenericModal>
  );
};

export default MintSuccessModal;
