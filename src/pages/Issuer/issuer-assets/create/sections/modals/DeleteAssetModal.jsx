import GenericModal from "@/components/shared/GenericModal";
import { Button } from "@/components/shared";
import alertBlackIcon from "@/assets/issuer-assets/alert-black.svg";

function DeleteAssetModal({
  isOpen,
  onClose,
  onConfirm,
  assetName,
  createdDate,
  lastModifiedDate,
}) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Draft"
      subheader="Are you sure you want to delete this draft?"
      className="max-w-[500px] !bg-white"
    >
      <div className="space-y-4">
        {/* Warning Section */}
        <div className="bg-[#FAFAFC] border border-[#E5E5EA] rounded-lg p-4 flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <img
              src={alertBlackIcon}
              alt="Warning"
              className="w-5 h-5"
            />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#000] mb-1">
              This Action Cannot Be Undone
            </p>
            <p className="text-[13px] font-normal text-[#48484A]">
              Deleting this draft will permanently remove all entered
              information. This action cannot be reversed.
            </p>
          </div>
        </div>

        {/* Asset Details Section */}
        <div className="bg-[#FAFAFC] border border-[#E5E5EA] rounded-lg p-4">
          <h4 className="text-sm font-semibold text-[#000] mb-2">
            Asset Details
          </h4>
          <hr className="border-t border-[#E5E5EA] my-2 border-1"></hr>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-[#48484A]">Asset Name:</span>
              <span className="text-[#000] font-medium">
                {assetName !== "Not provided" ? assetName : "N/A"}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#48484A]">Created:</span>
              <span className="text-[#000] font-medium">
                {formatDate(createdDate)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#48484A]">Last Modified:</span>
              <span className="text-[#000] font-medium">
                {formatDate(lastModifiedDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="secondary"
            onClick={onClose}
            className="h-[40px] flex-1 !rounded-full bg-white border border-[#000] text-[#000] hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="h-[40px] flex-1 !rounded-full !bg-[#D70015] text-white hover:bg-[#B80012] border-0"
          >
            Delete Draft
          </Button>
        </div>
      </div>
    </GenericModal>
  );
}

export default DeleteAssetModal;
