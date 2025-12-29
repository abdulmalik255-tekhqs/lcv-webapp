import exclamationIcon from "@/assets/admin-assets/action.svg";
import cantonIcon from "@/assets/admin-assets/canton.svg";
import northstarIcon from "@/assets/registrar-assets/northstar.svg";
import pdfTextIcon from "@/assets/registrar-assets/pdf-text.svg";
import Button from "@/components/shared/button";
import { TableLoader } from "@/components/shared";
import { useState } from "react";
import { useParams } from "react-router-dom";
import ApprovedTokenizationTimeline from "./ApprovedTokenizationTimeline";
import ApproveIssuanceModal from "./ApproveIssuanceModal";
import MintSuccessModal from "./MintSuccessModal";
import { useGetPurchaseRequestDetail, useGetAssetDetails } from "@/api";

function PendingApprovalDetailsPage() {
  const { id } = useParams();

  const {
    data: purchaseRequestData,
    isLoading,
    isError,
    error,
  } = useGetPurchaseRequestDetail(id);
  const responseData = purchaseRequestData?.data || purchaseRequestData;
  
  // Fetch asset details using asset.id from purchase request
  const {
    data: assetDetailsData,
    isLoading: isAssetDetailsLoading,
    isError: isAssetDetailsError,
  } = useGetAssetDetails(responseData?.asset?.id);
  const assetDetails = assetDetailsData?.data || assetDetailsData;
  
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [isMintSuccessOpen, setIsMintSuccessOpen] = useState(false);

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

  // Extended asset data mapped from API responses
  const extendedAsset = responseData
    ? {
        // Asset Information
        name: responseData.asset?.name || assetDetails?.name || "Nill",
        assetId: responseData.asset?.id || assetDetails?.id || "Nill",
        category: assetDetails?.assetType?.title || "Nill",
        featuredImage: responseData.asset?.featured_image || assetDetails?.featured_image,
        description: responseData.asset?.description || assetDetails?.description || "Nill",
        totalSupply: assetDetails?.total_supply || responseData.asset?.total_supply || "Nill",
        initialPrice: assetDetails?.initial_price || responseData.asset?.initial_price || "Nill",
        initialMint: assetDetails?.initial_mint ? `${assetDetails.initial_mint} Tokens` : "Nill",
        totalSupplyFormatted: assetDetails?.total_supply ? `${assetDetails.total_supply} Tokens` : "Nill",
        
        // Issuer Information
        issuer: responseData.issuer
          ? (() => {
              const firstName = responseData.issuer.first_name || "";
              const lastName = responseData.issuer.last_name || "";
              const fullName = `${firstName} ${lastName}`.trim();
              return fullName || "Nill";
            })()
          : "Nill",
        issuerEmail: responseData.issuer?.email || "Nill",
        
        // Investor/Purchaser Information
        purchaserName: responseData.investor
          ? (() => {
              const firstName = responseData.investor.first_name || "";
              const lastName = responseData.investor.last_name || "";
              const fullName = `${firstName} ${lastName}`.trim();
              return fullName || "Nill";
            })()
          : "Nill",
        purchaserEmail: responseData.investor?.email || "Nill",
        purchaserPhone: "Nill", // Not in API response
        purchaserProfilePic: responseData.investor?.profile_pic,
        
        // Purchase Details
        tokensRequested: responseData.token_requested?.toString() || "Nill",
        pricePerToken: responseData.price_per_token ? `$${responseData.price_per_token}` : "Nill",
        totalAmount: responseData.total_amount ? `$${responseData.total_amount}` : "Nill",
        
        // Payment Information
        paymentMethod: "Nill", // Not in API response
        transactionReference: "Nill", // Not in API response
        paymentProof: responseData.payment_proof || "Nill",
        paymentVerified: responseData.payment_verified,
        
        // Status and Dates
        status: responseData.status || "Nill",
        date: formatDate(responseData.created_at),
        expirationPeriod: formatDate(responseData.expiration_period),
        rejectionRemarks: responseData.rejection_remarks,
        rejectionReason: responseData.rejection_reason,
        
        // Request ID
        requestId: responseData.id || "Nill",
        
        // Asset Details from second API call
        assetBusinessDetail: assetDetails?.assetBusinessDetail,
        assetType: assetDetails?.assetType,
        assetInitialOwners: assetDetails?.assetInitialOwners || [],
        assetFiles: assetDetails?.assetFiles || [],
        assetSponser: assetDetails?.assetSponser || [],
        assetRegistrar: assetDetails?.assetRegistrar,
        
        // Tokenization details (calculated or from asset details)
        availableTreasury: "Nill", // Calculate if needed
        initialTreasury: assetDetails?.initial_mint ? `${assetDetails.initial_mint} Tokens` : "Nill",
      }
    : null;

  const handleApprove = () => {
    setIsMintModalOpen(true);
  };

  const handleMint = () => {
    // Close mint modal and open loader
    setIsMintModalOpen(false);
    setIsMintSuccessOpen(true);
  };

  const handleMintSuccessClose = () => {
    // Close success modal and all modals
    setIsMintSuccessOpen(false);
    setIsMintModalOpen(false);
    setIsMintSuccessOpen(false);
  };

  const handleCancelMint = () => {
    setIsMintModalOpen(false);
  };

  if (isLoading || isAssetDetailsLoading) {
    return (
      <div className="bg-white border rounded-tr-[24px] min-h-screen flex items-center justify-center">
        <TableLoader message="Loading purchase request details..." />
      </div>
    );
  }

  if (isError || isAssetDetailsError || !extendedAsset) {
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
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={extendedAsset.featuredImage || northstarIcon}
                        alt={extendedAsset.name || "Asset"}
                        className="w-20 h-20  object-cover rounded"
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
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[11px] !font-[600] text-[#000] mb-1">
                          Initial Mint
                        </p>
                        <p className="text-[15px] font-medium text-[#000]">
                          {extendedAsset.initialMint}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] !font-[600] text-[#000] mb-1">
                          Total Supply
                        </p>
                        <p className="text-[15px] font-medium text-[#000]">
                          {extendedAsset.totalSupplyFormatted || extendedAsset.totalSupply || "Nill"}
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
                    <div className="flex items-start gap-6">
                      <div className="flex-1 space-y-2">
                        <div>
                          <p className="text-[11px] !font-[600] text-[#000] mb-1">
                            Company
                          </p>
                          <p className="text-[15px] font-medium text-[#0734A9]">
                            {extendedAsset.issuer}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] !font-[600] text-[#000] mb-1">
                            Email
                          </p>
                          <a
                            href={`mailto:${extendedAsset.issuerEmail}`}
                            className="text-[15px] font-medium text-[#0734A9] hover:underline"
                          >
                            {extendedAsset.issuerEmail}
                          </a>
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div>
                          <p className="text-[11px] !font-[600] text-[#000] mb-1">
                            Available Treasury
                          </p>
                          <p className="text-[15px] font-medium text-[#000]">
                            {extendedAsset.availableTreasury}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] !font-[600] text-[#000] mb-1">
                            Initial Treasury
                          </p>
                          <p className="text-[15px] font-medium text-[#000]">
                            {extendedAsset.initialTreasury}
                          </p>
                        </div>
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
                        Email:
                      </p>
                      <a
                        href={`mailto:${extendedAsset.purchaserEmail}`}
                        className="text-[15px] font-medium text-[#0734A9] hover:underline"
                      >
                        {extendedAsset.purchaserEmail}
                      </a>
                    </div>
                    <div>
                      <p className="text-[11px] !font-[600] text-[#000] mb-1">
                        Phone:
                      </p>
                      <p className="text-[15px] font-medium text-[#000]">
                        {extendedAsset.purchaserPhone}
                      </p>
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
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold ${
                        extendedAsset.paymentVerified 
                          ? "bg-[#83F63B33] text-[#000]" 
                          : "bg-[#FFE5E5] text-[#FF0000]"
                      }`}>
                        {extendedAsset.paymentVerified ? "Payment Verified" : "Payment Not Verified"}
                      </span>
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
                        <div className="flex items-center gap-2">
                          <p className="text-[13px] font-normal text-[#000]">
                            {extendedAsset.paymentProof}
                          </p>
                          <img
                            src={pdfTextIcon}
                            alt="PDF Icon"
                            className="w-4 h-4"
                          />
                        </div>
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
                  The Issuer has verified the payment for this request and is
                  awaiting Registrar approval and issuance.
                </p>
                <div className="flex flex-col gap-3 mt-4">
                  {/* <Button
                    variant="gradient"
                    onClick={handleApprove}
                    className="w-full h-[40px]"
                  >
                    Approve Request
                  </Button> */}
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
                      {extendedAsset.name || "Nill"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-[#000]">
                      Purchaser
                    </p>
                    <p className="text-[11px] font-medium text-[#000]">
                      {extendedAsset.purchaserName || "Nill"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-[#000]">
                      Amount
                    </p>
                    <p className="text-[13px] font-normal text-[#000]">
                      {extendedAsset.totalAmount || "Nill"}
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
                      {extendedAsset.status || "Nill"}
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
                      500,000
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
                ? `Tokenization request with IDss: ${id} not found`
                : "Pending review content will be implemented here"}
            </p>
          </div>
        )}
      </div>

      {/* Mint Modal */}
      <ApproveIssuanceModal
        isOpen={isMintModalOpen && !isMintSuccessOpen}
        onClose={handleMintSuccessClose}
        onMint={handleMint}
        onCancel={handleCancelMint}
        asset={extendedAsset}
      />

      {/* Mint Success Modal */}
      <MintSuccessModal
        isOpen={isMintSuccessOpen}
        onClose={handleMintSuccessClose}
        asset={extendedAsset}
      />
    </div>
  );
}

export default PendingApprovalDetailsPage;
