import { useGetPurchaseRequests } from "@/api";
import SearchBar from "@/components/shared/SearchBar";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TabButton from "./TabButton";
import { EmptyState, TableLoader } from "@/components/shared";
import ArrowGray from "../../../assets/issuer-assets/arrow-gray.svg";
import useFormatNumber from "@/hooks/useFormatNumber";

// Asset Image Component with fallback
const AssetImage = ({ src, alt, name, iconClasses }) => {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return (
      <div className="h-6 w-6 flex items-center justify-center bg-[#FAFAFC] text-[#48484A] text-xs font-medium rounded-full">
        {name?.charAt(0)?.toUpperCase() || "—"}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`h-12 w-12 object-cover ${iconClasses}`}
      onError={() => setImageError(true)}
    />
  );
};

// Formatted Number Component
const FormattedNumber = ({ value }) => {
  const formatted = useFormatNumber(value, { abbreviate: true, decimals: 1 });
  return <>{formatted}</>;
};

const getStatusBadgeStyle = (statusType) => {
  switch (statusType) {
    case "pending_verification":
      return {
        background: "rgba(131, 246, 59, 0.20)",
        color: "#000",
      };
    case "registrar_pending":
      return {
        background:
          "linear-gradient(135deg, rgba(155, 60, 255, 0.10) 0%, rgba(45, 103, 255, 0.10) 100%)",
        color: "#000",
      };
    case "tokens_issued":
      return {
        background: "rgba(34, 197, 94, 0.20)",
        color: "#000",
      };
    case "Rejected":
      return {
        background: "rgba(239, 68, 68, 0.20)",
        color: "#000",
      };
    default:
      return {
        background: "#F2F2F7",
        color: "#000",
      };
  }
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

// Map backend status to frontend statusType
const mapStatusToType = (status) => {
  if (!status) return null;

  const statusUpper = status.toUpperCase();
  switch (statusUpper) {
    case "AWAITING UPLOAD":
      return "pending_verification";
    case "AWAITING VERIFICATION":
      return "pending_verification";
    case "AWAITING FOR MINT":
      return "registrar_pending";
    case "APPROVED":
      return "tokens_issued";
    case "REJECTED":
      return "Rejected";
    default:
      return null;
  }
};

// Map API response to component format
const mapPurchaseRequestData = (apiRequest) => {
  const statusType = mapStatusToType(apiRequest.status);
  const investorName = apiRequest.investor
    ? `${apiRequest.investor.first_name || ""} ${
        apiRequest.investor.last_name || ""
      }`.trim() ||
      apiRequest.investor.email?.split("@")[0] ||
      "Investor"
    : "Investor";
  const investorId = apiRequest.investor?.id
    ? `INV-${apiRequest.investor.id.substring(0, 8).toUpperCase()}`
    : "—";
  const assetId = apiRequest.asset?.id
    ? apiRequest.asset.id.substring(0, 8).toUpperCase()
    : "—";

  return {
    id: apiRequest.id,
    investorName: investorName,
    investorEmail: apiRequest.investor?.email || "—",

    investorId: investorId,
    assetName: apiRequest.asset?.name || "—",
    assetType: apiRequest.asset?.businessDetail?.industry || "",
    assetId: assetId,
    requestAmount: apiRequest.total_amount || "—",
    tokens: apiRequest.token_requested,
    amountUSD: apiRequest.total_amount,
    status: apiRequest.status || "—",
    statusType: statusType,
    requestDate: formatDate(apiRequest.created_at),
    reviewDeadline: apiRequest.expiration_period
      ? formatDate(apiRequest.expiration_period)
      : null,
    investorIcon: apiRequest.investor?.profile_pic || null,
    assetIcon: apiRequest.asset?.featured_image || null,
  };
};

const FILTERS = [
  { id: "all", label: "All", showArrow: false },
  {
    id: "pending_verification",
    label: "Pending Verification",
    showArrow: false,
  },
  { id: "verified", label: "Verified", showArrow: false },
  {
    id: "registrar_pending",
    label: "Registrar Pending",
    showArrow: false,
  },

  { id: "tokens_issued", label: "Tokens Issued", showArrow: false },
  { id: "Rejected", label: "Denied", showArrow: false },
];

const IssuerPurchaseSectionPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState({
    pending_verification: false,
    registrar_pending: false,
  });
  const navigate = useNavigate();

  // Handle row click
  const handleRowClick = (request) => {
    console.log("Viewing purchase request:", request.id);
    navigate(`/issuer/purchase-requests/pending-details/${request.id}`);
  };

  // Handle view details button click
  const handleViewDetails = (e, request) => {
    e.stopPropagation(); // Prevent row click from firing
    console.log("Viewing purchase request:", request.id);
    navigate(`/issuer/purchase-requests/pending-details/${request.id}`);
  };

  // Fetch purchase requests from API
  const {
    data: purchaseRequestsData,
    isLoading,
    isError,
  } = useGetPurchaseRequests(1, 100);

  // Map API data to component format
  const purchaseRequests = useMemo(() => {
    if (!purchaseRequestsData?.data) return [];
    return purchaseRequestsData.data.map(mapPurchaseRequestData);
  }, [purchaseRequestsData]);

  // Toggle dropdown for specific tabs
  const toggleDropdown = (filterId) => {
    if (
      filterId === "pending_verification" ||
      filterId === "registrar_pending"
    ) {
      setShowDropdown((prev) => ({
        ...prev,
        [filterId]: !prev[filterId],
      }));
    }
  };

  // Calculate filter counts
  const filterCounts = useMemo(() => {
    const base = { all: purchaseRequests.length };
    FILTERS.forEach((filter) => {
      if (filter.id !== "all") {
        base[filter.id] = purchaseRequests.filter(
          (request) => request?.statusType === filter.id
        ).length;
      }
    });
    return base;
  }, [purchaseRequests]);

  // Filter and search data
  const visibleRequests = useMemo(() => {
    let filtered = purchaseRequests;

    // Apply status filter
    if (activeFilter && activeFilter !== "all") {
      filtered = purchaseRequests.filter(
        (request) => request?.statusType === activeFilter
      );
    }

    // Apply search filter
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (request) =>
          request?.investorName?.toLowerCase().includes(term) ||
          request?.assetName?.toLowerCase().includes(term) ||
          request?.assetType?.toLowerCase().includes(term) ||
          request?.investorId?.toLowerCase().includes(term) ||
          request?.assetId?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [activeFilter, searchTerm, purchaseRequests]);

  return (
    <div className="pb-16 bg-white border rounded-tr-[24px] min-h-[calc(100vh-100px)]">
      <div className="flex flex-col justify-start gap-8px pt-[30px] pr-[30px] pb-[15px] pl-[30px]">
        <div className="font-['Atacama'] text-[32px] font-normal">
          Purchase Requests
        </div>
        <p className="text-[13px] font-normal">
          Review purchase requests submitted by investors.
        </p>
      </div>

      {/* Tabs and Search Bar */}
      <div className="px-6 pb-6">
        <div className="border-none !p-0 mb-6 mt-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full">
            <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
              {FILTERS.map((filter) => (
                <TabButton
                  key={filter.id}
                  filter={filter}
                  activeFilter={activeFilter}
                  setActiveFilter={setActiveFilter}
                  filterCounts={filterCounts}
                  showDropdown={showDropdown}
                  toggleDropdown={toggleDropdown}
                  setShowDropdown={setShowDropdown}
                  menuList={filter.menuList}
                />
              ))}
            </div>

            <div className="w-full md:flex-1 md:min-w-0  ">
              <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white  overflow-hidden mt-4  rounded-lg border border-[#E5E5EA]">
          <div className="overflow-x-auto">
            {isLoading ? (
              <table className="w-full text-left text-[13px] ">
                <tbody>
                  <tr>
                    <td colSpan="7" className="h-[510px]">
                      <TableLoader message="" />
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : isError ? (
              <div className="mx-auto w-full max-w-full bg-white p-8 text-center">
                <div className="text-[#48484A]">
                  Error loading purchase requests
                </div>
              </div>
            ) : visibleRequests.length === 0 ? (
              <div className="mx-auto w-full max-w-full bg-white p-8 h-[510px] justify-center items-center flex text-center">
                <EmptyState message="No purchase requests found" />
              </div>
            ) : (
              <table className="w-full text-left text-[13px] ">
                <thead className="bg-[#FAFAFC] border-b border-[#E5E5EA]">
                  <tr className="text-[13px] font-[700]">
                    <th className="px-4 py-3 text-left">Assets</th>
                    <th className="px-4 py-3 text-left">Purchaser</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                    <th className="px-4 py-3 text-left">Proof</th>
                    <th className="px-4 py-3 text-left">Submitted</th>
                    <th className="px-4 py-3 text-left"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {visibleRequests.map((request) => {
                    const badgeStyle = getStatusBadgeStyle(request.statusType);

                    return (
                      <tr
                        key={request.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleRowClick(request)}
                      >
                        <td className="px-3 py-5 min-w-[200px] max-w-[200px]">
                          <div className="flex items-center gap-2">
                            <div className=" border border-[#E5E5EA] bg-[#FAFAFC] w-10 h-10 ">
                              <AssetImage
                                src={request.assetIcon}
                                alt={request.assetName}
                                name={request.assetName}
                                iconClasses="!w-10 !h-10"
                              />
                            </div>
                            <div>
                              <div className="font-medium text-[#000]">
                                {request.assetName &&
                                request.assetName.length > 15
                                  ? `${request.assetName.substring(0, 10)}...`
                                  : request.assetName}
                              </div>
                              <div className="text-[13px] text-[#48484A]">
                                {request.assetType}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-5">
                          <div className="flex items-center gap-2">
                            <div className=" border border-[#E5E5EA] bg-[#FAFAFC] rounded-full">
                              <AssetImage
                                src={request.investorIcon}
                                alt={request.investorName}
                                name={request.investorName}
                                iconClasses="!w-6 !h-6 !rounded-full"
                              />
                            </div>
                            <div>
                              <div className="font-medium text-[#000] text-[15px]">
                                {request.investorName}
                              </div>
                              <div className="text-[13px] text-[#48484A] font-normal">
                                {request.investorEmail}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-5">
                          <div className="flex flex-col gap-1">
                            <div className="text-[15px] text-[#000] font-medium">
                              <FormattedNumber value={request.amountUSD} />
                            </div>
                            <div className="text-[13px] text-[#48484A]">
                              {request.tokens} tokens
                            </div>
                          </div>
                        </td>

                        <td className="px-3 py-5">
                          <div className="flex flex-col gap-1">
                            <div
                              className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold w-fit"
                              style={badgeStyle}
                            >
                              {request.status}
                            </div>
                          </div>
                        </td>

                        <td className="px-3 py-5">
                          <div className="text-[15px] text-[#000] font-medium">
                            {request.requestDate}
                          </div>
                        </td>
                        <td className="px-3 py-5">
                          {activeFilter === "pending_verification" && (
                            <button
                              onClick={(e) => handleViewDetails(e, request)}
                              className="flex items-center gap-2 rounded-full bg-white text-[#000] border border-black px-4 py-1 text-xs font-medium hover:opacity-90"
                            >
                              Verify
                            </button>
                          )}
                          {(activeFilter === "verified" ||
                            activeFilter === "Rejected") && (
                            <button
                              onClick={(e) => handleViewDetails(e, request)}
                              className="flex items-center gap-2 rounded-full bg-white text-[#000] border border-black px-4 py-1 text-xs font-medium hover:opacity-90"
                            >
                              Details
                            </button>
                          )}
                          {(activeFilter === "registrar_pending" ||
                            activeFilter === "tokens_issued") && (
                            <button
                              onClick={(e) => handleViewDetails(e, request)}
                              className="rounded-full !bg-white text-[#000] border !border-[#EFEFEF] p-3 text-xs font-medium hover:opacity-90"
                            >
                              <img
                                src={ArrowGray}
                                alt="Revise"
                                className="w-4 h-4"
                              />
                            </button>
                          )}
                          {activeFilter === "all" && (
                            <>
                              {request?.statusType === "pending_verification" && (
                                <button
                                  onClick={(e) => handleViewDetails(e, request)}
                                  className="flex items-center gap-2 rounded-full bg-white text-[#000] border border-black px-4 py-1 text-xs font-medium hover:opacity-90"
                                >
                                  Verify
                                </button>
                              )}
                              {(request?.statusType === "verified" ||
                                request?.statusType === "Rejected") && (
                                <button
                                  onClick={(e) => handleViewDetails(e, request)}
                                  className="flex items-center gap-2 rounded-full bg-white text-[#000] border border-black px-4 py-1 text-xs font-medium hover:opacity-90"
                                >
                                  Details
                                </button>
                              )}
                              {(request?.statusType === "registrar_pending" ||
                                request?.statusType === "tokens_issued") && (
                                <button
                                  onClick={(e) => handleViewDetails(e, request)}
                                  className="rounded-full !bg-white text-[#000] border !border-[#EFEFEF] p-3 text-xs font-medium hover:opacity-90"
                                >
                                  <img
                                    src={ArrowGray}
                                    alt="Revise"
                                    className="w-4 h-4"
                                  />
                                </button>
                              )}
                            </>
                          )}
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
};

export default IssuerPurchaseSectionPage;
