import exclamationIcon from "@/assets/admin-assets/action.svg";
import cantonIcon from "@/assets/admin-assets/canton.svg";
import northstarIcon from "@/assets/registrar-assets/northstar.svg";
import pdfTextIcon from "@/assets/registrar-assets/pdf-text.svg";
import Button from "@/components/shared/button";
import GenericLoader from "@/components/shared/GenericLoader";
import { TableLoader } from "@/components/shared";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetPurchaseRequestDetail, useMintPurchaseRequest } from "@/api";
import useToast from "@/hooks/useCustomToast";
import ApprovedTokenizationTimeline from "./ApprovedTokenizationTimeline";
import ApproveIssuanceModal from "./ApproveIssuanceModal";
import MintSuccessModal from "./MintSuccessModal";

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return "Nill";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Nill";
  }
};

function IssuancePendingDetailsPage() {
  const { id } = useParams();

  const {
    data: purchaseRequestData,
    isLoading,
    isError,
    error,
  } = useGetPurchaseRequestDetail(id);

  const mintPurchaseRequestMutation = useMintPurchaseRequest();
  const { showErrorToast, showBottomRightToast: showSuccessToast } = useToast();
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [isLoaderOpen, setIsLoaderOpen] = useState(false);
  const [isMintSuccessOpen, setIsMintSuccessOpen] = useState(false);
  const [transactionData, setTransactionData] = useState(null);
  const [mintSuccess, setMintSuccess] = useState(false);

  const responseData = purchaseRequestData?.data || purchaseRequestData;

  const extendedAsset = responseData
    ? {
        // Asset Information
        name: responseData.asset?.name,
        assetId: responseData.asset?.id,
        category: "Nill", // Not in API response
        featuredImage: responseData.asset?.featured_image,
        description: responseData.asset?.description,
        totalSupply: responseData.asset?.total_supply,
        initialPrice: responseData.asset?.initial_price,

        // Issuer Information
        issuer: responseData.issuer
          ? (() => {
              const firstName = responseData.issuer.first_name || "";
              const lastName = responseData.issuer.last_name || "";
              const fullName = `${firstName} ${lastName}`.trim();
              return fullName || "Nill";
            })()
          : "Nill",
        issuerEmail: responseData.issuer?.email,

        // Investor/Purchaser Information
        purchaserName: responseData.investor
          ? (() => {
              const firstName = responseData.investor.first_name || "";
              const lastName = responseData.investor.last_name || "";
              const fullName = `${firstName} ${lastName}`.trim();
              return fullName || "Nill";
            })()
          : "Nill",
        purchaserEmail: responseData.investor?.email,
        purchaserPhone: "Nill", // Not in API response
        purchaserProfilePic: responseData.investor?.profile_pic,

        // Purchase Details
        tokensRequested: responseData.token_requested,
        pricePerToken: responseData.price_per_token,
        totalAmount: responseData.total_amount,

        // Payment Information
        paymentMethod: "Nill", // Not in API response
        transactionReference: "Nill", // Not in API response
        paymentProof: responseData.payment_proof,
        paymentVerified: responseData.payment_verified,

        // Status and Dates
        status: responseData.status,
        date: formatDate(responseData.created_at),
        expirationPeriod: formatDate(responseData.expiration_period),
        rejectionRemarks: responseData.rejection_remarks,
        rejectionReason: responseData.rejection_reason,

        // Request ID
        requestId: responseData.id,
      }
    : null;

  const handleApprove = () => {
    setIsMintModalOpen(true);
  };

  const handleMint = async () => {
    if (!id) {
      showErrorToast("Purchase request ID is missing");
      return;
    }

    // Close mint modal and open loader
    setIsMintModalOpen(false);
    setIsLoaderOpen(true);
    setMintSuccess(false);

    try {
      const response = await mintPurchaseRequestMutation.mutateAsync(id);
      const responseData = response?.data || response;

      // Map API response to transaction data format
      const txData = {
        tokensMinted:
          extendedAsset?.tokensRequested || responseData?.tokens_minted || "0",
        txHash:
          responseData?.transaction_hash || responseData?.tx_hash || "TBD",
        blockNumber:
          responseData?.block_number || responseData?.blockNumber || "TBD",
        network: "Canton Network",
        timestamp: responseData?.timestamp
          ? new Date(responseData.timestamp).toLocaleString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })
          : new Date().toLocaleString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            }),
      };

      setTransactionData(txData);
      setMintSuccess(true);
      // showSuccessToast("Tokens minted successfully on blockchain");
      // Keep loader open until it completes naturally
      // The loader will call handleLoaderComplete when done
    } catch (error) {
      setMintSuccess(false);
      setIsLoaderOpen(false);
      showErrorToast(
        error?.response?.data?.message || "Failed to mint tokens on blockchain"
      );
      // Reopen mint modal on error
      setIsMintModalOpen(true);
    }
  };

  const handleLoaderComplete = () => {
    // Close loader and open success modal only if minting was successful
    if (mintSuccess) {
      setIsLoaderOpen(false);
      setIsMintSuccessOpen(true);
    }
  };

  const handleMintSuccessClose = () => {
    // Close success modal and all modals
    setIsMintSuccessOpen(false);
    setIsMintModalOpen(false);
    setIsLoaderOpen(false);
    // Navigation will be handled by MintSuccessModal
  };

  const handleCancelMint = () => {
    setIsMintModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="bg-white border rounded-tr-[24px] min-h-screen flex items-center justify-center">
        <TableLoader message="Loading purchase request details..." />
      </div>
    );
  }

  if (isError || !extendedAsset) {
    return (
      <div className="bg-white border rounded-tr-[24px] min-h-screen flex items-center justify-center">
        <div className="rounded-lg border border-[#E5E5EA] p-6">
          <p className="text-gray-500 text-center">
            {id
              ? `Purchase request with ID: ${id} not found`
              : "Failed to load purchase request details"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-tr-[24px] min-h-screen">
      <div className="p-4 sm:p-6">
        {extendedAsset ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Asset Details */}

            <div className="lg:col-span-2 space-y-6">
              {/* Asset Details Top Section */}
              <div className="text-start pl-5 !pb-0 !py-0 text-[24px] font-normal font-['Atacama'] leading-[120%] tracking-[0.48px] text-[#000] rounded-tr-[24px]">
                Purchase Request Details
              </div>
              <span className="text-start !text-[#48484A] font-normal !text-sm !py-0 pl-5">
                Review, approve, and issue tokens.
              </span>
              <div className="rounded-lg bg-white p-6">
                {/* Top Row: Asset Information (left) and Issuer (right) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  {/* Asset Information */}
                  <div>
                    <h3 className="text-[13px] font-semibold text-[#000] mb-4 !font-['Montserrat']">
                      Asset Information
                    </h3>
                    <hr className="border-t border-[#000] my-4 border-1"></hr>
                    <div className="flex items-start gap-4">
                      <img
                        src={extendedAsset.featuredImage || northstarIcon}
                        alt={extendedAsset.name}
                        className="w-20 h-20 object-cover rounded"
                        onError={(e) => {
                          e.target.src = northstarIcon;
                        }}
                      />
                      <div className="flex-1">
                        <p className="text-[17px] font-[500] text-[#000] mb-1">
                          {extendedAsset.name}
                        </p>
                        <p className="text-[13px] font-normal text-[#000] mb-1">
                          {extendedAsset.category}
                        </p>
                        <p className="text-[11px] font-normal text-[#000]">
                          {extendedAsset.assetId}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Issuer Section */}
                  <div>
                    <h3 className="text-[13px] font-semibold text-[#000] mb-4 !font-['Montserrat']">
                      Issuer
                    </h3>
                    <hr className="border-t border-[#000] my-4 border-1"></hr>
                    <div className="space-y-2">
                      <div>
                        <p className="text-[11px] !font-[600] text-[#000] mb-1">
                          Company:
                        </p>
                        <p className="text-[15px] font-medium text-[#0734A9]">
                          {extendedAsset.issuer}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] !font-[600] text-[#000] mb-1">
                          Email:
                        </p>
                        <a
                          href={`mailto:${extendedAsset.issuerEmail}`}
                          className="text-[15px] font-medium text-[#0734A9] hover:underline"
                        >
                          {extendedAsset.issuerEmail}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle Row: Purchaser (full width) */}
                <div className="mb-10">
                  <h3 className="text-[13px] font-semibold text-[#000] mb-4 !font-['Montserrat']">
                    Purchaser
                  </h3>
                  <hr className="border-t border-[#000] my-4 border-1"></hr>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-[11px] !font-[600] text-[#000] mb-1">
                        Name:
                      </p>
                      <p className="text-[15px] font-medium text-[#000]">
                        {extendedAsset.purchaserName}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] !font-[600] text-[#000] mb-1">
                        Email:
                      </p>
                      <a
                        href={`mailto:${extendedAsset.purchaserEmail}`}
                        className="text-[15px] font-medium text-[#0734A9] hover:underline"
                      >
                        {extendedAsset.purchaserEmail}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Purchase Details (left) and Payment Information (right) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                  {/* Purchase Details Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[13px] font-semibold text-[#000] !font-['Montserrat']">
                        Purchase Details
                      </h3>
                      {extendedAsset.paymentVerified ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-[#83F63B33] text-[#000]">
                          Payment Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-[#FF3B3033] text-[#000]">
                          Payment Not Verified
                        </span>
                      )}
                    </div>
                    <hr className="border-t border-[#000] my-4 border-1"></hr>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-[13px] !font-[400] text-[#000] mb-1">
                          Tokens Requested:
                        </p>
                        <p className="text-[13px] font-normal text-[#000]">
                          {extendedAsset.tokensRequested}
                        </p>
                      </div>
                      <hr className="border-t border-[#C7C7CC] my-4 border-1"></hr>
                      <div className="flex items-center justify-between">
                        <p className="text-[13px] !font-[400] text-[#000] mb-1">
                          Price per Token:
                        </p>
                        <p className="text-[13px] font-normal text-[#000]">
                          {extendedAsset.pricePerToken}
                        </p>
                      </div>
                      <hr className="border-t border-[#C7C7CC] my-4 border-1"></hr>
                      <div className="flex items-center justify-between">
                        <p className="text-[13px] !font-[400] text-[#000] mb-1">
                          Total Amount:
                        </p>
                        <p className="text-[15px] font-bold text-[#000]">
                          {extendedAsset.totalAmount}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information Section */}
                  <div>
                    <h3 className="text-[13px] font-semibold text-[#000] mb-6 !font-['Montserrat']">
                      Payment Information
                    </h3>
                    <hr className="border-t border-[#000] mb-3 border-1"></hr>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-[13px] !font-[400] text-[#000] mb-1">
                          Payment Method:
                        </p>
                        <p className="text-[13px] font-normal text-[#000]">
                          {extendedAsset.paymentMethod}
                        </p>
                      </div>
                      <hr className="border-t border-[#C7C7CC] my-4 border-1"></hr>
                      <div className="flex items-center justify-between">
                        <p className="text-[13px] !font-[400] text-[#000] mb-1">
                          Transaction Reference:
                        </p>
                        <p className="text-[13px] font-normal text-[#000]">
                          {extendedAsset.transactionReference}
                        </p>
                      </div>
                      <hr className="border-t border-[#C7C7CC] my-4 border-1"></hr>
                      <div className="flex items-center justify-between">
                        <p className="text-[13px] !font-[400] text-[#000] mb-1">
                          Payment Proof:
                        </p>
                        {extendedAsset.paymentProof &&
                        extendedAsset.paymentProof !== "Nill" ? (
                          <div className="flex items-center gap-2">
                            {extendedAsset.paymentProof.startsWith("http") ? (
                              <a
                                href={extendedAsset.paymentProof}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[13px] font-normal text-[#0734A9] hover:underline"
                              >
                                View Payment Proof
                              </a>
                            ) : (
                              <p className="text-[13px] font-normal text-[#000]">
                                {extendedAsset.paymentProof}
                              </p>
                            )}
                            <img
                              src={pdfTextIcon}
                              alt="PDF Icon"
                              className="w-4 h-4"
                            />
                          </div>
                        ) : (
                          <p className="text-[13px] font-normal text-[#000]">
                            No payment proof provided
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Action Required, Submission, Blockchain, Timeline */}
            <div className="">
              {/* Action Required */}
              <div className=" rounded-lg  px-6">
                <div className="flex items-start gap-3 mb-4">
                  <img
                    src={exclamationIcon}
                    alt="Exclamation Icon"
                    className="w-5 h-5"
                  />
                  <h3 className="text-[15px] font-medium text-[#000] ">
                    Action Required
                  </h3>
                </div>

                <p className="text-[13px] font-normal text-[#364153]">
                  This request has been approved and is awaiting token issuance.
                </p>
                <div className="flex flex-col gap-3 mt-4">
                  <Button
                    variant="gradient"
                    onClick={handleApprove}
                    className="w-full h-[40px]"
                  >
                    Issue Tokens
                  </Button>
                </div>
                <hr className="border-t border-[#E5E5EA] px-8 border-1 !mt-6"></hr>
              </div>
              {/* Issuer Submission */}
              <div className=" rounded-lg  !px-6 mt-6">
                <h3 className="text-[15px] font-medium text-[#000] mb-4 !font-['Montserrat']">
                  Issuer Submission
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-[#000]">Asset</p>
                    <p className="text-[13px] font-normal text-[#000]">
                      {extendedAsset.name}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-[#000]">
                      Purchaser
                    </p>
                    <p className="text-[11px] font-medium text-[#000]">
                      {extendedAsset.purchaserName}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-[#000]">
                      Amount
                    </p>
                    <p className="text-[13px] font-normal text-[#000]">
                      {extendedAsset.totalAmount}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-[#000]">
                      Request Status
                    </p>
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold !bg-[#2D67FF1A] text-[#000]
 "
                    >
                      {extendedAsset.status}
                    </span>
                  </div>
                </div>
                <div className="mt-4 p-4 border border-[#E5E5EA] bg-gray-100 rounded-lg">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-medium text-[#000]">
                        Request ID
                      </p>
                      <p className="text-[13px] font-medium text-[#000]">
                        {extendedAsset.requestId}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-medium text-[#000]">
                        Submission Date
                      </p>
                      <p className="text-[13px] font-medium text-[#000]">
                        {extendedAsset.date}
                      </p>
                    </div>
                  </div>
                </div>
                <hr className="border-t border-[#E5E5EA] px-8 border-1 !mt-6"></hr>
              </div>

              {/* Blockchain Transaction */}
              <div className=" rounded-lg  !px-6 pt-6">
                <h3 className="text-[15px] font-medium text-[#000]  !font-['Montserrat']">
                  Blockchain Transaction
                </h3>
                <p className="text-[11px] font-[500] text-[#48484A] mb-6">
                  Blockchain details will be available after tokens are issued.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-[#000]">
                      Transaction Hash
                    </p>
                    <p className="text-[13px] font-normal text-[#000]">TBD</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-[#000]">
                      Tokens
                    </p>
                    <p className="text-[13px] font-normal text-[#000]">
                      {extendedAsset.tokensRequested || "TBD"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-[#000]">
                      Timestamp
                    </p>
                    <p className="text-[13px] font-normal text-[#000]">TBD</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-[#000]">
                      Contract Address
                    </p>
                    <p className="text-[13px] font-normal text-[#000]">TBD</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-[#000]">
                      Block Number
                    </p>
                    <p className="text-[13px] font-normal text-[#000]">TBD</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-[#000]">
                      Network
                    </p>
                    <div className="flex items-center gap-1">
                      <p className="text-[13px] font-normal text-[#000]">
                        Canton
                      </p>
                      <img
                        src={cantonIcon}
                        alt="Canton Icon"
                        className="w-6 h-6"
                      />
                    </div>
                  </div>
                </div>
                <hr className="border-t border-[#E5E5EA] px-8 border-1 !mt-6"></hr>
              </div>

              {/* Tokenization Timeline */}
              <div className="!px-6 pt-6">
                <ApprovedTokenizationTimeline currentStep={3} />
              </div>
            </div>
          </div>
        ) : (
          <div className=" rounded-lg border border-[#E5E5EA] p-6">
            <p className="text-gray-500 text-center">
              {id
                ? `Tokenization request with IDll: ${id} not found`
                : "Pending review content will be implemented here"}
            </p>
          </div>
        )}
      </div>

      {/* Mint Modal */}
      <ApproveIssuanceModal
        isOpen={isMintModalOpen && !isLoaderOpen && !isMintSuccessOpen}
        onClose={handleMintSuccessClose}
        onMint={handleMint}
        onCancel={handleCancelMint}
        asset={extendedAsset}
        purchaserName={extendedAsset.purchaserName}
      />

      {/* Generic Loader */}
      <GenericLoader
        isOpen={isLoaderOpen}
        onClose={handleMintSuccessClose}
        onComplete={handleLoaderComplete}
      />

      {/* Mint Success Modal */}
      <MintSuccessModal
        isOpen={isMintSuccessOpen}
        onClose={handleMintSuccessClose}
        asset={extendedAsset}
        transactionData={transactionData}
      />
    </div>
  );
}

export default IssuancePendingDetailsPage;
