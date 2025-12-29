import cantonIcon from "@/assets/admin-assets/canton.svg";
import commericalIcon from "@/assets/admin-assets/commerical.svg";
import pdfIcon from "@/assets/admin-assets/pdf.svg";
import Button from "@/components/shared/button";
import { FaCopy } from "react-icons/fa6";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
import { useParams } from "react-router-dom";
import MintedTokenizationTimeline from "./MintedTokenizationTimeline";
import { useGetAssetDetails } from "@/api";
import { TableLoader } from "@/components/shared";

// Format number with commas

// Format currency

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

// Format date with time
const formatDateTime = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// Format file size (approximate)
const formatFileSize = (url) => {
  // Since we don't have file size in API, return a placeholder
  return "—";
};

function AssetsMintedDetailsPage() {
  const { id } = useParams();
  const assetId = id || null;
  const {
    data: assetDetails,
    isLoading,
    isError,
  } = useGetAssetDetails(assetId);

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
      : "$0";

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
    approvalDate: formatDate(asset.updated_at),
    mintDate: formatDate(asset.updated_at),
    totalOffering: totalOffering,
    sharePrice: asset.initial_price,
    pricePerToken: asset.initial_price,
    totalShares: asset.total_supply,
    minInvestment: businessDetail.minimum_investment,
    propertyAddress: propertyAddress,
    targetCloseDate: businessDetail.target_close_date
      ? formatDate(businessDetail.target_close_date)
      : "—",
    expectedReturns: expectedReturns,
    expectedYield: businessDetail.expected_yield
      ? `${businessDetail.expected_yield}%`
      : "—",
    minimumAnnualReturn: businessDetail.minimum_annual_return
      ? `${businessDetail.minimum_annual_return}%`
      : "—",
    expectedTerm: businessDetail.expected_term || "—",
    description: asset.description || "—",
    documents: documents,
    contactPhone: "—", // Not available in API
    registrationStatus: "Active", // Not available in API, using default
    requestStatus: asset.status || "Ready to Publish",
    assetTypeImage: assetType.image || commericalIcon,
    // Blockchain transaction data (placeholder if not in API)
    transactionHash: asset.transaction_hash || "0x7d4S..34D7",
    contractAddress: asset.contract_address || "0xTh47..Df4y",
    blockNumber: asset.block_number || "#15,234,567",
    tokensMinted: asset.initial_mint || asset.total_supply,
    timestamp: asset.mint_timestamp
      ? formatDateTime(asset.mint_timestamp)
      : formatDateTime(asset.updated_at),
  };

  return (
    <div className="bg-white border rounded-tr-[24px] min-h-screen">
      <div className="">
        {extendedAsset ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Asset Details */}

            <div className="lg:col-span-2 space-y-6">
              {/* Asset Details Top Section */}
              <div className="text-start pl-5 !pb-0 !py-0 text-[32px] font-normal font-['Atacama'] leading-[120%] tracking-[0.48px] text-[#000] rounded-tr-[24px] !pt-[40px]">
                {extendedAsset.name}
              </div>
              <span className="text-start !text-[#48484A] font-normal !text-sm !py-0 pl-5">
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
                      {extendedAsset.totalOffering.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] !font-[600] text-[#000] mb-1">
                      Share Price
                    </p>
                    <p className="text-[17px] font-normal text-[#000]">
                      {extendedAsset.sharePrice.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] !font-[600] text-[#000] mb-1">
                      Total Shares
                    </p>
                    <p className="text-[17px] font-normal text-[#000]">
                      {extendedAsset.totalShares.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] !font-[600] text-[#000] mb-1">
                      Min. Investment
                    </p>
                    <p className="text-[17px] font-normal text-[#000]">
                      {extendedAsset.minInvestment.toLocaleString()}
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

                    <p className="text-[15px] font-medium text-[#000] w-[75%]">
                      {extendedAsset.category}
                    </p>
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
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                      Minimum Investment:
                    </p>
                    <p className="text-[15px] font-medium text-[#000] w-[75%]">
                      {extendedAsset.minInvestment}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                      Price per Token:
                    </p>
                    <p className="text-[15px] font-medium text-[#000] w-[75%]">
                      {extendedAsset.pricePerToken.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                      Expected Yield:
                    </p>
                    <p className="text-[15px] font-medium text-[#000] w-[75%]">
                      {extendedAsset.expectedYield}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                      Minimum Annual Return:
                    </p>
                    <p className="text-[15px] font-medium text-[#000] w-[75%]">
                      {extendedAsset.minimumAnnualReturn}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                      Expected Term:
                    </p>
                    <p className="text-[15px] font-medium text-[#000] w-[75%]">
                      {extendedAsset.expectedTerm}
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
                      <p className="text-[13px] !font-[400] text-[#000] !w-[25%]">
                        Industry / Sector:
                      </p>
                      <p className="text-[15px] font-medium text-[#000] !w-[75%] ">
                        {businessDetail.industry || assetType.title || "—"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                      <p className="text-[13px] !font-[400] text-[#000] !w-[25%]">
                        Property Address:
                      </p>
                      <p className="text-[15px] font-medium text-[#000] w-[75%] ">
                        {propertyAddress}
                      </p>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                      <p className="text-[13px] !font-[400] text-[#000] !w-[25%]">
                        Country:
                      </p>
                      <p className="text-[15px] font-medium text-[#000] w-[75%] ">
                        {businessDetail.country || "—"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                      <p className="text-[13px] !font-[400] text-[#000] !w-[25%]">
                        City:
                      </p>
                      <p className="text-[15px] font-medium text-[#000] w-[75%] ">
                        {businessDetail.city || "—"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                      <p className="text-[13px] !font-[400] text-[#000] !w-[25%]">
                        Year Established:
                      </p>
                      <p className="text-[15px] font-medium text-[#000] w-[75%] ">
                        {businessDetail.year_established || "—"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                      <p className="text-[13px] !font-[400] text-[#000] !w-[25%]">
                        Number of Employees:
                      </p>
                      <p className="text-[15px] font-medium text-[#000] w-[75%] ">
                        {businessDetail.number_of_employees ?? "—"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                      <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                        Operational Status:
                      </p>
                      <p className="text-[15px] font-medium text-[#000] w-[75%] ">
                        {businessDetail.operational_status || "—"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                      <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                        Ownership Stake Offered:
                      </p>
                      <p className="text-[15px] font-medium text-[#000] w-[75%] ">
                        {businessDetail.ownership_stake
                          ? businessDetail.ownership_stake.toLocaleString()
                          : "—"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                        Business Valuation:
                      </p>
                      <p className="text-[15px] font-medium text-[#000] w-[75%] ">
                        {businessDetail.business_valuation ?? "—"}
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
                      <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                        Annual Revenue:
                      </p>
                      <p className="text-[15px] font-medium text-[#000] w-[75%] ">
                        {businessDetail.annual_revenue ?? "—"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                      <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                        Revenue CAGR:
                      </p>
                      <p className="text-[15px] font-medium text-[#000] w-[75%] ">
                        {businessDetail.revenue_cagr
                          ? `${businessDetail.revenue_cagr}%`
                          : "—"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                      <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                        EBITDA:
                      </p>
                      <p className="text-[15px] font-medium text-[#000] w-[75%] ">
                        {businessDetail.ebitda ?? "—"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                      <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                        Broadcasting Revenue:
                      </p>
                      <p className="text-[15px] font-medium text-[#000] w-[75%] ">
                        {businessDetail.broadcasting_revenue ?? "—"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                      <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                        Matchday Revenue:
                      </p>
                      <p className="text-[15px] font-medium text-[#000] w-[75%] ">
                        {businessDetail.matchday_revenue ?? "—"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                      <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                        Operating Expenses:
                      </p>
                      <p className="text-[15px] font-medium text-[#000] w-[75%] ">
                        {businessDetail.operating_expenses ?? "—"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                      <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                        Commercial Revenue:
                      </p>
                      <p className="text-[15px] font-medium text-[#000] w-[75%] ">
                        {businessDetail.commercial_revenue ?? "—"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                        Player Acquisitions:
                      </p>
                      <p className="text-[15px] font-medium text-[#000] w-[75%] ">
                        {businessDetail.player_acquisitions ?? "—"}
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
                      <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                        Initial Capital Target:
                      </p>
                      <p className="text-[15px] font-medium text-[#000] w-[75%] ">
                        {totalOffering}
                      </p>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                      <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                        Total Supply:
                      </p>
                      <p className="text-[15px] font-medium text-[#000] w-[75%] ">
                        {asset.total_supply.toLocaleString()} tokens
                      </p>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                      <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                        Initial Mint:
                      </p>
                      <p className="text-[15px] font-medium text-[#000] w-[75%] ">
                        {asset.initial_mint.toLocaleString()} tokens
                      </p>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                      <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                        Unminted:
                      </p>
                      <p className="text-[15px] font-medium text-[#000] w-[75%] ">
                        {asset.total_supply && asset.initial_mint
                          ? `${asset.total_supply - asset.initial_mint} tokens`
                          : "—"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                      <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                        Minimum Investment:
                      </p>
                      <p className="text-[15px] font-medium text-[#000] w-[75%] ">
                        {businessDetail.minimum_investment.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                      <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                        Expected Term:
                      </p>
                      <p className="text-[15px] font-medium text-[#000] w-[75%] ">
                        {businessDetail.expected_term || "—"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                      <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                        Price per Token:
                      </p>
                      <p className="text-[15px] font-medium text-[#000] w-[75%] ">
                        {asset.initial_price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                      <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                        Expected Yield:
                      </p>
                      <p className="text-[15px] font-medium text-[#000] w-[75%] ">
                        {businessDetail.expected_yield
                          ? `${businessDetail.expected_yield.toLocaleString()}%`
                          : "—"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                      <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                        Minimum Annual Return:
                      </p>
                      <p className="text-[15px] font-medium text-[#000] w-[75%] ">
                        {businessDetail.minimum_annual_return
                          ? `${businessDetail.minimum_annual_return}`
                          : "—"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                      <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                        Target Close Date:
                      </p>
                      <p className="text-[15px] font-medium text-[#000] w-[75%] ">
                        {businessDetail.target_close_date ?? "—"}
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
                                <p className="text-[15px] font-normal text-[#000]">
                                  <strong>{owner.name || "—"}</strong>
                                </p>
                                <p className="text-[13px] text-[#48484A]">
                                  {owner.token_allocation.toLocaleString()}{" "}
                                  Tokens
                                </p>
                              </div>
                              <p className="text-[13px] text-[#48484A] ">
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
            <div className="border-l-[0.75px] border-l-[#E5E5EA] pt-[24px] ">
              {/* Action Required */}

              {/* Issuer Submission */}
              <div className=" rounded-lg  !px-6 ">
                <h3 className="text-[15px] font-medium text-[#000] mb-4 !font-['Montserrat']">
                  Issuer Submission
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
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-medium text-[#000]">
                        Minted Date
                      </p>
                      <p className="text-[13px] font-medium text-[#000]">
                        {extendedAsset.mintDate}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-[11px] font-medium text-[#000]">
                    Request Status
                  </p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 ">
                    {extendedAsset.requestStatus}
                  </span>
                </div>
                <div className="text-center justify-center items-center  mt-4 px-8">
                  <p className="text-[11px] font-medium text-[#000]">
                    Asset approved and tokens minted. Issuer can now publish to
                    the marketplace.
                  </p>
                </div>
                <hr className="border-t border-[#E5E5EA] px-8 border-1 !mt-6"></hr>
              </div>

              {/* Blockchain Transaction */}
              <div className=" rounded-lg  !px-6 pt-6">
                <h3 className="text-[15px] font-medium text-[#000]  !font-['Montserrat']">
                  Blockchain Transaction
                </h3>
                <div className="space-y-3 mt-6">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-[#000]">
                      Transaction Hash
                    </p>
                    <div className="flex items-center gap-2 border border-[#E5E5EA] rounded-md p-1 bg-[#FAFAFC]">
                      <p className="text-[13px] font-medium text-[#000]">
                        {extendedAsset.transactionHash}
                      </p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            extendedAsset.transactionHash
                          );
                        }}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <FaCopy className="w-3 h-3 text-[#000]" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-[#000]">
                      Tokens
                    </p>
                    <p className="text-[13px] font-medium text-[#000]">
                      {extendedAsset.tokensMinted}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-[#000]">
                      Timestamp
                    </p>
                    <p className="text-[13px] font-medium text-[#000]">
                      {extendedAsset.timestamp}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-[#000]">
                      Contract Address
                    </p>
                    <div className="flex items-center gap-2 border border-[#E5E5EA] rounded-md p-1 bg-[#FAFAFC]">
                      <p className="text-[13px] font-medium text-[#000]">
                        {extendedAsset.contractAddress}
                      </p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            extendedAsset.contractAddress
                          );
                        }}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <FaCopy className="w-3 h-3 text-[#000]" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-[#000]">
                      Block Number
                    </p>
                    <p className="text-[13px] font-medium text-[#000]">
                      {extendedAsset.blockNumber}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-[#000]">
                      Network
                    </p>
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
                <div className="mt-4 !text-end !justify-end !items-end">
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[#0734A9] hover:underline text-[13px] font-medium justify-end items-end"
                  >
                    View on CantonScan
                    <HiArrowTopRightOnSquare className="w-4 h-4" />
                  </a>
                </div>
                <hr className="border-t border-[#E5E5EA] px-8 border-1 !mt-6"></hr>
              </div>

              {/* Tokenization Timeline */}
              <div className="!px-6 pt-6">
                <MintedTokenizationTimeline currentStep={3} />
              </div>
            </div>
          </div>
        ) : (
          <div className=" rounded-lg border border-[#E5E5EA] p-6">
            <p className="text-gray-500 text-center">
              {id
                ? `Tokenization request with ID: ${id} not found`
                : "Pending review content will be implemented here"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AssetsMintedDetailsPage;
