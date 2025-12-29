import { useState } from "react";
import Button from "@/components/shared/button";
import GenericModal from "@/components/shared/GenericModal";
import { useDenyAssetTokenization } from "@/api";
import { useNavigate, useParams } from "react-router-dom";
import useToast from "@/hooks/useCustomToast";
import alertIcon from "@/assets/issuer-assets/alert-black.svg";

const DENIAL_REASONS = [
  "Missing or incomplete documentation",
  "Asset valuation concerns",
  "Compliance or regulatory issues",
  "Insufficient asset information",
  "Does not meet quality standards",
];

const DenyModal = ({ isOpen, onClose }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showBottomRightToast: showSuccessToast, showErrorToast } = useToast();
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [additionalComments, setAdditionalComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: denyAsset } = useDenyAssetTokenization();

  const handleReasonToggle = (reason) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    );
  };

  const handleSubmit = () => {
    if (selectedReasons.length === 0 && !additionalComments.trim()) {
      showErrorToast(
        "Please select at least one reason or provide additional comments"
      );
      return;
    }

    setIsSubmitting(true);
    const rejectionRemarks = selectedReasons.join(", ");
    const rejectionReason =
      additionalComments.trim() || "No additional comments provided";

    denyAsset(
      {
        assetTokenizationId: id,
        rejectionRemarks,
        rejectionReason,
      },
      {
        onSuccess: () => {
          showSuccessToast("Asset tokenization request denied successfully");
          navigate("/registrar/assets");
        },
        onError: (error) => {
          showErrorToast(
            error?.response?.data?.message ||
              "Failed to deny asset tokenization"
          );
          setIsSubmitting(false);
        },
      }
    );
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedReasons([]);
      setAdditionalComments("");
      onClose();
    }
  };

  const remainingChars = 500 - additionalComments.length;

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Deny Asset Tokenization"
      subheader="Please provide feedback to help the Issuer understand why this request is being denied."
      maxWidth="max-w-xl"
    >
      <div className="space-y-4 h-[430px]  overflow-y-auto scrollbar-hide">
        {/* Notification Section */}
        <div className="mb-6 p-4 bg-gray-100 rounded-lg border border-gray-200">
          <div className="flex items-start gap-3">
            <img
              src={alertIcon}
              alt="Warning"
              className="w-5 h-5 mt-0.5 flex-shrink-0"
            />
            <p className="text-[13px] font-normal text-[#000]">
              The Issuer will be notified of this denial and will be able to
              revise and resubmit their asset tokenization request.
            </p>
          </div>
        </div>

        {/* Reasons for Denial */}
        <div className="mb-6">
          <h3 className="text-[15px] font-semibold text-[#000] mb-4 !font-['Montserrat']">
            Reasons for Denial
          </h3>
          <div className="space-y-1 ">
            {DENIAL_REASONS.map((reason) => (
              <label
                key={reason}
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedReasons.includes(reason)}
                  onChange={() => handleReasonToggle(reason)}
                  disabled={isSubmitting}
                  className="w-4 h-4  text-red-600 border-gray-300 rounded focus:ring-red-500 focus:ring-1"
                />
                <span className="text-[13px] font-normal text-[#000]">
                  {reason}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Additional Comments */}
        <div className="mb-6">
          <h3 className="text-[15px] font-semibold text-[#000] mb-3 !font-['Montserrat']">
            Additional Comments
          </h3>
          <div className="relative px-1">
            <textarea
              value={additionalComments}
              onChange={(e) => {
                if (e.target.value.length <= 500) {
                  setAdditionalComments(e.target.value);
                }
              }}
              placeholder="Provide specific details about what needs to be addressed for resubmission."
              disabled={isSubmitting}
              rows={5}
              className="w-full px-1 border border-[#E5E5EA] rounded-sm  focus:outline-none focus:ring-1 focus:ring-red-300 focus:border-transparent text-[13px] font-normal text-[#000]"
            />
            <div className="absolute bottom-3 right-3 text-[11px] text-[#48484A]">
              {remainingChars}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 h-[40px]"
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              (selectedReasons.length === 0 && !additionalComments.trim())
            }
            className="flex-1 h-[40px] !bg-red-600 hover:!bg-red-700 !text-white"
          >
            {isSubmitting ? "Denying..." : "Deny Asset Tokenization"}
          </Button>
        </div>
      </div>
    </GenericModal>
  );
};

export default DenyModal;
