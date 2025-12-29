import { useState, useEffect } from "react";
import Button from "@/components/shared/button";
import { useParams } from "react-router-dom";
import { useGetAssetDetails, useMintAssetTokenization } from "@/api";
import { TableLoader } from "@/components/shared";
import MintModal from "./MintModal";
import GenericLoader from "@/components/shared/GenericLoader";
import MintSuccessModal from "./MintSuccessModal";
import ApprovedTokenizationTimeline from "./ApprovedTokenizationTimeline";
import pdfIcon from "@/assets/admin-assets/pdf.svg";
import commericalIcon from "@/assets/admin-assets/commerical.svg";
import exclamationIcon from "@/assets/admin-assets/action.svg";
import cantonIcon from "@/assets/admin-assets/canton.svg";
import useToast from "@/hooks/useCustomToast";
import DenyModal from "../Assets-Pending/DenyModal";
import WalletAddress from "@/components/shared/WalletAddress";

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Format file size (approximate)
const formatFileSize = (url) => {
  // Since we don't have file size in API, return a placeholder
  return "—";
};

function AssetsApprovedDetailsPage() {
  const { id } = useParams();
  const assetId = id || null;

  // API hooks
  const {
    data: assetDetails,
    isLoading,
    isError,
  } = useGetAssetDetails(assetId);

  // Minting flow state - consolidated
  const [mintState, setMintState] = useState({
    isModalOpen: false,
    isLoaderOpen: false,
    isSuccessOpen: false,
    isMinting: false,
    mintSuccess: false,
  });

  const [isDenyModalOpen, setIsDenyModalOpen] = useState(false);

  // Toast hooks
  const { showBottomRightToast: showSuccessToast, showErrorToast } = useToast();
  const { mutate: mintAsset } = useMintAssetTokenization();

  // Reset minting state when assetId changes
  useEffect(() => {
    setMintState({
      isModalOpen: false,
      isLoaderOpen: false,
      isSuccessOpen: false,
      isMinting: false,
      mintSuccess: false,
    });
  }, [assetId]);

  // Show loader while fetching asset details
  if (isLoading) {
    return (
      <div className="bg-white border rounded-tr-[24px] min-h-screen flex items-center justify-center">
        <TableLoader message="Loading asset details..." />
      </div>
    );
  }

  // Show error state
  if (isError || !assetDetails) {
    return (
      <div className="bg-white border rounded-tr-[24px] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">
            {id
              ? `Asset with ID: ${id} not found`
              : "Error loading asset details"}
          </p>
        </div>
      </div>
    );
  }

  // Extract data from API response
  const asset = assetDetails || {};
  const businessDetail = asset.assetBusinessDetail || {};
  const assetType = asset.assetType || {};
  const assetFiles = asset.assetFiles || [];
  const initialOwners = asset.assetInitialOwners || [];

  // Generate asset ID from UUID (first 8 characters)
  const generatedAssetId = asset.id?.substring(0, 8).toUpperCase() || "—";
  const requestId = `REQ-${generatedAssetId}`;

  // Calculate total offering (total supply * initial price)
  const totalOffering =
    asset.initial_price && asset.total_supply
      ? asset.initial_price * asset.total_supply
      : 0;

  // Format property address from city and country
  const propertyAddress =
    businessDetail.city && businessDetail.country
      ? `${businessDetail.city}, ${businessDetail.country}`
      : businessDetail.city || businessDetail.country || "—";

  // Format expected returns
  const expectedReturns = businessDetail.expected_yield
    ? `${businessDetail.expected_yield}%`
    : businessDetail.expected_term || "—";

  // Map asset files to documents format
  const documents = assetFiles.map((file) => ({
    name: file.file_name || "Document",
    url: file.url,
    size: formatFileSize(file.url),
  }));

  // Extended asset data mapped from API response
  const extendedAsset = {
    id: asset.id,
    name: asset.name || "—",
    assetId: generatedAssetId,
    category: businessDetail.industry || assetType.title || "—",
    requestId: requestId,
    issuer:
      asset.user?.first_name && asset.user?.last_name
        ? `${asset.user.first_name} ${asset.user.last_name}`
        : asset.user?.email?.split("@")[0] || "Issuer",
    issuerEmail: asset.user?.email || "—",
    date: formatDate(asset.created_at || asset.updated_at),
    totalOffering: totalOffering,
    sharePrice: asset.initial_price,
    totalShares: asset.total_supply,
    minInvestment: businessDetail.minimum_investment,
    propertyAddress: propertyAddress,
    targetCloseDate: businessDetail.target_close_date
      ? formatDate(businessDetail.target_close_date)
      : "—",
    expectedReturns: expectedReturns,
    description: asset.description || "—",
    documents: documents,
    contactPhone: "—", // Not available in API
    registrationStatus: "Active", // Not available in API, using default
    tokenPrice: asset.initial_price?.toString() || "0",
    assetTypeImage: assetType.image || commericalIcon,
  };

  // Handlers
  const handleOpenMintModal = () => {
    setMintState((prev) => ({ ...prev, isModalOpen: true }));
  };

  const handleCloseMintModal = () => {
    setMintState((prev) => ({ ...prev, isModalOpen: false }));
  };

  const handleMint = () => {
    if (!extendedAsset.id) {
      showErrorToast("Asset ID is missing");
      return;
    }

    setMintState((prev) => ({
      ...prev,
      isModalOpen: false,
      isLoaderOpen: true,
      isMinting: true,
      mintSuccess: false,
    }));

    mintAsset(extendedAsset.id, {
      onSuccess: () => {
        setMintState((prev) => ({
          ...prev,
          isMinting: false,
          mintSuccess: true,
        }));
        // showSuccessToast("Tokens minted successfully on blockchain");
      },
      onError: (error) => {
        setMintState((prev) => ({
          ...prev,
          isMinting: false,
          isLoaderOpen: false,
          mintSuccess: false,
          isModalOpen: true, // Reopen modal on error
        }));
        showErrorToast(
          error?.response?.data?.message || "Failed to mint tokens on blockchain"
        );
      },
    });
  };

  const handleLoaderComplete = () => {
    if (mintState.mintSuccess) {
      setMintState((prev) => ({
        ...prev,
        isLoaderOpen: false,
        isSuccessOpen: true,
      }));
    }
  };

  const handleMintSuccessClose = () => {
    setMintState({
      isModalOpen: false,
      isLoaderOpen: false,
      isSuccessOpen: false,
      isMinting: false,
      mintSuccess: false,
    });
    // Refresh the page to show updated asset status
    window.location.reload();
  };

  const handleDeny = () => {
    setIsDenyModalOpen(true);
  };


  return (
    <div className="bg-white border rounded-tr-[24px] min-h-screen">
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Asset Details */}

          <div className="lg:col-span-2 space-y-6">
            {/* Asset Details Top Section */}
            <div className="text-start pl-5 !pb-0 !py-0 text-[32px] font-normal font-['Atacama'] leading-[120%] tracking-[0.48px] text-[#000] rounded-tr-[24px]">
              {extendedAsset.name}
            </div>
            <span className="text-start !text-[#48484A] font-normal text-[13px] !text-sm !py-0 pl-5">
              {extendedAsset.assetId}
            </span>
            <div className=" rounded-lg  p-6">
              <h3 className="text-[13px] font-semibold text-[#000] mb-4 !font-['Montserrat']">
                Asset Details
              </h3>
              <hr className="border-t border-[#000] my-4 border-1"></hr>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-[11px] !font-[600] text-[#000] mb-1">
                    Total Offering
                  </p>
                  <p className="text-[17px] font-normal text-[#000]">
                    {extendedAsset.totalOffering}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] !font-[600] text-[#000] mb-1">
                    Share Price
                  </p>
                  <p className="text-[17px] font-normal text-[#000]">
                    {extendedAsset.sharePrice}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] !font-[600] text-[#000] mb-1">
                    Total Shares
                  </p>
                  <p className="text-[17px] font-normal text-[#000]">
                    {extendedAsset.totalShares}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] !font-[600] text-[#000] mb-1">
                    Min. Investment
                  </p>
                  <p className="text-[17px] font-normal text-[#000]">
                    {extendedAsset.minInvestment}
                  </p>
                </div>
              </div>

              {/* Asset Type and Details */}
              <div className="space-y-0">
                <h3 className="text-[13px] font-semibold text-[#000] mb-4 !font-['Montserrat']">
                  Basic Information
                </h3>
                <hr className="border-t border-[#000] my-4 border-1"></hr>
                <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                  <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                    Asset Type
                  </p>
                  <div className="flex items-center gap-2 w-[75%]">
                    <p className="text-[15px] font-medium text-[#000] ">
                      {extendedAsset.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                  <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                    Property Address:
                  </p>
                  <p className="text-[15px] font-medium text-[#000] w-[75%]">
                    {extendedAsset.propertyAddress}
                  </p>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                  <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                    Target Close Date:
                  </p>
                  <p className="text-[15px] font-medium text-[#000] w-[75%]">
                    {extendedAsset.targetCloseDate}
                  </p>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                  <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                    Expected Returns:
                  </p>
                  <p className="text-[15px] font-medium text-[#000] w-[75%]">
                    {extendedAsset.expectedReturns}
                  </p>
                </div>
                <div className="flex items-start justify-between py-3">
                  <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                    Description:
                  </p>
                  <p className="text-[15px] font-medium text-[#000] leading-relaxed w-[75%]">
                    {extendedAsset.description}
                  </p>
                </div>
              </div>

              {/* Business Details Section */}
              <div className="space-y-0 mt-6">
                <h3 className="text-[13px] font-semibold text-[#000] mb-4 !font-['Montserrat']">
                  Business Details
                </h3>
                <hr className="border-t border-[#000] my-4 border-1"></hr>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[40%]">
                      Industry / Sector:
                    </p>
                    <p className="text-[15px] font-medium text-[#000] w-[60%] text-right">
                      {businessDetail.industry || assetType.title || "—"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[40%]">
                      Property Address:
                    </p>
                    <p className="text-[15px] font-medium text-[#000] w-[60%] text-right">
                      {propertyAddress}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[40%]">
                      Country:
                    </p>
                    <p className="text-[15px] font-medium text-[#000] w-[60%] text-right">
                      {businessDetail.country || "—"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[40%]">
                      City:
                    </p>
                    <p className="text-[15px] font-medium text-[#000] w-[60%] text-right">
                      {businessDetail.city || "—"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[40%]">
                      Year Established:
                    </p>
                    <p className="text-[15px] font-medium text-[#000] w-[60%] text-right">
                      {businessDetail.year_established || "—"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[40%]">
                      Number of Employees:
                    </p>
                    <p className="text-[15px] font-medium text-[#000] w-[60%] text-right">
                      {businessDetail.number_of_employees
                        ? businessDetail.number_of_employees
                        : "—"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[40%]">
                      Operational Status:
                    </p>
                    <p className="text-[15px] font-medium text-[#000] w-[60%] text-right">
                      {businessDetail.operational_status || "—"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[40%]">
                      Ownership Stake Offered:
                    </p>
                    <p className="text-[15px] font-normal text-[#000] w-[60%] text-right">
                      {businessDetail.ownership_stake}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <p className="text-[13px] !font-[400] text-[#000] w-[40%]">
                      Business Valuation:
                    </p>
                    <p className="text-[15px] font-normal text-[#000] w-[60%] text-right">
                      {businessDetail.business_valuation
                        ? businessDetail.business_valuation
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Financial Information Section */}
              <div className="space-y-0 mt-6">
                <h3 className="text-[13px] font-semibold text-[#000] mb-4 !font-['Montserrat']">
                  Financial Information
                </h3>
                <hr className="border-t border-[#000] my-4 border-1"></hr>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[40%]">
                      Annual Revenue:
                    </p>
                    <p className="text-[15px] font-medium text-[#000] w-[60%] text-right">
                      {businessDetail.annual_revenue
                        ? businessDetail.annual_revenue
                        : "—"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[40%]">
                      Revenue CAGR:
                    </p>
                    <p className="text-[15px] font-medium text-[#000] w-[60%] text-right">
                      {businessDetail.revenue_cagr
                        ? `${businessDetail.revenue_cagr}%`
                        : "—"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[40%]">
                      EBITDA:
                    </p>
                    <p className="text-[15px] font-medium text-[#000] w-[60%] text-right">
                      {businessDetail.ebitda ? businessDetail.ebitda : "—"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[40%]">
                      Broadcasting Revenue:
                    </p>
                    <p className="text-[15px] font-medium text-[#000] w-[60%] text-right">
                      {businessDetail.broadcasting_revenue
                        ? businessDetail.broadcasting_revenue
                        : "—"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[40%]">
                      Matchday Revenue:
                    </p>
                    <p className="text-[15px] font-medium text-[#000] w-[60%] text-right">
                      {businessDetail.matchday_revenue
                        ? businessDetail.matchday_revenue
                        : "—"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[40%]">
                      Operating Expenses:
                    </p>
                    <p className="text-[15px] font-medium text-[#000] w-[60%] text-right">
                      {businessDetail.operating_expenses
                        ? businessDetail.operating_expenses
                        : "—"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[40%]">
                      Commercial Revenue:
                    </p>
                    <p className="text-[15px] font-medium text-[#000] w-[60%] text-right">
                      {businessDetail.commercial_revenue
                        ? businessDetail.commercial_revenue
                        : "—"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <p className="text-[13px] !font-[400] text-[#000] w-[40%]">
                      Player Acquisitions:
                    </p>
                    <p className="text-[15px] font-medium text-[#000] w-[60%] text-right">
                      {businessDetail.player_acquisitions
                        ? businessDetail.player_acquisitions
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tokenization Details Section */}
              <div className="space-y-0 mt-6">
                <h3 className="text-[13px] font-semibold text-[#000] mb-4 !font-['Montserrat']">
                  Tokenization Details
                </h3>
                <hr className="border-t border-[#000] my-4 border-1"></hr>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[40%]">
                      Initial Capital Target:
                    </p>
                    <p className="text-[15px] font-medium text-[#000] w-[60%] text-right">
                      {totalOffering}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[40%]">
                      Total Supply:
                    </p>
                    <p className="text-[15px] font-medium text-[#000] w-[60%] text-right">
                      {asset.total_supply} tokens
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[40%]">
                      Initial Mint:
                    </p>
                    <p className="text-[15px] font-medium text-[#000] w-[60%] text-right">
                      {asset.initial_mint} tokens
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[40%]">
                      Unminted:
                    </p>
                    <p className="text-[15px] font-medium text-[#000] w-[60%] text-right">
                      {asset.total_supply && asset.initial_mint
                        ? `${asset.total_supply - asset.initial_mint} tokens`
                        : "—"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[40%]">
                      Minimum Investment:
                    </p>
                    <p className="text-[15px] font-medium text-[#000] w-[60%] text-right">
                      {businessDetail.minimum_investment}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[40%]">
                      Expected Term:
                    </p>
                    <p className="text-[15px] font-medium text-[#000] w-[60%] text-right">
                      {businessDetail.expected_term || "—"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[40%]">
                      Price per Token:
                    </p>
                    <p className="text-[15px] font-medium text-[#000] w-[60%] text-right">
                      {asset.initial_price}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[40%]">
                      Expected Yield:
                    </p>
                    <p className="text-[15px] font-medium text-[#000] w-[60%] text-right">
                      {businessDetail.expected_yield
                        ? `${businessDetail.expected_yield}%`
                        : "—"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[40%]">
                      Minimum Annual Return:
                    </p>
                    <p className="text-[15px] font-medium text-[#000] w-[60%] text-right">
                      {businessDetail.minimum_annual_return
                        ? `${businessDetail.minimum_annual_return}%`
                        : "—"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[40%]">
                      Target Close Date:
                    </p>
                    <p className="text-[15px] font-medium text-[#000] w-[60%] text-right">
                      {businessDetail.target_close_date
                        ? formatDate(businessDetail.target_close_date)
                        : "—"}
                    </p>
                  </div>
                  {initialOwners.length > 0 && (
                    <div className="py-3">
                      <p className="text-[13px] !font-[400] text-[#000] mb-3">
                        Initial Owners:
                      </p>
                      <div className="space-y-2">
                        {initialOwners.map((owner, index) => (
                          <div
                            key={owner.id || index}
                            className="flex items-center justify-between py-2 pl-4 border-l-2 border-[#E5E5EA]"
                          >
                            <div className="flex-1">
                              <p className="text-[15px] font-medium text-[#000]">
                                <strong>{owner.name || "—"}</strong>
                              </p>
                              <p className="text-[13px] text-[#48484A]">
                                {owner.token_allocation} Tokens
                              </p>
                            </div>
                            <p className="text-[13px] text-[#48484A] text-right">
                              {owner.email || "—"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Supporting Documents */}
            <div className=" rounded-lg  p-6">
              <h3 className="text-[13px] font-semibold text-[#000] mb-4 !font-['Montserrat']">
                Supporting Documents
              </h3>
              <hr className="border-t border-[#000] my-4 border-1"></hr>

              <div className="space-y-3">
                {extendedAsset.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-[#E5E5EA] !bg-[#FAFAFC] rounded-[15px] hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <img
                        src={pdfIcon}
                        alt="PDF Icon"
                        className="w-10 h-10 border border-[#E5E5EA] rounded-full p-2 !bg-white"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#000]">
                          {doc.name}
                        </p>
                        <p className="text-xs text-[#000]">{doc.size}</p>
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        if (doc.url) {
                          window.open(doc.url, "_blank");
                        }
                      }}
                      className="flex items-center gap-2"
                    >
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Action Required, Submission, Blockchain, Timeline */}
          <div className="">
            {/* Action Required */}
            <div className=" rounded-lg  p-6">
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
                Review all asset details and supporting documentation, then
                approve or deny this request.
              </p>
              <div className="flex flex-col gap-3 mt-4">
                <Button
                  variant="gradient"
                  onClick={handleOpenMintModal}
                  className="w-full h-[40px]"
                >
                  Mint Tokens
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleDeny}
                  className="w-full h-[40px]"
                >
                  Revoke Approval
                </Button>
              </div>
              <hr className="border-t border-[#E5E5EA] px-8 border-1 !mt-6"></hr>
            </div>
            {/* Submission Information */}
            <div className=" rounded-lg  !px-6">
              <h3 className="text-[15px] font-medium text-[#000] mb-4 !font-['Montserrat']">
                Submission Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-[#000]">
                    Company Name
                  </p>
                  <p className="text-[13px] font-medium text-[#000]">
                    {extendedAsset.issuer}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-[#000]">Email</p>
                  <a
                    href={`mailto:${extendedAsset.issuerEmail}`}
                    className="text-[13px] font-medium text-[#0734A9] hover:underline"
                  >
                    {extendedAsset.issuerEmail}
                  </a>
                </div>
                {/* <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-[#000]">
                    Contact Phone
                  </p>
                  <p className="text-[13px] font-medium text-[#000]">
                    {extendedAsset.contactPhone}
                  </p>
                </div> */}
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-[#000]">
                    Registration Status
                  </p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 ">
                    {extendedAsset.registrationStatus}
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
                Blockchain details will be available after minting.
              </p>
              <div className="space-y-3">
                {/* <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-[#000]">
                    Transaction Hash
                  </p>
                  <p className="text-[13px] font-medium text-[#000]">TBD</p>
                </div> */}
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-[#000]">Tokens</p>
                  <p className="text-[13px] font-medium text-[#000]">{asset.initial_mint ?? "0"} Tokens</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-[#000]">
                    Timestamp
                  </p>
                  <p className="text-[13px] font-medium text-[#000]">TBD</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-[#000]">
                    Contract Address
                  </p>
                  <WalletAddress
                    value={asset.asset_contract_id}
                  />
                </div>
                {/* <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-[#000]">
                    Block Number
                  </p>
                  <p className="text-[13px] font-medium text-[#000]">TBD</p>
                </div> */}
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-[#000]">Network</p>
                  <div className="flex items-center gap-1">
                    <p className="text-[13px] font-medium text-[#000]">
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
      </div>

      {/* Mint Modal */}
      <MintModal
        isOpen={mintState.isModalOpen && !mintState.isLoaderOpen && !mintState.isSuccessOpen}
        onClose={handleMintSuccessClose}
        onMint={handleMint}
        onCancel={handleCloseMintModal}
        asset={extendedAsset}
      />

      {/* Generic Loader - Only show when minting is in progress */}
      {mintState.isLoaderOpen && (
        <GenericLoader
          isOpen={mintState.isLoaderOpen}
          onClose={handleMintSuccessClose}
          onComplete={handleLoaderComplete}
        />
      )}

      {/* Mint Success Modal */}
      <MintSuccessModal
        isOpen={mintState.isSuccessOpen}
        onClose={handleMintSuccessClose}
        asset={extendedAsset}
      />

      {/* Deny Modal */}
      <DenyModal
        isOpen={isDenyModalOpen}
        onClose={() => setIsDenyModalOpen(false)}
      />
    </div>
  );
}

export default AssetsApprovedDetailsPage;
