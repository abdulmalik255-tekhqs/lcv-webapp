import { useParams } from "react-router-dom";
import cantonIcon from "@/assets/admin-assets/canton.svg";
import privateIcon from "@/assets/issuer-assets/private.svg";
import Button from "@/components/shared/button";
import { TableLoader } from "@/components/shared";
import { FaCheck, FaCopy } from "react-icons/fa6";
import IssuerPublishTokenizationTimeline from "./IssuerPublishTokenizationTimeline";
import { useGetAssetDetails } from "@/api";
import WalletAddress from "@/components/shared/WalletAddress";

function IssuerAssetsPublishDetailsPage() {
  const { id } = useParams();
  const assetId = id || null;

  const { data: assetDetails, isLoading: isLoadingAsset } =
    useGetAssetDetails(assetId);

  // Show loader while fetching asset details
  if (isLoadingAsset) {
    return (
      <div className="bg-white border rounded-tr-[24px] min-h-screen flex items-center justify-center">
        <TableLoader message="Loading asset details..." />
      </div>
    );
  }

  // Extract data from API response
  const asset = assetDetails || {};
  const businessDetail = asset.assetBusinessDetail || {};
  const assetType = asset.assetType || {};
  const initialOwners = asset.assetInitialOwners || [];
  const assetFiles = asset.assetFiles || [];
  const assetUser = asset.user || {};
  const assetSponsers = asset.assetSponser || [];



  // Calculate issuer treasury (total supply - sum of initial owners allocations)
  const totalInitialOwnerAllocations = initialOwners.reduce(
    (sum, owner) => sum + (Number(owner.token_allocation) || 0),
    0
  );
  const issuerTreasury =
    Number(asset.total_supply || 0) - totalInitialOwnerAllocations;

  // Calculate capital target (total supply * initial price)
  const capitalTarget =
    Number(asset.total_supply || 0) * Number(asset.initial_price || 0);

  return (
    <div className="bg-white border rounded-tr-[24px] min-h-screen">
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Asset Details */}

          <div className="lg:col-span-2 space-y-6">
            {/* Asset Details Top Section */}
            <div className="text-start pl-5 !pb-0 !py-0 text-[32px] font-normal font-['Atacama'] leading-[120%] tracking-[0.48px] text-[#000] rounded-tr-[24px]">
              {asset.name || "Not Provided"}
            </div>
            <span className="text-start !text-[#48484A] font-normal !text-sm !py-0 pl-5">
              {assetType.title || "Not Provided"}
            </span>
            {/* Basic Information Section */}
            <div className=" p-4">
              <h4 className="text-sm font-semibold text-[#000] mb-5 pb-2 border-b border-[#000]">
                Basic Information
              </h4>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                    <span className="text-[11px] font-semibold text-[#000] mb-1">
                      Asset Name:
                    </span>
                    <span className="text-[17px] font-normal text-[#000]">
                      {asset.name || "Not Provided"}
                    </span>
                  </div>
                  <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                    <span className="text-[11px] font-semibold text-[#000] mb-1">
                      Asset Type:
                    </span>
                    <span className="text-[17px] font-normal text-[#000]">
                      {assetType.title || "Not Provided"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col pb-3 ">
                  <span className="text-[11px] font-semibold text-[#000] mb-1">
                    Description:
                  </span>
                  <span className="text-[17px] font-normal text-[#000]">
                    {asset.description || "Not Provided"}
                  </span>
                </div>
              </div>
            </div>

            {/* Business Details Section */}
            <div className="p-4">
              <h4 className="text-sm font-semibold text-[#000] mb-5 pb-2 border-b border-[#000]">
                Business Details
              </h4>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                    <span className="text-[11px] font-semibold text-[#000] mb-1">
                      Entity Name:
                    </span>
                    <span className="text-[17px] font-normal text-[#000]">
                      {asset.name || "Not Provided"}
                    </span>
                  </div>

                  <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                    <span className="text-[11px] font-semiboldtext-[#000] mb-1">
                      Industry / Sector:
                    </span>
                    <span className="text-[17px] font-normal text-[#000]">
                      {businessDetail.industry || "Not Provided"}
                    </span>
                  </div>
                  <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                    <span className="text-[11px] font-semibold text-[#000] mb-1">
                      Country:
                    </span>
                    <span className="text-[17px] font-normal text-[#000]">
                      {businessDetail.country || "Not Provided"}
                    </span>
                  </div>
                  <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                    <span className="text-[11px] font-semibold text-[#000] mb-1">
                      City:
                    </span>
                    <span className="text-[17px] font-normal text-[#000]">
                      {businessDetail.city || "Not Provided"}
                    </span>
                  </div>
                  <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                    <span className="text-[11px] font-semibold text-[#000] mb-1">
                      Year Established:
                    </span>
                    <span className="text-[17px] font-normal text-[#000]">
                      {businessDetail.year_established || "Not Provided"}
                    </span>
                  </div>
                  <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                    <span className="text-[11px] font-semibold text-[#000] mb-1">
                      Number of Employees:
                    </span>
                    <span className="text-[17px] font-normal text-[#000]">
                      {businessDetail.number_of_employees ||
                        "Not Provided"}
                    </span>
                  </div>
                  <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                    <span className="text-[11px] font-semibold text-[#000] mb-1">
                      Business Valuation:
                    </span>
                    <span className="text-[17px] font-normal text-[#000]">
                      {businessDetail.business_valuation ||
                        "Not Provided"}
                    </span>
                  </div>
                  <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                    <span className="text-[11px] font-semibold text-[#000] mb-1">
                      Operational Status:
                    </span>
                    <span className="text-[17px] font-normal text-[#000]">
                      {businessDetail.operational_status || "Not Provided"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Information Section */}
            <div className="  p-4">
              <h4 className="text-sm font-semibold text-[#000] mb-5 pb-2 border-b border-[#000]">
                Financial Information
              </h4>
              <div className="space-y-4">
                {/* Core Financials */}
                <div>
                  <h5 className="text-xs font-semibold text-[#000] mb-2">
                    Core Financials
                  </h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                      <span className="text-xs font-medium text-[#000] mb-1">
                        Annual Revenue:
                      </span>
                      <span className="text-[17px] font-normal text-[#000]">
                        {businessDetail.annual_revenue ||
                          "Not Provided"}
                      </span>
                    </div>
                    <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                      <span className="text-xs font-medium text-[#000] mb-1">
                        Revenue CAGR:
                      </span>
                      <span className="text-[17px] font-normal text-[#000]">
                        {businessDetail.revenue_cagr
                          ? `${businessDetail.revenue_cagr}%`
                          : "Not Provided"}
                      </span>
                    </div>
                    <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                      <span className="text-xs font-medium text-[#000] mb-1">
                        EBITDA:
                      </span>
                      <span className="text-[17px] font-normal text-[#000]">
                        {businessDetail.ebitda ||
                          "Not Provided"}
                      </span>
                    </div>
                    <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                      <span className="text-xs font-medium text-[#000] mb-1">
                        Operating Expenses:
                      </span>
                      <span className="text-[17px] font-normal text-[#000]">
                        {businessDetail.operating_expenses ||
                          "Not Provided"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Industry Financials */}
                {(businessDetail.broadcasting_revenue ||
                  businessDetail.matchday_revenue ||
                  businessDetail.commercial_revenue ||
                  businessDetail.player_acquisitions) && (
                  <div>
                    <hr className="border-t border-[#E5E5EA] my-3" />
                    <h5 className="text-xs font-semibold text-[#000] mb-2">
                      Industry Financials
                    </h5>
                    <div className="grid grid-cols-2 gap-4">
                      {businessDetail.broadcasting_revenue && (
                        <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                          <span className="text-xs font-medium text-[#000] mb-1">
                            Broadcasting Revenue:
                          </span>
                          <span className="text-[17px] font-normal text-[#000]">
                            {businessDetail.broadcasting_revenue}
                          </span>
                        </div>
                      )}
                      {businessDetail.matchday_revenue && (
                        <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                          <span className="text-xs font-medium text-[#000] mb-1">
                            Matchday Revenue:
                          </span>
                          <span className="text-[17px] font-normal text-[#000]">
                            {businessDetail.matchday_revenue}
                          </span>
                        </div>
                      )}
                      {businessDetail.commercial_revenue && (
                        <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                          <span className="text-xs font-medium text-[#000] mb-1">
                            Commercial Revenue:
                          </span>
                          <span className="text-[17px] font-normal text-[#000]">
                            {businessDetail.commercial_revenue}
                          </span>
                        </div>
                      )}
                      {businessDetail.player_acquisitions && (
                        <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                          <span className="text-xs font-medium text-[#000] mb-1">
                            Player Acquisitions:
                          </span>
                          <span className="text-[17px] font-normal text-[#000]">
                            {businessDetail.player_acquisitions}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Investment Terms Section */}
            <div className="p-4">
              <h4 className="text-sm font-semibold text-[#000] mb-5 pb-2 border-b border-[#000]">
                Investment Terms
              </h4>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                    <span className="text-[11px] font-semibold text-[#000] mb-1">
                      Ownership Stake:
                    </span>
                    <span className="text-[17px] font-normal text-[#000]">
                      {businessDetail.ownership_stake || "Not Provided"}
                    </span>
                  </div>
                  <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                    <span className="text-[11px] font-semibold text-[#000] mb-1">
                      Minimum Investment:
                    </span>
                    <span className="text-[17px] font-normal text-[#000]">
                      {businessDetail.minimum_investment ||
                        "Not Provided"}
                    </span>
                  </div>
                  <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                    <span className="text-[11px] font-semibold text-[#000] mb-1">
                      Expected Yield:
                    </span>
                    <span className="text-[17px] font-normal text-[#000]">
                      {businessDetail.expected_yield || "Not Provided"}
                    </span>
                  </div>
                  <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                    <span className="text-[11px] font-semibold text-[#000] mb-1">
                      Minimum Annual Return:
                    </span>
                    <span className="text-[17px] font-normal text-[#000]">
                      {businessDetail.minimum_annual_return || "Not Provided"}
                    </span>
                  </div>
                  <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                    <span className="text-[11px] font-semibold text-[#000] mb-1">
                      Expected Term:
                    </span>
                    <span className="text-[17px] font-normal text-[#000]">
                      {businessDetail.expected_term || "Not Provided"}
                    </span>
                  </div>
                  <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                    <span className="text-[11px] font-semibold text-[#000] mb-1">
                      Target Close Date:
                    </span>
                    <span className="text-[17px] font-normal text-[#000]">
                      {businessDetail.target_close_date
                        ? new Date(
                            businessDetail.target_close_date
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "Not Provided"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tokenization Details Section */}
            <div className="p-4">
              <h4 className="text-sm font-semibold text-[#000] mb-5 pb-2 border-b border-[#000]">
                Tokenization Details
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="relative flex flex-col pb-3 border-b border-[#E5E5EA]">
                    <div className="absolute top-[-16px] right-0 flex items-center justify-end">
                      <img
                        src={privateIcon}
                        alt="Private"
                        className="w-16 h-16"
                      />
                    </div>
                    <span className="text-xs font-medium text-[#000] mb-1">
                      Total Supply:
                    </span>
                    <span className="text-xs text-[#000]">
                      {asset.total_supply || "Not Provided"}{" "}
                      Tokens
                    </span>
                  </div>
                  <div className="relative flex flex-col pb-3 border-b border-[#E5E5EA]">
                    {/* <div className="absolute top-[-16px] right-0 flex items-center justify-end">
                      <img
                        src={privateIcon}
                        alt="Private"
                        className="w-16 h-16"
                      />
                    </div> */}
                    <span className="text-xs font-medium text-[#000] mb-1">
                      Price per Token:
                    </span>
                    <span className="text-xs text-[#000]">
                      {asset.initial_price || "Not Provided"}
                    </span>
                  </div>
                  <div className="relative flex flex-col">
                    <div className="absolute top-[-16px] right-0 flex items-center justify-end">
                      <img
                        src={privateIcon}
                        alt="Private"
                        className="w-16 h-16"
                      />
                    </div>
                    <span className="text-xs font-medium text-[#000] mb-2">
                      Initial Owners:
                    </span>
                    <div className="space-y-2">
                      {initialOwners.length > 0 ? (
                        initialOwners.map((owner, index) => (
                          <div
                            key={owner.id || index}
                            className="flex flex-col justify-start items-start"
                          >
                            <span className="text-xs font-bold text-[#000]">
                              {owner.name}
                            </span>
                            <span className="text-xs text-[#000]">
                              {owner.token_allocation} Tokens .{" "}
                              {owner.email}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-[#000]">
                            Not Provided
                          </span>
                          <span className="text-xs font-bold text-[#000]">
                            Not Provided
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="relative flex flex-col pb-3 border-b border-[#E5E5EA]">
                    <div className="absolute top-[-16px] right-0 flex items-center justify-end">
                      <img
                        src={privateIcon}
                        alt="Private"
                        className="w-16 h-16"
                      />
                    </div>
                    <span className="text-xs font-medium text-[#000] mb-1">
                      Initial Mint:
                    </span>
                    <span className="text-xs text-[#000]">
                      {asset.initial_mint || "Not Provided"}{" "}
                      Tokens
                    </span>
                  </div>
                  <div className="relative flex flex-col pb-3 border-b border-[#E5E5EA]">
                    <div className="absolute top-[-16px] right-0 flex items-center justify-end">
                      <img
                        src={privateIcon}
                        alt="Private"
                        className="w-16 h-16"
                      />
                    </div>
                    <span className="text-xs font-medium text-[#000] mb-1">
                      Capital Target:
                    </span>
                    <span className="text-xs text-[#000]">
                      {capitalTarget|| "Not Provided"}
                    </span>
                  </div>
                  <div className="relative flex flex-col">
                    <div className="absolute top-[-16px] right-0 flex items-center justify-end">
                      <img
                        src={privateIcon}
                        alt="Private"
                        className="w-16 h-16"
                      />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-[#000]">
                        Issuer Treasury:
                      </span>
                    </div>
                    <span className="text-xs text-[#000]">
                      {issuerTreasury} Tokens
                    </span>
                    <p className="text-xs text-[#48484A] mt-1">
                      Available for investment at mint. Unminted tokens will be
                      minted on demand by the Registrar as needed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Legal & Compliance Documents Section */}
            <div className="p-4">
              <h4 className="text-sm font-semibold text-[#000] mb-5 pb-2 border-b border-[#000]">
                Legal & Compliance Documents
              </h4>
              <div className="space-y-3">
                <div className="space-y-3">
                  {assetFiles.length > 0 ? (
                    assetFiles.map((file, index) => {
                      const fileName =
                        file.file_name ||
                        file.url?.split("/").pop() ||
                        `Document ${index + 1}`;
                      const fileExtension =
                        fileName.split(".").pop()?.toUpperCase() || "PDF";
                      return (
                        <div
                          key={file.id || index}
                          className="flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="flex-shrink-0 w-4 h-4 rounded-full bg-[#0D4BEF] flex items-center justify-center">
                              <FaCheck className="w-2 h-2 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-[#000] truncate">
                                {fileName}
                              </p>
                              <p className="text-xs text-[#48484A] truncate">
                                {file.slug === "documents"
                                  ? "Document"
                                  : file.slug === "images"
                                  ? "Image"
                                  : file.slug || "File"}{" "}
                                · {fileExtension}
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              window.open(file.url, "_blank");
                            }}
                            className="!rounded-full flex-shrink-0 !bg-gray-200 !text-[#000] !text-xs !border !border-[#E5E5EA]"
                          >
                            View
                          </Button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={true}
                          readOnly
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-[#000] truncate">
                            Property-Appraisal-Report.pdf
                          </p>
                          <p className="text-xs text-[#48484A] truncate">
                            Property-Appraisal-Report.pdf · PDF ·2.3 MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          window.open("https://www.google.com", "_blank");
                        }}
                        className="!rounded-full flex-shrink-0"
                      >
                        View
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Action Required, Submission, Blockchain, Timeline */}
          <div className="">
            {/* Action Required */}

            {/* Issuer Submission */}
            <div className=" rounded-lg  !px-6">
              <h3 className="text-[15px] font-medium text-[#000] mb-4 !font-['Montserrat']">
                Issuer Submission
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-[#000]">
                    Company Name
                  </p>
                  <p className="text-[13px] font-medium text-[#000]">
                    {assetUser.first_name && assetUser.last_name
                      ? `${assetUser.first_name} ${assetUser.last_name}`
                      : asset.name || "Not Provided"}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-[#000]">Email</p>
                  <a
                    href={`mailto:${assetUser.email || ""}`}
                    className="text-[13px] font-medium text-[#0734A9] hover:underline"
                  >
                    {assetUser.email || "Not Provided"}
                  </a>
                </div>
                {/* <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-[#000]">
                    Contact Phone
                  </p>
                  <p className="text-[13px] font-medium text-[#000]">
                    {assetUser.phone || "Not Provided"}
                  </p>
                </div> */}
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-[#000]">
                    Registration Status
                  </p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 ">
                    {asset.status || "Pending Review"}
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
                      {asset.id
                        ? asset.id.substring(0, 8).toUpperCase()
                        : "REQ-2025-001"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-[#000]">
                      Submission Date
                    </p>
                    <p className="text-[13px] font-medium text-[#000]">
                      {asset.created_at
                        ? new Date(asset.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "Nov 15, 2025"}
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
                    Transaction Hash
                  </p>
                  <p className="text-[13px] font-medium text-[#000]">TBD</p>
                </div> */}

                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-[#000]">
                    Timestamp
                  </p>
                  <p className="text-[13px] font-medium text-[#000]">TBD</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-[#000]">
                    Initial Mint
                  </p>
                  <p className="text-[13px] font-medium text-[#000]">
                    {asset.initial_mint || "Not Provided"} Tokens
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-[#000]">
                    Total Supply
                  </p>
                  <p className="text-[13px] font-medium text-[#000]">
                    {asset.total_supply || "Not Provided"} Tokens
                  </p>
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
              <IssuerPublishTokenizationTimeline currentStep={3} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IssuerAssetsPublishDetailsPage;
