import { useState } from "react";
import exclamationIcon from "@/assets/admin-assets/action.svg";
import cantonIcon from "@/assets/admin-assets/canton.svg";
import northstarIcon from "@/assets/registrar-assets/northstar.svg";
import Button from "@/components/shared/button";
import { useParams } from "react-router-dom";
import PurchaseRequestTimeline from "./PurchaseRequestTimeline";
import { useGetPurchaseRequestDetail } from "@/api/assets/useGetPurchaseRequestDetail";
import { useGetAssetDetails } from "@/api/assets/useGetAssetDetails";
import DenyRequestModal from "./DenyRequestModal";
import PaymentProofModal from "./PaymentProofModal";
import { TableLoader } from "@/components/shared";

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "-";
  }
};

function IssuancePendingDetails() {
  const { id } = useParams();
  const {
    data: purchaseRequestData,
    isLoading,
    isError,
  } = useGetPurchaseRequestDetail(id);
  const assetId = purchaseRequestData?.asset?.id;
  const { data: assetDetailsData, isLoading: isLoadingAssetDetails } =
    useGetAssetDetails(assetId);
  const [isDenyModalOpen, setIsDenyModalOpen] = useState(false);
  const [isPaymentProofModalOpen, setIsPaymentProofModalOpen] = useState(false);

  // Map API response data to component format
  const extendedAsset = purchaseRequestData
    ? {
        // Asset Information - from asset details API
        name: assetDetailsData?.data?.name || purchaseRequestData.asset?.name,
        assetId: assetDetailsData?.data?.id || purchaseRequestData.asset?.id,
        category: assetDetailsData?.data?.assetType?.title || "-",
        featuredImage:
          assetDetailsData?.data?.featured_image ||
          purchaseRequestData.asset?.featured_image,
        description:
          assetDetailsData?.data?.description ||
          purchaseRequestData.asset?.description,
        totalSupply:
          assetDetailsData?.data?.total_supply ||
          purchaseRequestData.asset?.total_supply,
        initialPrice:
          assetDetailsData?.data?.initial_price ||
          purchaseRequestData.asset?.initial_price,
        initial_mint:
          assetDetailsData?.initial_mint ||
          purchaseRequestData.asset?.initial_mint,

        // Issuer Information - from asset details API
        issuer: assetDetailsData?.data?.user
          ? (() => {
              const firstName = assetDetailsData.data.user.first_name || "";
              const lastName = assetDetailsData.data.user.last_name || "";
              const fullName = `${firstName} ${lastName}`.trim();
              return fullName || "-";
            })()
          : purchaseRequestData.issuer
          ? (() => {
              const firstName = purchaseRequestData.issuer.first_name || "";
              const lastName = purchaseRequestData.issuer.last_name || "";
              const fullName = `${firstName} ${lastName}`.trim();
              return fullName || "-";
            })()
          : "-",
        issuerEmail:
          assetDetailsData?.data?.user?.email ||
          purchaseRequestData.issuer?.email,

        // Investor/Purchaser Information
        purchaserName: purchaseRequestData.investor
          ? (() => {
              const firstName = purchaseRequestData.investor.first_name || "";
              const lastName = purchaseRequestData.investor.last_name || "";
              const fullName = `${firstName} ${lastName}`.trim();
              return fullName || "-";
            })()
          : "-",
        purchaserEmail: purchaseRequestData.investor?.email,
        purchaserPhone: "-", // Not in API response
        purchaserProfilePic: purchaseRequestData.investor?.profile_pic,

        // Purchase Details
        tokensRequested: purchaseRequestData.token_requested,
        pricePerToken: purchaseRequestData.price_per_token,
        totalAmount: purchaseRequestData.total_amount,

        // Payment Information
        paymentMethod: "-", // Not in API response
        transactionReference: "-", // Not in API response
        paymentProof: purchaseRequestData.payment_proof,
        paymentVerified: purchaseRequestData.payment_verified
          ? "Verified"
          : "Not Verified",

        // Status and Dates
        status: purchaseRequestData.status,
        date: formatDate(purchaseRequestData.created_at),
        expirationPeriod: formatDate(purchaseRequestData.expiration_period),
        rejectionRemarks: purchaseRequestData.rejection_remarks,
        rejectionReason: purchaseRequestData.rejection_reason,

        // Request ID
        requestId: purchaseRequestData.id,
      }
    : null;

  const handleVerifyPayment = () => {
    setIsPaymentProofModalOpen(true);
  };

  const handleDenyRequest = () => {
    setIsDenyModalOpen(true);
  };

  if (isLoading || isLoadingAssetDetails) {
    return (
      <div className="bg-white border rounded-tr-[24px] min-h-screen flex items-center justify-center">
        <TableLoader message="Loading asset details..." />
      </div>
    );
  }

  if (isError || !extendedAsset) {
    return (
      <div className="bg-white border rounded-tr-[24px] flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
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
    <div className="bg-white border rounded-tr-[24px] flex-1 flex flex-col">
      <div className="flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Left Column - Asset Details */}

          <div className="lg:col-span-2 space-y-6 p-4 sm:p-6 pr-0 sm:pr-0">
            {/* Asset Details Top Section */}
            <div className="text-start pl-5 !pb-0 !py-0 text-[24px] font-normal font-['Atacama'] leading-[120%] tracking-[0.48px] text-[#000] rounded-tr-[24px]">
              Token Purchase Request
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
                  <div className="flex items-stretch gap-4">
                    <img
                      src={
                        extendedAsset.featuredImage !== "-"
                          ? extendedAsset.featuredImage
                          : northstarIcon
                      }
                      alt={extendedAsset.name}
                      className="w-[120px] h-[120px] object-cover"
                      onError={(e) => {
                        e.target.src = northstarIcon;
                      }}
                    />
                    <div className="flex-1 flex flex-col">
                      <p className="text-[17px] font-[500] text-[#000] mb-1">
                        {extendedAsset.name}
                      </p>
                      <p className="text-[13px] font-normal text-[#000] mb-1">
                        {extendedAsset.description}
                      </p>
                      <p className="text-[11px] font-normal text-[#000] mt-auto">
                        {extendedAsset.assetId}
                      </p>
                    </div>
                  </div>
                  <div className="border-y border-y-[#D1D1D6] py-[15px] mt-[18px]">
                    <p className="text-[11px] !font-[600] text-[#000] mb-1">
                      Initial Price
                    </p>
                    <p className="text-[17px] font-medium text-[#000000]">
                      {extendedAsset.initialPrice !== "-"
                        ? extendedAsset.initialPrice
                        : "-"}
                    </p>
                  </div>
                  <div className="py-[15px]">
                    <p className="text-[11px] !font-[600] text-[#000] mb-1">
                      Total Supply
                    </p>
                    <p className="text-[17px] font-medium text-[#000]">
                      {extendedAsset.totalSupply !== "-"
                        ? `${Number(
                            extendedAsset.totalSupply
                          ).toLocaleString()} Tokens`
                        : "-"}
                    </p>
                  </div>
                </div>

                {/* Issuer Section */}
                <div>
                  <h3 className="text-[13px] font-semibold text-[#000] mb-4 !font-['Montserrat']">
                    Issuer
                  </h3>
                  <hr className="border-t border-[#000] my-4 border-1"></hr>
                  <div className="">
                    <div className="py-[15px] pt-0 border-b border-[#D1D1D6]">
                      <p className="text-[11px] !font-[600] text-[#000] mb-1">
                        Company
                      </p>
                      <p className="text-[17px] font-medium text-[#0734A9]">
                        {extendedAsset.issuer}
                      </p>
                    </div>
                    <div className="py-[15px] border-b border-[#D1D1D6]">
                      <p className="text-[11px] !font-[600] text-[#000] mb-1">
                        Email
                      </p>
                      <a
                        href={`mailto:${extendedAsset.issuerEmail}`}
                        className="text-[17px] font-medium text-[#0734A9] hover:underline"
                      >
                        {extendedAsset.issuerEmail}
                      </a>
                    </div>
                    <div className="py-[15px] border-b border-[#D1D1D6]">
                      <p className="text-[11px] !font-[600] text-[#000] mb-1">
                        Available Treasury
                      </p>
                      <p className="text-[17px] font-medium text-[#0734A9]">
                        {extendedAsset.totalSupply}
                      </p>
                    </div>
                    <div className="py-[15px]">
                      <p className="text-[11px] !font-[600] text-[#000] mb-1">
                        Initial Treasury
                      </p>
                      <p className="text-[17px] font-medium text-[#0734A9]">
                        {extendedAsset.initial_mint}
                      </p>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px]">
                  <div className="pb-[15px] border-b border-[#D1D1D6]">
                    <p className="text-[11px] !font-[600] text-[#000] mb-1">
                      Name
                    </p>
                    <p className="text-[17px] font-medium text-[#000]">
                      {extendedAsset.purchaserName}
                    </p>
                  </div>
                  <div className="pb-[15px] ">
                    <p className="text-[11px] !font-[600] text-[#000] mb-1">
                      Email
                    </p>
                    <a
                      href={`mailto:${extendedAsset.purchaserEmail}`}
                      className="text-[17px] font-medium text-[#0734A9] hover:underline"
                    >
                      {extendedAsset.purchaserEmail}
                    </a>
                  </div>
                  <div className="pb-[15px]">
                    <p className="text-[11px] !font-[600] text-[#000] mb-1">
                      Phone
                    </p>
                    <p className="text-[17px] font-medium text-[#000]">
                      {extendedAsset.purchaserPhone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Purchase Details (left) and Payment Information (right) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px] mt-10">
                {/* Purchase Details Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[13px] font-semibold text-[#000] !font-['Montserrat']">
                      Purchase Details
                    </h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-[#83F63B33] text-[#000]">
                      {extendedAsset.status}
                    </span>
                  </div>
                  <hr className="border-t border-[#000] my-4 border-1"></hr>
                  <div className="">
                    <div className="border-b border-[#D1D1D6] pb-[15px]">
                      <p className="text-[11px] !font-[400] text-[#000] mb-1">
                        Tokens Requested
                      </p>
                      <p className="text-[17px] font-normal text-[#000]">
                        {extendedAsset.tokensRequested}
                      </p>
                    </div>

                    <div className="py-[15px] border-b border-[#D1D1D6]">
                      <p className="text-[11px] !font-[400] text-[#000] mb-1">
                        Price per Token:
                      </p>
                      <p className="text-[17px] font-normal text-[#000]">
                        {extendedAsset.pricePerToken}
                      </p>
                    </div>
                    <div className="py-[15px]">
                      <p className="text-[11px] !font-[400] text-[#000] mb-1">
                        Total Amount:
                      </p>
                      <p className="text-[17px] font-normal text-[#000]">
                        {extendedAsset.totalAmount}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Information Section */}
                <div>
                  <h3 className="text-[13px] font-semibold text-[#000] mb-[21px] !font-['Montserrat']">
                    Payment Information
                  </h3>
                  <hr className="border-t border-[#000] mb-4 border-1"></hr>
                  <div className="">
                    <div className="border-b border-[#D1D1D6] pb-[15px]">
                      <p className="text-[11px] !font-[400] text-[#000] mb-1">
                        Payment Method
                      </p>
                      <p className="text-[17px] font-normal text-[#000]">
                        {extendedAsset.paymentMethod}
                      </p>
                    </div>

                    <div className="py-[15px] border-b border-[#D1D1D6]">
                      <p className="text-[11px] !font-[400] text-[#000] mb-1">
                        Payment Proof
                      </p>
                      {extendedAsset.paymentProof !== "-" ? (
                        <a
                          href={extendedAsset.paymentProof}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[17px] font-normal text-[#0734A9] hover:underline"
                        >
                          View Payment Proof
                        </a>
                      ) : (
                        <p className="text-[17px] font-normal text-[#000]">
                          {extendedAsset.paymentProof}
                        </p>
                      )}
                    </div>
                    <div className="py-[15px]">
                      <p className="text-[11px] !font-[400] text-[#000] mb-1">
                        Payment Status
                      </p>
                      <p className="text-[17px] font-normal text-[#000]">
                        {extendedAsset.status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Action Required, Submission, Blockchain, Timeline */}
          <div className="p-4 sm:p-6 pl-0 sm:pl-0 border-l border-l-[#E5E5EA]">
            {/* Action Required */}
            {extendedAsset.status === "Awaiting Verification" && (
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
                  Upload payment proof and verify transaction details.
                </p>
                <div className="flex flex-col gap-3 mt-4">
                  <Button
                    variant="gradient"
                    onClick={handleVerifyPayment}
                    className="w-full h-[40px]"
                  >
                    Verify Payment
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleDenyRequest}
                    className="w-full h-[40px]"
                  >
                    Deny Request
                  </Button>
                </div>
                <hr className="border-t border-[#E5E5EA] px-8 border-1 !mt-6"></hr>
              </div>
            )}
            {/* Issuer Submission */}
            <div className=" rounded-lg  !px-6 mt-6">
              <h3 className="text-[15px] font-medium text-[#000] mb-4 !font-['Montserrat']">
                Issuance Information
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
                  <p className="text-[11px] font-medium text-[#000]">Amount</p>
                  <p className="text-[13px] font-normal text-[#000]">
                    {extendedAsset.totalAmount}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-[#000]">Status</p>
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
                      {extendedAsset.requestId &&
                      extendedAsset.requestId !== "-"
                        ? extendedAsset.requestId.substring(0, 4)
                        : extendedAsset.requestId}
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
                  {extendedAsset.expirationPeriod !== "-" && (
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-medium text-[#000]">
                        Expiration Period
                      </p>
                      <p className="text-[13px] font-medium text-[#000]">
                        {extendedAsset.expirationPeriod}
                      </p>
                    </div>
                  )}
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
                    Contract Address
                  </p>
                  <p className="text-[13px] font-normal text-[#000]">TBD</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-[#000]">Network</p>
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
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-[#000]">
                    Issuance
                  </p>
                  <p className="text-[13px] font-normal text-[#000]">
                    1,000 Tokens
                  </p>
                </div>
                {/* <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-[#000]">
                    Transaction Hash
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
                  <p className="text-[11px] font-medium text-[#000]">Network</p>
                  <p className="text-[13px] font-normal text-[#000]">TBD</p>
                </div> */}
              </div>
              <hr className="border-t border-[#E5E5EA] px-8 border-1 !mt-6"></hr>
            </div>

            {/* Tokenization Timeline */}
            <div className="!px-6 pt-6">
              <PurchaseRequestTimeline currentStep={3} />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DenyRequestModal
        isOpen={isDenyModalOpen}
        onClose={() => setIsDenyModalOpen(false)}
      />
      <PaymentProofModal
        isOpen={isPaymentProofModalOpen}
        onClose={() => setIsPaymentProofModalOpen(false)}
        purchaseData={extendedAsset}
      />
    </div>
  );
}

export default IssuancePendingDetails;
