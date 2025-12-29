import { EmptyState, SearchBar, TableLoader } from "@/components/shared";
import SubHeading from "@/components/shared/subheading";
import { useGetPurchaseRequests } from "@/api";
import { useMemo, useState } from "react";
import { FaBuilding, FaChevronRight, FaUser } from "react-icons/fa6";
import { HiClipboardDocument } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import Arrowdown from "../../../assets/admin-assets/arrow-down.svg";
import useFormatNumber from "@/hooks/useFormatNumber";

// Asset Image Component with fallback
const AssetImage = ({ src, alt, name }) => {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return (
      <div className="flex-shrink-0 border border-[#E5E5EA] bg-[#FAFAFC] rounded-md h-12 w-12 flex items-center justify-center">
        <span className="text-gray-600 text-xs font-medium">
          {name?.charAt(0)?.toUpperCase() || "—"}
        </span>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 border border-[#E5E5EA] bg-[#FAFAFC] rounded-md overflow-hidden h-12 w-12">
      <img
        src={src}
        alt={alt}
        className="h-12 w-12 object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
};

// Purchase Request Status Enum
export const PURCHASE_REQUEST_STATUS = {
  AWAITING_UPLOAD: "Awaiting Upload",
  AWAITING_VERIFICATION: "Awaiting Verification",
  AWAITING_FOR_MINT: "Awaiting For Mint",
  REJECTED: "Rejected",
  APPROVED: "Approved",
};

const FILTERS = [
  { id: "Awaiting Upload", label: "Awaiting For Upload" },
  { id: "pending", label: "Awaiting Verification" },
  { id: "pending-approval", label: "Awaiting For Mint" },
  { id: "issued", label: "Tokens Issued" },
  { id: "Rejected", label: "Rejected", showArrow: false },
];

// Map API status to component statusType
const mapStatusToType = (status) => {
  if (!status) return null;

  switch (status) {
    case PURCHASE_REQUEST_STATUS.AWAITING_VERIFICATION:
      return "pending";
    case PURCHASE_REQUEST_STATUS.AWAITING_FOR_MINT:
      return "pending-approval";
    case PURCHASE_REQUEST_STATUS.APPROVED:
      return "issued";
    case PURCHASE_REQUEST_STATUS.REJECTED:
      return "Rejected"; // Filter out rejected requests
    case PURCHASE_REQUEST_STATUS.AWAITING_UPLOAD:
      return "Awaiting Upload"; // Map to pending-approval for filtering
    default:
      return "pending";
  }
};

// Formatted Number Component
const FormattedNumber = ({ value }) => {
  const formatted = useFormatNumber(value, { abbreviate: true, decimals: 1 });
  return <>{formatted}</>;
};
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

// Map API response to component format
const mapPurchaseRequestData = (apiRequest) => {
  const statusType = mapStatusToType(apiRequest.status);

  // Skip rejected requests only

  const purchaserName = apiRequest.investor
    ? `${apiRequest.investor.first_name || ""} ${
        apiRequest.investor.last_name || ""
      }`.trim() ||
      apiRequest.investor.email?.split("@")[0] ||
      "Investor"
    : "Investor";

  const issuerName = apiRequest.issuer
    ? `${apiRequest.issuer.first_name || ""} ${
        apiRequest.issuer.last_name || ""
      }`.trim() ||
      apiRequest.issuer.email?.split("@")[0] ||
      "Issuer"
    : "Issuer";

  // Determine purchaser type (assuming individual if no company indicator)
  const purchaserType = "individual"; // You can update this based on your data structure

  // Generate asset ID from UUID
  const assetId = apiRequest.asset?.id
    ? apiRequest.asset.id.substring(0, 8).toUpperCase()
    : "—";

  // Generate request ID
  const requestId = apiRequest.id
    ? `TIR-${apiRequest.id.substring(0, 8).toUpperCase()}`
    : "—";

  return {
    id: apiRequest.id,
    name: apiRequest.asset?.name || "—",
    category: apiRequest.asset?.description
      ? apiRequest.asset.description.length > 50
        ? apiRequest.asset.description.substring(0, 50) + "..."
        : apiRequest.asset.description
      : "—",
    assetId: assetId,
    requestId: requestId,
    issuer: issuerName,
    issuerEmail: apiRequest.issuer?.email || "—",
    purchaser: purchaserName,
    purchaserContact: purchaserName,
    purchaserEmail: apiRequest.investor?.email || "—",
    purchaserType: purchaserType,
    tokens: apiRequest.token_requested || "—",
    amount: apiRequest.total_amount || "—",
    date: formatDate(apiRequest.created_at),
    statusType: statusType,
    status: apiRequest.status, // Store original status for navigation
    imageUrl: apiRequest.asset?.featured_image || null,
    address: apiRequest.address || null, // Add address if available from API
    icon: null, // Will use imageUrl or fallback
  };
};

function RegistrarTokenizationIssuanceQueueSection() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState(FILTERS[0].id);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch purchase requests from API
  const {
    data: purchaseRequestsData,
    isLoading,
    isError,
  } = useGetPurchaseRequests(1, 100);

  // Map API data to component format
  const purchaseRequests = useMemo(() => {
    // Handle both possible response structures
    const responseData = purchaseRequestsData?.data;
    const dataArray = Array.isArray(responseData)
      ? responseData
      : responseData?.data;

    if (!dataArray || !Array.isArray(dataArray)) return [];

    return dataArray.map(mapPurchaseRequestData).filter(Boolean); // Filter out null values (rejected/awaiting upload)
  }, [purchaseRequestsData]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // You can add a toast notification here if needed
    });
  };

  const truncateAddress = (address) => {
    if (!address) return "";
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}..${address.slice(-4)}`;
  };

  const filterCounts = useMemo(() => {
    const base = { all: purchaseRequests.length };
    FILTERS.forEach((filter) => {
      base[filter.id] = purchaseRequests.filter(
        (asset) => asset.statusType === filter.id
      ).length;
    });
    return base;
  }, [purchaseRequests]);

  const visibleAssets = useMemo(() => {
    let filtered = purchaseRequests;

    // Apply status filter
    if (activeFilter && activeFilter !== "all") {
      filtered = purchaseRequests.filter(
        (asset) => asset.statusType === activeFilter
      );
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (asset) =>
          asset.name.toLowerCase().includes(term) ||
          asset.category.toLowerCase().includes(term) ||
          asset.assetId.toLowerCase().includes(term) ||
          asset.issuer.toLowerCase().includes(term) ||
          asset.issuerEmail.toLowerCase().includes(term) ||
          asset.purchaser?.toLowerCase().includes(term) ||
          asset.purchaserEmail?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [activeFilter, searchTerm, purchaseRequests]);

  return (
    <div className="bg-white border rounded-tr-[24px] min-h-[calc(100vh-100px)]">
       <div className="flex items-center justify-between bg-[#FFFFFF] rounded-tr-[24px] px-5 pt-6 ">
        <div className="pl-4 mt-2 mb-2">
          <div className="text-start text-[32px] font-normal font-['Atacama'] leading-[120%] tracking-[0.48px] text-[#000]">
            Token Purchase Requests
          </div>
          <SubHeading className="text-start !py-0 mt-[10px] !text-[#000]">
            Review token purchase requests submitted by Issuers.
          </SubHeading>
        </div>
      </div>

      <div className="p-4 sm:p-6">
      <div className="border-none  !p-0 mb-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full">
            <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
              {FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center gap-2 rounded-full px-4 py-1 h-[42px] text-[13px] transition ${
                    activeFilter === filter.id
                      ? "bg-gradient-to-tr from-[#0734A9] via-[#0E1696] to-[#4B0792] font-semibold text-white"
                      : "bg-white border text-[#000] font-semibold hover:bg-[linear-gradient(135deg,rgba(155,60,255,0.06)_0%,rgba(45,103,255,0.06)_100%)] hover:text-[#000]"
                  }`}
                >
                  {filter.label}
                  <span
                    className={`flex h-5 items-center justify-center rounded-full px-[5px] text-[11px]  ${
                      activeFilter === filter.id
                        ? "bg-white text-black"
                        : "bg-[linear-gradient(135deg,rgba(155,60,255,0.15)_0%,rgba(45,103,255,0.15)_100%)] text-[#000] hover:!bg-white hover:!bg-none"
                    }`}
                  >
                    {filter.id === "all"
                      ? filterCounts.all
                      : filterCounts[filter.id] || 0}
                  </span>
                </button>
              ))}
            </div>

            <div className="w-full md:flex-1 md:min-w-0  ">
              <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search"
                className=""
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#E5E5EA] overflow-hidden">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8">
                <TableLoader />
              </div>
            ) : isError ? (
              <div className="mx-auto w-full max-w-full rounded-[12px] border border-dashed border-[#CBD5F5] bg-white p-8">
                <div className="text-center text-[#48484A]">
                  Error loading purchase requests. Please try again.
                </div>
              </div>
            ) : visibleAssets.length === 0 ? (
              <div className="mx-auto w-full max-w-full rounded-[12px] border border-dashed border-[#CBD5F5] bg-white">
                <EmptyState />
              </div>
            ) : (
              <table className="w-full text-left text-[13px] border border-[#E5E5EA]">
                <thead className="bg-[#FAFAFC] border-b border-[#E5E5EA]">
                  <tr className="text-[13px] font-[700]">
                    <th className="px-4 py-3 text-left">
                      <div className="flex items-center gap-1">Asset</div>
                    </th>
                    <th className="px-4 py-3 text-left">Purchaser</th>
                    <th className="px-4 py-3 text-left">Issuer</th>
                    <th className="px-4 py-3 text-left">Tokens</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                    <th className="px-4 py-3 text-left">
                      <div className="flex items-center gap-1">
                        Authorized{" "}
                        <img
                          src={Arrowdown}
                          alt="Arrowup"
                          className="h-3 w-3  text-slate-400 rotate-180"
                        />
                      </div>
                    </th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {visibleAssets.map((asset) => {
                    const PurchaserIcon =
                      asset.purchaserType === "company" ? FaBuilding : FaUser;

                    const handleRowClick = () => {
                      const status = asset.status;
                      
                      if (status === PURCHASE_REQUEST_STATUS.AWAITING_FOR_MINT) {
                        // Route to IssuancePendingDetailsPage
                        navigate(
                          `/registrar/tokenization-issuance-queue/pending-details/${asset.id}`
                        );
                      } else if (
                        
                        status === PURCHASE_REQUEST_STATUS.AWAITING_UPLOAD
                      ) {
                        // Route to PendingApprovalDetailsPage
                        navigate(
                          `/registrar/tokenization-issuance-queue/pending-approval-details/${asset.id}`
                        );
                      } else if (status === PURCHASE_REQUEST_STATUS.APPROVED) {
                        // Route to IssuanceIssuedDetailsPage
                        navigate(
                          `/registrar/tokenization-issuance-queue/issued-details/${asset.id}`
                        );
                      }
                      else if (status === PURCHASE_REQUEST_STATUS.AWAITING_VERIFICATION) {
                        // Route to RejectedDetailsPage
                        navigate(
                          `/registrar/tokenization-issuance-queue/pending-approval-details/${asset.id}`
                        );
                      }

                    };

                    return (
                      <tr
                        key={asset.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={handleRowClick}
                      >
                        <td className="px-3 py-5">
                          <div className="flex items-center gap-2 min-w-[230px] max-w-[230px]">
                            <AssetImage
                              src={asset.imageUrl}
                              alt={asset.name}
                              name={asset.name}
                            />
                            <div>
                              <div className="font-medium text-[#000]">
                                {asset.name}
                              </div>
                              <div className="text-[13px] text-[#48484A]">
                                {asset.category}
                              </div>
                              {/* <div className="text-[11px] text-[#48484A]">
                                {asset.assetId}
                              </div> */}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-5">
                          <div className="flex items-center gap-2 ">
                            <div className="flex-shrink-0 border border-[#E5E5EA] bg-[#FAFAFC] rounded-full p-1.5">
                              <PurchaserIcon className="h-3 w-3 text-gray-600" />
                            </div>
                            <div>
                              <div className="font-medium text-[#000]">
                                {asset.purchaser}
                              </div>
                              {/* <div className="text-[13px] text-[#48484A]">
                                {asset.purchaserContact}
                              </div> */}
                              <div className="text-[11px] text-[#48484A]">
                                {asset.purchaserEmail}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-5">
                          <div className="font-medium text-[#000]">
                            {asset.issuer}
                          </div>
                          <div className="text-[13px] text-[#48484A]">
                            {asset.issuerEmail}
                          </div>
                        </td>
                        <td className="px-3 py-5 text-[15px] text-[#000] font-medium">
                          <FormattedNumber value={asset.tokens} />
                        </td>
                        <td className="px-3 py-5 text-[15px] text-[#000] font-medium">
                          <FormattedNumber value={asset.amount} />
                        </td>
                        <td className="px-3 py-5">
                          <div className="flex flex-col gap-1">
                            <div className="text-[15px] text-[#000] font-medium">
                              {asset.date}
                            </div>
                            <div className="text-[11px] text-[#48484A] font-normal">
                              {asset.requestId}
                            </div>
                            {asset.statusType === "issued" && asset.address && (
                              <div className="flex items-center gap-1 mt-1">
                                <div className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold w-fit bg-[#F2F2F7] border border-[#D1D1D6] text-[#48484A]">
                                  {truncateAddress(asset.address)}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyToClipboard(asset.address);
                                    }}
                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                    title="Copy address"
                                  >
                                    <HiClipboardDocument className="h-3 w-3 text-[#48484A]" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-5">
                          <div className="w-fit text-[#48484A]">
                            <FaChevronRight className="h-4 w-4" />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrarTokenizationIssuanceQueueSection;
