import { FaCheck, FaPlus, FaMinus } from "react-icons/fa6";
import Button from "@/components/shared/button";
import privateIcon from "@/assets/issuer-assets/private.svg";

function AssetTokenizationDetails({
  asset,
  businessDetail,
  assetType,
  initialOwners,
  assetFiles,
  issuerTreasury,
  capitalTarget,
  isExpanded,
  onToggle,
}) {
  return (
    <div className="border-b border-[#E5E5EA]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
      >
        <div className="flex flex-col items-start">
          <span className="text-start !text-[#000] font-semibold !text-[17px] !py-0">
            Asset Tokenization Details
          </span>
          <span className="text-start !text-[#48484A] font-normal !text-sm !py-0 mt-1">
            These details are stored on the blockchain and cannot be edited.
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <FaMinus className="w-4 h-4 text-[#000] cursor-pointer" />
          ) : (
            <FaPlus className="w-4 h-4 text-[#000] cursor-pointer" />
          )}
        </div>
      </button>

      {/* Section Content */}
      {isExpanded && (
        <div>
          {/* Basic Information Section */}
          <div className=" bg-[#FAFAFC] border border-[#E5E5EA] rounded-lg p-4 mt-2  ">
            <h4 className="text-sm font-semibold text-[#000] mb-5 pb-2 border-b border-[#000]">
              Basic Information
            </h4>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                  <span className="text-xs font-medium text-[#000] mb-1">
                    Asset Name:
                  </span>
                  <span className="text-xs text-[#000]">
                    {asset.name || "Not Provided"}
                  </span>
                </div>
                <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                  <span className="text-xs font-medium text-[#000] mb-1">
                    Asset Type:
                  </span>
                  <span className="text-xs text-[#000]">
                    {assetType.title || "Not Provided"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col pb-3 ">
                <span className="text-xs font-medium text-[#000] mb-1">
                  Description:
                </span>
                <span className="text-xs text-[#000]">
                  {asset.description || "Not Provided"}
                </span>
              </div>
            </div>
          </div>

          {/* Business Details Section */}
          <div className=" bg-[#FAFAFC] border border-[#E5E5EA] rounded-lg p-4 mt-2  ">
            <h4 className="text-sm font-semibold text-[#000] mb-5 pb-2 border-b border-[#000]">
              Business Details
            </h4>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                  <span className="text-xs font-medium text-[#000] mb-1">
                    Entity Name:
                  </span>
                  <span className="text-xs text-[#000]">
                    {asset.name || "Not Provided"}
                  </span>
                </div>

                <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                  <span className="text-xs font-medium text-[#000] mb-1">
                    Industry / Sector:
                  </span>
                  <span className="text-xs text-[#000]">
                    {businessDetail.industry || "Not Provided"}
                  </span>
                </div>
                <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                  <span className="text-xs font-medium text-[#000] mb-1">
                    Country:
                  </span>
                  <span className="text-xs text-[#000]">
                    {businessDetail.country || "Not Provided"}
                  </span>
                </div>
                <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                  <span className="text-xs font-medium text-[#000] mb-1">
                    City:
                  </span>
                  <span className="text-xs text-[#000]">
                    {businessDetail.city || "Not Provided"}
                  </span>
                </div>
                <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                  <span className="text-xs font-medium text-[#000] mb-1">
                    Year Established:
                  </span>
                  <span className="text-xs text-[#000]">
                    {businessDetail.year_established || "Not Provided"}
                  </span>
                </div>
                <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                  <span className="text-xs font-medium text-[#000] mb-1">
                    Number of Employees:
                  </span>
                  <span className="text-xs text-[#000]">
                    {businessDetail.number_of_employees || "Not Provided"}
                  </span>
                </div>
                <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                  <span className="text-xs font-medium text-[#000] mb-1">
                    Business Valuation:
                  </span>
                  <span className="text-xs text-[#000]">
                    {businessDetail.business_valuation || "Not Provided"}
                  </span>
                </div>
                <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                  <span className="text-xs font-medium text-[#000] mb-1">
                    Operational Status:
                  </span>
                  <span className="text-xs text-[#000]">
                    {businessDetail.operational_status || "Not Provided"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Information Section */}
          <div className=" bg-[#FAFAFC] border border-[#E5E5EA] rounded-lg p-4 mt-2  ">
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
                    <span className="text-xs text-[#000]">
                      {businessDetail.annual_revenue || "Not Provided"}
                    </span>
                  </div>
                  <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                    <span className="text-xs font-medium text-[#000] mb-1">
                      Revenue CAGR:
                    </span>
                    <span className="text-xs text-[#000]">
                      {businessDetail.revenue_cagr
                        ? `${businessDetail.revenue_cagr}%`
                        : "Not Provided"}
                    </span>
                  </div>
                  <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                    <span className="text-xs font-medium text-[#000] mb-1">
                      EBITDA:
                    </span>
                    <span className="text-xs text-[#000]">
                      {businessDetail.ebitda || "Not Provided"}
                    </span>
                  </div>
                  <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                    <span className="text-xs font-medium text-[#000] mb-1">
                      Operating Expenses:
                    </span>
                    <span className="text-xs text-[#000]">
                      {businessDetail.operating_expenses || "Not Provided"}
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
                        <span className="text-xs text-[#000]">
                          {businessDetail.broadcasting_revenue}
                        </span>
                      </div>
                    )}
                    {businessDetail.matchday_revenue && (
                      <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                        <span className="text-xs font-medium text-[#000] mb-1">
                          Matchday Revenue:
                        </span>
                        <span className="text-xs text-[#000]">
                          {businessDetail.matchday_revenue}
                        </span>
                      </div>
                    )}
                    {businessDetail.commercial_revenue && (
                      <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                        <span className="text-xs font-medium text-[#000] mb-1">
                          Commercial Revenue:
                        </span>
                        <span className="text-xs text-[#000]">
                          {businessDetail.commercial_revenue}
                        </span>
                      </div>
                    )}
                    {businessDetail.player_acquisitions && (
                      <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                        <span className="text-xs font-medium text-[#000] mb-1">
                          Player Acquisitions:
                        </span>
                        <span className="text-xs text-[#000]">
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
          <div className=" bg-[#FAFAFC] border border-[#E5E5EA] rounded-lg p-4 mt-2  ">
            <h4 className="text-sm font-semibold text-[#000] mb-5 pb-2 border-b border-[#000]">
              Investment Terms
            </h4>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                  <span className="text-xs font-medium text-[#000] mb-1">
                    Ownership Stake:
                  </span>
                  <span className="text-xs text-[#000]">
                    {businessDetail.ownership_stake || "Not Provided"}
                  </span>
                </div>
                <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                  <span className="text-xs font-medium text-[#000] mb-1">
                    Minimum Investment:
                  </span>
                  <span className="text-xs text-[#000]">
                    {businessDetail.minimum_investment || "Not Provided"}
                  </span>
                </div>
                <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                  <span className="text-xs font-medium text-[#000] mb-1">
                    Expected Yield:
                  </span>
                  <span className="text-xs text-[#000]">
                    {businessDetail.expected_yield || "Not Provided"}
                  </span>
                </div>
                <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                  <span className="text-xs font-medium text-[#000] mb-1">
                    Minimum Annual Return:
                  </span>
                  <span className="text-xs text-[#000]">
                    {businessDetail.minimum_annual_return || "Not Provided"}
                  </span>
                </div>
                <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                  <span className="text-xs font-medium text-[#000] mb-1">
                    Expected Term:
                  </span>
                  <span className="text-xs text-[#000]">
                    {businessDetail.expected_term || "Not Provided"}
                  </span>
                </div>
                <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                  <span className="text-xs font-medium text-[#000] mb-1">
                    Target Close Date:
                  </span>
                  <span className="text-xs text-[#000]">
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
          <div className=" bg-[#FAFAFC] border border-[#E5E5EA] rounded-lg p-4 mt-2  ">
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
                    {asset.total_supply || "Not Provided"} Tokens
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
                            {owner.token_allocation} Tokens . {owner.email}
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
                    {asset.initial_mint || "Not Provided"} Tokens
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
                    {capitalTarget || "Not Provided"}
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
          <div className=" bg-[#FAFAFC] border border-[#E5E5EA] rounded-lg p-4 mt-2  ">
            <h4 className="text-sm font-semibold text-[#000] mb-5 pb-2 border-b border-[#000]">
              Legal & Compliance Documents
            </h4>
            <div className="space-y-3">
              <div className="space-y-3">
                {assetFiles.length > 0 ? (
                  assetFiles.map((file, index) => {
                    const fileName = file.file_name || `Document ${index + 1}`;
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
      )}
    </div>
  );
}

export default AssetTokenizationDetails;
