import GenericModal from "@/components/shared/GenericModal";
import { Button } from "@/components/shared";
import alertBlackIcon from "@/assets/issuer-assets/alert-black.svg";

function SubmitAssetModal({
  isOpen,
  onClose,
  onSubmit,
  isPublishing,
  basicInfo,
  businessDetails,
  tokenizationDetails,
}) {
  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Asset Tokenization Request"
      subheader="Please review the request details before submitting to the Registrar."
      className="max-w-[600px] !bg-white"
    >
      <div className="flex flex-col gap-[18px] mt-[40px]">
        {/* Asset Details Section */}
        <div className=" border border-[#E5E5EA] rounded-lg p-4  bg-[#FFFFFF] shadow-[0_0_30px_0_rgba(0,0,0,0.08)]">
          <h4 className="text-[15px] font-medium text-[#000] mb-2">
            Asset Details
          </h4>
          <div class="flex flex-col justify-center items-start gap-[10px] pt-3  border-t border-[#D1D1D6] ">
            <div className="flex justify-between text-xs w-full">
              <span className="text-[#000] text-[11px] font-medium">
                Asset Name:
              </span>
              <span className="text-[#000] text-[15px] font-normal">
                {basicInfo.assetName !== "Not provided"
                  ? basicInfo.assetName
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between text-xs w-full">
              <span className="text-text-[#000] text-[11px] font-medium">
                Asset Type:
              </span>
              <span className="text-[#000] text-[15px] font-normal">
                {basicInfo.assetType !== "Not provided"
                  ? basicInfo.assetType
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between text-xs w-full">
              <span className="text-text-[#000] text-[11px] font-medium">
                Total Supply:
              </span>
              <span className="text-[#000] text-[15px] font-normal">
                {tokenizationDetails.totalSupply !== "Not provided"
                  ? `${new Intl.NumberFormat("en-US").format(
                      parseFloat(tokenizationDetails.totalSupply) || 0
                    )} tokens`
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between text-xs w-full">
              <span className="text-text-[#000] text-[11px] font-medium">
                Price per Token:
              </span>
              <span className="text-[#000] text-[15px] font-normal">
                {tokenizationDetails.tokenPrice}
              </span>
            </div>
            <div className="flex justify-between text-xs w-full">
              <span className="text-text-[#000] text-[11px] font-medium">
                Owner Allocations:
              </span>
              <span className="text-[#000] text-[15px] font-normal">
                {(() => {
                  const ownerTokens = tokenizationDetails.initialOwners.reduce(
                    (sum, owner) =>
                      sum +
                      (parseFloat(owner.tokens || owner.tokenAllocation || 0) ||
                        0),
                    0
                  );
                  return ownerTokens > 0
                    ? `${new Intl.NumberFormat("en-US").format(
                        ownerTokens
                      )} tokens`
                    : "0 tokens";
                })()}
              </span>
            </div>
            <div className="flex justify-between text-xs w-full">
              <span className="text-[#000] text-[11px] font-medium">
                Available for Investment:
              </span>
              <span className="text-[#000] text-[15px] font-normal">
                {(() => {
                  const initialMint =
                    parseFloat(tokenizationDetails.initialMint) || 0;
                  const ownerTokens = tokenizationDetails.initialOwners.reduce(
                    (sum, owner) =>
                      sum +
                      (parseFloat(owner.tokens || owner.tokenAllocation || 0) ||
                        0),
                    0
                  );
                  const availableTokens = initialMint - ownerTokens;
                  const tokenPrice = parseFloat(
                    tokenizationDetails.tokenPrice?.replace(/[^0-9.]/g, "") ||
                      "0"
                  );
                  const availableInvestment = availableTokens * tokenPrice;
                  return availableInvestment > 0 ? availableInvestment : 0;
                })()}
              </span>
            </div>
            <div className="flex justify-between text-xs w-full">
              <span className="text-[#000] text-[11px] font-medium">
                Minimum Investment:
              </span>
              <span className="text-[#000] text-[15px] font-normal">
                {businessDetails.minimumInvestment}
              </span>
            </div>
          </div>
        </div>

        {/* Registrar Review Required Section */}
        <div>
          <div className="!bg-[#F2F2F7] border border-[#E5E5EA] rounded-lg p-4 flex items-center gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <img
                src={alertBlackIcon}
                alt="Registar Review Required"
                className="w-5 h-5"
              />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#000] mb-1">
                Registrar Review Required
              </p>
              <p className="text-[13px] font-normal text-[#000]">
                Your request will be submitted to the Registrar for review and
                approval. You will be notified once the Registrar has reviewed
                your request.
              </p>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="secondary"
            onClick={onClose}
            className="h-[40px] flex-1 !rounded-full bg-white border border-[#000] text-[#000] hover:bg-gray-50"
            disabled={isPublishing}
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            className="h-[40px] flex-1 !rounded-full bg-gradient-to-r from-[#0734A9] to-[#131DBB] text-white hover:opacity-90 hover:bg-black "
            disabled={isPublishing}
          >
            {isPublishing ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
      </div>
    </GenericModal>
  );
}

export default SubmitAssetModal;
