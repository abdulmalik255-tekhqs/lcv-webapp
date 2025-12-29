import GenericModal from "@/components/shared/GenericModal";
import Button from "@/components/shared/button";
import { FaTriangleExclamation } from "react-icons/fa6";

const DeleteInvestorModal = ({ isOpen, onClose, investor, onConfirm }) => {
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title="Revoke Investor"
      subheader="Are you sure you want to permanently revoke this Investor?"
      maxWidth="max-w-lg"
    >
      {/* Asset Details */}
      <div className="mb-6 p-4 !bg-white rounded-lg shadow-[0_0_30px_0_rgba(0,0,0,0.08)]">
        <h3 className="text-[15px] font-semibold text-[#000] mb-2">
          Asset Details
        </h3>
        <hr className="border-t border-[#000] my-2 border-1"></hr>
        <div className="space-y-3 mt-1">
          <div className="flex items-center justify-between !py-[15px]">
            <span className="text-[11px] font-medium text-[#000]">
              Investor Name
            </span>
            <span className="text-[15px] font-normal text-[#000]">
              {investor?.name || "N/A"}
            </span>
          </div>
          <div className="flex items-center justify-between  border-t border-t-[#D1D1D6] py-[15px]">
            <span className="text-[11px] font-medium text-[#000]">Type</span>
            <span className="text-[15px] font-normal text-[#000]">
              {investor?.type === "institutional"
                ? "Institutional"
                : "Individual"}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-t-[#D1D1D6] py-[15px]">
            <span className="text-[11px] font-medium text-[#000]">Contact</span>
            <span className="text-[15px] font-normal text-[#000]">
              {investor?.name || "N/A"}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-t-[#D1D1D6] py-[15px]">
            <span className="text-[11px] font-medium text-[#000]">Email</span>
            <span className="text-[15px] font-normal text-[#000]">
              {investor?.email || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Warning Message */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg flex items-start gap-3">
        <FaTriangleExclamation className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] font-semibold text-[#000] mb-1">
            This action cannot be undone.
          </p>
          <p className="text-[12px] text-[#000]">
            Deleting this Investor permanently removes all access, disables
            viewing and transacting, and prevents re-registration with the same
            credentials.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <Button variant="secondary" className="flex-1" onClick={onClose}>
          Close
        </Button>
        <Button
          variant="primary"
          className="flex-1 bg-red-600 hover:bg-red-700"
          onClick={handleConfirm}
        >
          Delete Investor
        </Button>
      </div>
    </GenericModal>
  );
};

export default DeleteInvestorModal;
