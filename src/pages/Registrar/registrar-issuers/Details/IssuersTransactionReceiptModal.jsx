import GenericModal from "@/components/shared/GenericModal";
import { Button } from "@/components/shared";
import { FaCheck, FaCopy } from "react-icons/fa6";

const IssuersTransactionReceiptModal = ({ isOpen, onClose, transaction }) => {
  if (!transaction) return null;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-xl"
      className="bg-white"
      title="Transaction Receipt"
      subheader="Blockchain transaction details."
      zIndex="z-[90]"
    >
      <div className="space-y-6 h-[400px] overflow-y-auto scrollbar-hide">
        {/* Transaction Status */}
        <div className="bg-[#FAFAFC] rounded-lg p-4 flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-[#248A3D] flex items-center justify-center flex-shrink-0">
            <FaCheck className="w-4 h-4 text-white " />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#000]">
              Transaction Complete
            </p>
            <p className="text-[13px] font-normal text-[#000]">
              {transaction.tokensTransferred || transaction.tokens} tokens
              successfully transferred on {transaction.dateTime}
            </p>
          </div>
        </div>

        {/* Transaction Details */}
        <div>
          <h3 className="text-[15px] font-semibold text-[#000] mb-4 border-b border-[#E5E5EA] pb-2">
            Transaction Details
          </h3>
          <div className="space-y-3">
            {[
              {
                label: "Request ID",
                value: transaction.requestId || transaction.transactionHash,
              },
              { label: "Asset Name", value: transaction.assetName },
              {
                label: "Asset Type",
                value: transaction.assetType || transaction.assetCategory,
              },
              { label: "From", value: transaction.fromName },
              {
                label: "To",
                value: transaction.to || "Morgan Stanley Wealth",
              },
              {
                label: "Tokens Transferred",
                value: transaction.tokensTransferred || transaction.tokens,
              },
              {
                label: "Amount Paid",
                value: transaction.amountPaid || transaction.tokenValue,
              },
              {
                label: "Payment Method",
                value: transaction.paymentMethod || "Wire Transfer",
              },
              {
                label: "Payment Reference",
                value: transaction.paymentReference || "N/A",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2 border-b border-[#E5E5EA] last:border-0"
              >
                <span className="text-[13px] font-normal text-[#000]">
                  {item.label}
                </span>
                <span className="text-[13px] font-medium text-[#000]">
                  {item.value}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between py-2">
              <span className="text-[13px] font-normal text-[#000]">
                Tx Hash
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-medium text-[#000]">
                  {transaction.fullTxHash ||
                    transaction.txHashFull ||
                    transaction.txHash}
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      transaction.fullTxHash ||
                        transaction.txHashFull ||
                        transaction.txHash
                    )
                  }
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Copy transaction hash"
                >
                  <FaCopy className="w-3 h-3 text-[#000]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <Button
          onClick={onClose}
          variant="gradient"
          size="lg"
          className="w-full"
        >
          Close
        </Button>
      </div>
    </GenericModal>
  );
};

export default IssuersTransactionReceiptModal;
