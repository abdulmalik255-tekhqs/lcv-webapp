import React, { useState, useEffect, useRef } from "react";
import {
  FaPlus,
  FaMinus,
  FaCopy,
  FaArrowsRotate,
  FaTriangleExclamation,
  FaFilePdf,
} from "react-icons/fa6";
import Button from "@/components/shared/button";
import bookmarkIcon from "@/assets/investor-assets/bookmark.svg";
import eyeIcon from "@/assets/registrar-assets/eye.svg";
import cantonIcon from "@/assets/admin-assets/canton.svg";
import linkIcon from "@/assets/registrar-assets/link.svg";
import ReviewInvestmentModal from "./modals/ReviewInvestmentModal";
import PaymentInstructionsModal from "./modals/PaymentInstructionsModal";
import PurchaseRequestSubmittedModal from "./modals/PurchaseRequestSubmittedModal";
import AccountVerificationRequiredModal from "./modals/AccountVerificationRequiredModal";
import UploadPaymentProofModal from "./modals/upload-process/UploadPaymentProofModal";
import PaymentProofSubmittedModal from "./modals/upload-process/PaymentProofSubmittedModal";
import CancelPurchaseRequestModal from "./modals/upload-process/CancelPurchaseRequestModal";
import InvestmentHistoryModal from "./modals/InvestmentHistoryModal";
import {
  useCreatePurchaseRequest,
  useUploadPaymentProof,
  useCancelPurchaseRequest,
  useGetPurchaseRequestOrder,
} from "@/api";
import useProfile from "@/api/auth/useProfile";
import useToast from "@/hooks/useCustomToast";
import WalletAddress from "@/components/shared/WalletAddress";

function InvestorDashboardMarketPlace({ asset, purchaseRequestOrder }) {
  const assetId = asset?.id;
  const pricePerToken = asset?.initial_price || 100;
  const tokenIncrement = 50;
  const [tokens, setTokens] = useState(1000);
  const initialInvestmentAmount = 1000 * (asset?.initial_price || 100);
  const [investmentAmountInput, setInvestmentAmountInput] = useState(
    initialInvestmentAmount.toString()
  );
  const isInputChangeRef = useRef(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSubmittedModalOpen, setIsSubmittedModalOpen] = useState(false);
  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);
  const [isUploadPaymentProofModalOpen, setIsUploadPaymentProofModalOpen] =
    useState(false);
  const [
    isPaymentProofSubmittedModalOpen,
    setIsPaymentProofSubmittedModalOpen,
  ] = useState(false);
  const [
    isCancelPurchaseRequestModalOpen,
    setIsCancelPurchaseRequestModalOpen,
  ] = useState(false);
  const [isInvestmentHistoryModalOpen, setIsInvestmentHistoryModalOpen] =
    useState(false);
  const [purchaseRequestData, setPurchaseRequestData] = useState(null);
  const [paymentProofSubmittedData, setPaymentProofSubmittedData] =
    useState(null);

  const { showErrorToast, showBottomRightToast: showSuccessToast } = useToast();
  const createPurchaseRequestMutation = useCreatePurchaseRequest();
  const uploadPaymentProofMutation = useUploadPaymentProof();
  const cancelPurchaseRequestMutation = useCancelPurchaseRequest();

  // Fetch user profile data to get KYC status
  const { data: profileData } = useProfile();

  // Fetch order data when purchase request ID is available
  const { data: orderData, refetch: refetchOrder } =
    useGetPurchaseRequestOrder(assetId);

  // Check if purchaseRequestOrder has valid data (not empty object)
  const hasPurchaseRequestOrder =
    purchaseRequestOrder &&
    typeof purchaseRequestOrder === "object" &&
    Object.keys(purchaseRequestOrder).length > 0 &&
    purchaseRequestOrder.id;

  // Check if status is "Awaiting Verification" or "Awaiting For Mint"
  const isAwaitingVerification =
    hasPurchaseRequestOrder &&
    (purchaseRequestOrder.status === "Awaiting Verification" ||
      purchaseRequestOrder.status === "Awaiting For Mint");

  // Check if status is "Approved"
  const isApproved =
    hasPurchaseRequestOrder &&
    purchaseRequestOrder.status === "Approved";

  const isRejected =
    hasPurchaseRequestOrder &&
    purchaseRequestOrder.status === "Rejected";

    const isAwaitingUpload =
    hasPurchaseRequestOrder &&
    purchaseRequestOrder.status === "Awaiting Upload";

  // Update tokens when investment amount input changes
  const handleInvestmentAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setInvestmentAmountInput(value);
    isInputChangeRef.current = true;

    if (value === "" || value === ".") {
      setTokens(0);
      return;
    }

    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      if (numValue === 0) {
        setTokens(0);
        return;
      }
      // Calculate tokens exactly from investment amount (no rounding or minimum when typing)
      const calculatedTokens = numValue / pricePerToken;
      setTokens(calculatedTokens);
    }
  };

  // Update investment amount input when tokens change (from buttons only)
  useEffect(() => {
    if (!isInputChangeRef.current) {
      const calculatedAmount = tokens * pricePerToken;
      setInvestmentAmountInput(calculatedAmount.toString());
    }
    isInputChangeRef.current = false;
  }, [tokens, pricePerToken]);

  const handleIncrement = () => {
    isInputChangeRef.current = false;
    setTokens((prev) => prev + tokenIncrement);
  };

  const handleDecrement = () => {
    if (tokens > 0) {
      isInputChangeRef.current = false;
      setTokens((prev) => Math.max(0, prev - tokenIncrement));
    }
  };

  const handleQuickSelect = (selectedTokens) => {
    isInputChangeRef.current = false;
    setTokens(selectedTokens);
  };

  // Modal handlers
  const handleInvestNow = () => {
    // Get KYC status from API response
    const kycStatus = profileData?.kyc_status;
    console.log(profileData, "profileData here");
    console.log(kycStatus, "kyc status here");
    
    // Check if KYC status is approved
    if (kycStatus !== "Approved") {
      setIsKYCModalOpen(true);
      return;
    }

    // If approved, proceed with existing flow
    setIsReviewModalOpen(true);
  };

  const handleReviewContinue = () => {
    setIsReviewModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentBack = () => {
    setIsPaymentModalOpen(false);
    setIsReviewModalOpen(true);
  };

  const handlePaymentSubmit = async () => {
    if (!assetId) {
      showErrorToast("Asset ID is missing");
      return;
    }

    const orderAmount =
      parseFloat(investmentAmountInput) || tokens * pricePerToken;

    try {
      const response = await createPurchaseRequestMutation.mutateAsync({
        assetTokenizationId: assetId,
        orderAmount: orderAmount,
      });

      // Map the API response to purchaseData format
      const mappedPurchaseData = {
        id: response.id,
        tokens: response.token_requested,
        totalAmount: response.total_amount,
        pricePerToken: response.price_per_token,
        purchaseId: response.id,
        reservationDate: response.expiration_period
          ? new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }).format(new Date(response.expiration_period))
          : null,
        assetName:
          asset?.name || asset?.assetBusinessDetail?.company_name || "N/A",
        paymentHandledBy: "Investor",
        status: response.status,
      };

      setPurchaseRequestData(mappedPurchaseData);
      setIsPaymentModalOpen(false);
      setIsSubmittedModalOpen(true);
    } catch (error) {
      console.error("Error creating purchase request:", error);
      showErrorToast(
        error?.response?.data?.message || "Failed to submit purchase request"
      );
    }
  };

  const handleCloseAllModals = () => {
    setIsReviewModalOpen(false);
    setIsPaymentModalOpen(false);
    setIsSubmittedModalOpen(false);
    setIsKYCModalOpen(false);
    setIsUploadPaymentProofModalOpen(false);
    setIsPaymentProofSubmittedModalOpen(false);
    setIsCancelPurchaseRequestModalOpen(false);
    setPurchaseRequestData(null);
    setPaymentProofSubmittedData(null);
  };

  // Handle closing PurchaseRequestSubmittedModal and refetch order
  const handleClosePurchaseRequestSubmittedModal = () => {
    setIsSubmittedModalOpen(false);

    // Refresh the page to immediately refetch the order API
    // This ensures the purchase request order data is up to date
    window.location.reload();
  };

  // Handle upload payment proof
  const handleUploadPaymentProof = async (file) => {
    if (!purchaseRequestOrder?.id) {
      showErrorToast("Purchase request ID is missing");
      return;
    }

    try {
      await uploadPaymentProofMutation.mutateAsync({
        purchaseRequestId: purchaseRequestOrder.id,
        file: file,
      });

      setPaymentProofSubmittedData({
        documentName: file.name,
        submittedOn: new Date().toISOString(),
        purchaseId: purchaseRequestOrder.id,
      });

      setIsUploadPaymentProofModalOpen(false);
      setIsPaymentProofSubmittedModalOpen(true);
      showSuccessToast("Payment proof uploaded successfully");

      // Refetch order data immediately to get updated status
      await refetchOrder();
    } catch (error) {
      console.error("Error uploading payment proof:", error);
      showErrorToast(
        error?.response?.data?.message || "Failed to upload payment proof"
      );
    }
  };

  // Handle cancel purchase request
  const handleCancelPurchaseRequest = async () => {
    if (!purchaseRequestOrder?.id) {
      showErrorToast("Purchase request ID is missing");
      return;
    }

    try {
      await cancelPurchaseRequestMutation.mutateAsync(purchaseRequestOrder.id);
      showSuccessToast("Purchase request cancelled successfully");
      setIsCancelPurchaseRequestModalOpen(false);

      // Refetch order data immediately to get updated status
      await refetchOrder();
    } catch (error) {
      console.error("Error cancelling purchase request:", error);
      showErrorToast(
        error?.response?.data?.message || "Failed to cancel purchase request"
      );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateString));
  };

  const formatPaymentProof = (paymentProof) => {
    if (!paymentProof || paymentProof === "Investor") {
      return paymentProof || "Investor";
    }

    // Check if it's a URL
    if (
      paymentProof.startsWith("http://") ||
      paymentProof.startsWith("https://")
    ) {
      try {
        const url = new URL(paymentProof);
        const pathname = url.pathname;
        const filename = pathname.split("/").pop() || "payment-proof.pdf";
        // Truncate filename if too long
        const displayName =
          filename.length > 10 ? filename.substring(0, 7) + "..." : filename;
        return { url: paymentProof, displayName };
      } catch (e) {
        return paymentProof;
      }
    }

    return paymentProof;
  };

  // Use API response data if available, otherwise use local state
  const purchaseData = purchaseRequestData || {
    tokens: tokens,
    totalAmount: parseFloat(investmentAmountInput) || tokens * pricePerToken,
    pricePerToken: pricePerToken,
    purchaseId: `PUR-2024-${String(Math.floor(Math.random() * 1000)).padStart(
      3,
      "0"
    )}`,
  };

  return (
    <div className="bg-white px-4 ">
      {/* Purchase Request Order Section - Show only if data exists */}
      {hasPurchaseRequestOrder && (
        <div className="mb-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[20px] font-[400] text-[#000] !font-['Atacama']">
              Investment Summary
            </h2>
            <button
              onClick={() => setIsInvestmentHistoryModalOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaArrowsRotate className="w-4 h-4 text-[#000]" />
            </button>
          </div>

          {/* Pending Purchase Section */}
          <div className="mb-4">
            <h3 className="text-[15px] font-[500] text-[#000] mb-3">
              {/* Pending Purchase */}
            </h3>

            <div className="space-y-3">
              {/* Purchase ID */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-[500] text-[#000]">
                  Purchase ID
                </span>
                <WalletAddress value={purchaseRequestOrder.id} />
              </div>

              {/* Tokens Requested */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-[500] text-[#000]">
                  Tokens Requested
                </span>
                <span className="text-[13px] font-normal text-[#000]">
                  {purchaseRequestOrder.token_requested}
                </span>
              </div>

              {/* Amount */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-[500] text-[#000]">
                  Amount
                </span>
                <span className="text-[13px] font-normal text-[#000]">
                  {purchaseRequestOrder.total_amount}
                </span>
              </div>

              {/* Verification Status */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-[500] text-[#000]">
                  Verification Status
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-[600] bg-[#FF707333] text-[#000]">
                  {purchaseRequestOrder.status || "-"}
                </span>
              </div>

              {/* Payment Proof */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-[500] text-[#000]">
                  Payment Proof
                </span>
                {(() => {
                  const formattedProof = formatPaymentProof(
                    purchaseRequestOrder.payment_proof
                  );
                  if (
                    typeof formattedProof === "object" &&
                    formattedProof.url
                  ) {
                    return (
                      <a
                        href={formattedProof.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#073BC3] hover:underline border border-[#E5E5EA] rounded-full px-2 py-1"
                      >
                        <FaFilePdf className="w-4 h-4 text-red-500" />
                        <span>{formattedProof.displayName} View</span>
                      </a>
                    );
                  }
                  return (
                    <span className="text-[13px] font-normal text-[#000]">
                      {formattedProof}
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Action Buttons */}
            {!isAwaitingVerification && !isApproved && !isRejected && (
              <>
                {/* Alert Box */}
                {purchaseRequestOrder.expiration_period && (
                  <div className="mt-4 p-2 bg-[#FAFAFC] border border-[#E5E5EA] rounded-full flex items-start gap-2">
                    <FaTriangleExclamation className="w-4 h-4 text-[#000] flex-shrink-0 mt-0.5" />
                    <p className="text-[13px] font-medium text-[#000]">
                      Upload payment proof by{" "}
                      <span className="font-bold text-[#000]">
                        {formatDate(purchaseRequestOrder.expiration_period)}
                      </span>
                      .
                    </p>
                  </div>
                )}
                <div className="mt-4 space-y-3">
                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full !rounded-full !text-[15px] font-[500]"
                    onClick={() => setIsUploadPaymentProofModalOpen(true)}
                  >
                    Upload Payment Proof
                  </Button>
                  <button
                    className="w-full text-center text-[13px] font-semibold text-[#000] hover:underline"
                    onClick={() => setIsCancelPurchaseRequestModalOpen(true)}
                  >
                    Cancel Purchase Request
                  </button>
                </div>
              </>
            )}
          </div>
          <h2 className="text-[20px] mt-10 font-[400] text-[#000] !font-['Atacama']">
            Investment Details
          </h2>

          <hr className="border-t border-[#D1D1D6] my-4 border-1"></hr>
        </div>
      )}

      {/* Initial Capital Target */}
      <div className="mb-4">
        <h2 className="text-[13px] font-[400] text-[#000] mb-2 ">
          Total Offering
        </h2>
        <p className="text-[32px] font-[500] text-[#000] ">
          {asset?.total_supply}
        </p>
        <hr className="border-t border-[#D1D1D6] my-2 border-1 "></hr>
      </div>

      {/* Investment Details */}
      <div className="mb-8 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[11px] font-[500] text-[#000] ">
            Price per Token
          </span>
          <span className="text-[15px] font-normal text-[#000] ">
            {asset?.initial_price}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[11px] font-[500] text-[#000] ">
            Expected Annual Return
          </span>
          <span className="text-[15px] font-normal text-[#000] ">
            {asset?.assetBusinessDetail?.minimum_annual_return}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[11px] font-[500] text-[#000] ">Term</span>
          <span className="text-[15px] font-normal text-[#000] ">
            {asset?.assetBusinessDetail?.expected_term}
          </span>
        </div>
      </div>

      {/* Investment Amount Section */}
      {!isAwaitingVerification && !isRejected && (
        <div>
      <div className="mb-8">
        <h2 className="text-[15px] font-[500] text-[#000] mb-2 ">
          Investment Amount
        </h2>
        <p className="text-[11px] font-normal text-[#48484A] mb-4 ">
          50 token increments with a 1,000 token minimum.
        </p>

        {/* Input Field with Plus/Minus Buttons */}
       
        <div className="relative mb-2">
          <div className="flex items-center gap-2 border border-[#E5E5EA] rounded-lg p-4 bg-white">
            <div className="flex-1">
              <input
                type="text"
                value={investmentAmountInput}
                onChange={handleInvestmentAmountChange}
                onBlur={() => {
                  // Sync input with calculated amount from tokens
                  const calculatedAmount = tokens * pricePerToken;
                  setInvestmentAmountInput(calculatedAmount.toString());
                }}
                className="text-[24px] font-[500] text-[#000] w-full bg-transparent border-none outline-none focus:outline-none"
                placeholder="0"
              />
              <div className="text-[11px] font-[500] text-[#000] mt-1 ">
                {tokens} tokens
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDecrement}
                disabled={tokens <= 0}
                className="w-7 h-7 rounded-full border border-[#7D0BF4] flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease"
              >
                <FaMinus className="w-3 h-3 text-[#000]" />
              </button>

              <button
                onClick={handleIncrement}
                className="w-7 h-7 rounded-full border border-[#7D0BF4]  flex items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="Increase"
              >
                <FaPlus className="w-3 h-3 text-[#000]" />
              </button>
            </div>
          </div>
        </div>
       

        {/* Quick Selection Buttons */}
        <div className="flex gap-3 mb-3">
          <button
            onClick={() => handleQuickSelect(1000)}
            className="px-7 py-2 rounded-full border border-[#E5E5EA] bg-white text-[13px] font-semibold text-[#000] hover:bg-gray-50 transition-colors "
          >
            1,000
          </button>
          <button
            onClick={() => handleQuickSelect(5000)}
            className="px-7 py-2 rounded-full border border-[#E5E5EA] bg-white text-[13px] font-semibold text-[#000] hover:bg-gray-50 transition-colors "
          >
            5,000
          </button>
          <button
            onClick={() => handleQuickSelect(10000)}
            className="px-7 py-2 rounded-full border border-[#E5E5EA] bg-white text-[13px] font-semibold text-[#000] hover:bg-gray-50 transition-colors "
          >
            10,000
          </button>
        </div>

        <p className="text-[11px] font-normal text-[#48484A] ">
          You won't be charged yet.
        </p>
      </div>
     
      <hr className="border-t border-[#D1D1D6] my-2 border-1 "></hr>
      {/* Target Close Date */}
      <div className="flex justify-between items-center mb-6 mt-4">
        <span className="text-[13px] font-normal text-[#48484A] ">
          Target Close Date:
        </span>
        <span className="text-[13px] font-normal text-[#48484A] ">
          {asset?.assetBusinessDetail?.target_close_date}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mb-6">
        <Button
          variant="gradient"
          size="lg"
          className="w-full !rounded-full !text-[15px] font-[500] "
          onClick={handleInvestNow}
          disabled={isAwaitingVerification || isAwaitingUpload}
        >
          Invest Now
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="w-full !rounded-full !text-[15px] font-[500]  !bg-white !border-[#1C1C1E]"
          icon={<img src={bookmarkIcon} alt="Bookmark" className="w-4 h-4" />}
          iconPosition="left"
          disabled={isAwaitingVerification}
        >
          Save
        </Button>
      </div>

      {/* View Count */}
      <div className="flex items-center gap-2 justify-center mb-6">
        <img src={eyeIcon} alt="Eye" className="w-4 h-4" />
        <span className="text-[13px] font-normal text-[#000] ">
          <span className="text-[13px] font-[600] text-[#48484A] ">5,342</span>{" "}
          people viewed.
        </span>
      </div>
      </div>
  )}
      <hr className="border-t border-[#D1D1D6] my-2 border-1 "></hr>

      {/* Offered by Section */}
      <div className="mb-4 mt-4">
        <h2 className="text-[13px] font-[400] text-[#000] mb-3 ">Offered by</h2>
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-[11px] font-[500] text-[#000] mb-2 ">
            Company Name
          </p>
          <p className="text-[13px] font-normal text-[#000] mb-2 ">
            TechCorp Inc.
          </p>
        </div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-[11px] font-[500] text-[#000] mb-2 ">
            Registration Status
          </p>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-[600] bg-[#83F63B33] ">
            Active
          </span>
        </div>
        <Button
          variant="secondary"
          size="lg"
          className="w-full !rounded-full !text-[15px] font-[500] !bg-white !border-[#1C1C1E] mt-4"
        >
          Contact Issuer
        </Button>
      </div>

      <hr className="border-t border-[#D1D1D6] my-2 border-1 "></hr>

      {/* On-Chain Verification Section */}
      <div className="my-6">
        <h2 className="text-[15px] font-[500] text-[#000] mb-3 ">
          On-Chain Verification
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#000] ">
              Contract Address
            </span>
            <div className="flex items-center gap-2 border border-[#E5E5EA] rounded-sm px-1 bg-white">
              <span className="text-[13px] font-medium text-[#000] ">
                0xTh47..Df4y
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("0xTh47..Df4y");
                }}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Copy Contract Address"
              >
                <FaCopy className="w-3 h-3 text-[#48484A]" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#000] ">
              Network
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium text-[#000] ">
                Canton
              </span>
              <img
                src={cantonIcon}
                alt="Canton"
                className="w-5 h-5 rounded-full"
              />
            </div>
          </div>
          <div className="mt-3">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-end gap-2 text-[13px] font-medium text-[#073BC3] hover:underline"
            >
              View on CantonScan
              <img
                src={linkIcon}
                alt="External link"
                className="w-4 h-4 !text-[#073BC3]"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ReviewInvestmentModal
        asset={asset}
        isOpen={isReviewModalOpen}
        onClose={handleCloseAllModals}
        onContinue={handleReviewContinue}
      />
      <PaymentInstructionsModal
        asset={asset}
        isOpen={isPaymentModalOpen}
        onClose={handleCloseAllModals}
        onBack={handlePaymentBack}
        onSubmit={handlePaymentSubmit}
        isSubmitting={createPurchaseRequestMutation.isPending}
      />
      <PurchaseRequestSubmittedModal
        asset={asset}
        isOpen={isSubmittedModalOpen}
        onClose={handleClosePurchaseRequestSubmittedModal}
        purchaseData={purchaseData}
      />
      <AccountVerificationRequiredModal
        asset={asset}
        isOpen={isKYCModalOpen}
        onClose={handleCloseAllModals}
      />
      <UploadPaymentProofModal
        isOpen={isUploadPaymentProofModalOpen}
        onClose={handleCloseAllModals}
        onSubmit={handleUploadPaymentProof}
        purchaseRequestOrder={purchaseRequestOrder}
        asset={asset}
        isSubmitting={uploadPaymentProofMutation.isPending}
      />
      <PaymentProofSubmittedModal
        isOpen={isPaymentProofSubmittedModalOpen}
        onClose={handleCloseAllModals}
        purchaseRequestOrder={purchaseRequestOrder}
        asset={asset}
        submittedData={paymentProofSubmittedData}
      />
      <CancelPurchaseRequestModal
        isOpen={isCancelPurchaseRequestModalOpen}
        onClose={handleCloseAllModals}
        onConfirm={handleCancelPurchaseRequest}
        purchaseRequestOrder={purchaseRequestOrder}
        asset={asset}
        isSubmitting={cancelPurchaseRequestMutation.isPending}
      />
      <InvestmentHistoryModal
        isOpen={isInvestmentHistoryModalOpen}
        onClose={() => setIsInvestmentHistoryModalOpen(false)}
        asset={asset}
      />
    </div>
  );
}

export default InvestorDashboardMarketPlace;
