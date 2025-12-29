import { EmptyState, SearchBar, TableLoader } from "@/components/shared";
import SubHeading from "@/components/shared/subheading";
import { useGetTokenizedAssets } from "@/api";
import { useMemo, useState, useEffect } from "react";
import { FaChevronRight } from "react-icons/fa6";
import { HiClipboardDocument } from "react-icons/hi2";
import useFormatNumber from "@/hooks/useFormatNumber";
import { useNavigate } from "react-router-dom";
import Arrowdown from "../../../assets/admin-assets/arrow-down.svg";
const FILTERS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending Review" },
  { id: "approved", label: "Approved" },
  { id: "minted", label: "Minted" },
  { id: "published", label: "Published" },
  { id: "denied", label: "Denied" },
];

// Asset Image Component with fallback
const AssetImage = ({ src, alt, name }) => {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return (
      <div className="h-5 w-5 flex items-center justify-center bg-[#FAFAFC] text-[#48484A] text-xs font-medium">
        {name?.charAt(0)?.toUpperCase() || "—"}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="h-5 w-5 object-cover"
      onError={() => setImageError(true)}
    />
  );
};

// Map backend status to frontend statusType
const mapStatusToType = (status) => {
  if (!status) return null; // Exclude null/undefined statuses

  const statusUpper = status.toUpperCase();
  switch (statusUpper) {
    case "IN REVIEW":
      return "pending";
    case "READY TO MINT":
      return "approved";
    case "READY TO PUBLISH":
      return "minted";
    case "PUBLISHED":
      return "published";
    case "DENIED":
    case "REGISTRAR_REJECTED":
      return "denied";
    case "DRAFT":
      return null; // Exclude DRAFT from all filters
    default:
      return null; // Exclude unknown statuses
  }
};

// Format status label for display
const formatStatusLabel = (status) => {
  if (!status) return "Pending Review";

  const statusUpper = status.toUpperCase();
  switch (statusUpper) {
    case "IN REVIEW":
      return "Pending Review";
    case "READY TO MINT":
      return "Approved";
    case "READY TO PUBLISH":
      return "Minted";
    case "PUBLISHED":
      return "Published";
    case "DENIED":
    case "REGISTRAR_REJECTED":
      return "Denied";
    case "DRAFT":
      return "Pending Review";
    default:
      return status;
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

// Formatted Number Component
const FormattedNumber = ({ value }) => {
  const formatted = useFormatNumber(value, { abbreviate: true, decimals: 1 });
  return <>{formatted}</>;
};

// Map API response to component format
const mapAssetData = (apiAsset) => {
  const statusType = mapStatusToType(apiAsset.status);
  const capitalTarget = apiAsset.assetBusinessDetail?.minimum_investment
    ? apiAsset.assetBusinessDetail.minimum_investment
    : apiAsset.initial_price && apiAsset.total_supply
    ? apiAsset.initial_price * apiAsset.total_supply
    : "$0";

  // Generate asset ID from UUID (first 8 characters)
  const assetId = apiAsset.id?.substring(0, 8).toUpperCase() || "—";

  // Generate request ID (can be same as asset ID or use a different format)
  const requestId = `REQ-${assetId}`;

  // Extract registrar data
  const registrar = apiAsset.assetRegistrar?.userRegistrar;
  const registrarName =
    registrar?.first_name && registrar?.last_name
      ? `${registrar.first_name} ${registrar.last_name}`
      : registrar?.email?.split("@")[0] || null;
  const registrarEmail = registrar?.email || null;

  return {
    id: apiAsset.id,
    name: apiAsset.name || "—",
    category:
      apiAsset.assetBusinessDetail?.industry ||
      apiAsset.assetType?.title ||
      "—",
    assetId: assetId,
    requestId: requestId,
    issuer:
      apiAsset.user?.first_name && apiAsset.user?.last_name
        ? `${apiAsset.user.first_name} ${apiAsset.user.last_name}`
        : apiAsset.user?.email?.split("@")[0] || "Issuer",
    issuerEmail: apiAsset.user?.email || "—",
    initialMint: apiAsset.initial_mint,
    totalSupply: apiAsset.total_supply,
    capitalTarget: capitalTarget,
    status: formatStatusLabel(apiAsset.status),
    statusType: statusType,
    originalStatus: apiAsset.status, // Store original status for filtering
    date: formatDate(apiAsset.updated_at || apiAsset.created_at),
    icon: apiAsset.assetType?.image || apiAsset.featured_image || null,
    iconUrl: apiAsset.assetType?.image || apiAsset.featured_image || null,
    address: apiAsset.address || null,
    registrarName: registrarName,
    registrarEmail: registrarEmail,
    assetRegistrar: apiAsset.assetRegistrar || null,
  };
};
const getStatusBadgeStyle = (statusType) => {
  switch (statusType) {
    case "pending":
      return {
        background:
          "linear-gradient(135deg, rgba(155, 60, 255, 0.1) 0%, rgba(45, 103, 255, 0.1) 100%)",
        color: "#000",
      };
    case "approved":
      return {
        background: "#3BF69533",
        color: "#000",
      };
    case "minted":
      return {
        background: "#3BF69533",
        color: "#000",
      };
    case "published":
      return {
        background: "#E3F2FD",
        color: "#000",
      };
    case "denied":
      return {
        background: "#FFE5E5",
        color: "#000",
      };
    default:
      return {
        background: "#F2F2F7",
        border: "1px solid #D1D1D6",
        color: "#48484A",
      };
  }
};

function AdminAssetsSection() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState(FILTERS[0].id);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: assetsData,
    isLoading,
    isError,
    refetch,
  } = useGetTokenizedAssets();

  // Refetch data when component mounts
  useEffect(() => {
    refetch();
  }, [refetch]);

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

  // Transform API data to component format
  const transformedAssets = useMemo(() => {
    if (!assetsData) return [];
    // Axios interceptor returns response.data directly, so assetsData is the array
    const apiAssets = Array.isArray(assetsData)
      ? assetsData.map(mapAssetData)
      : [];
    // Filter out assets with null statusType (DRAFT and unknown statuses)
    return apiAssets.filter((asset) => asset.statusType !== null);
  }, [assetsData]);

  // Filter out DRAFT status assets
  const filteredAssets = useMemo(() => {
    return transformedAssets.filter((asset) => {
      // Exclude DRAFT status assets
      const statusUpper = asset.originalStatus?.toUpperCase();
      return statusUpper !== "DRAFT";
    });
  }, [transformedAssets]);

  const filterCounts = useMemo(() => {
    const base = { all: filteredAssets.length };
    FILTERS.slice(1).forEach((filter) => {
      base[filter.id] = filteredAssets.filter(
        (asset) => asset?.statusType === filter.id
      ).length;
    });
    return base;
  }, [filteredAssets]);

  const visibleAssets = useMemo(() => {
    // First apply status filter - filter by exact statusType match
    let filtered = filteredAssets;

    if (activeFilter && activeFilter !== "all") {
      if (activeFilter === "pending") {
        // For "Pending Review", only show assets with status "In Review"
        filtered = filteredAssets.filter(
          (asset) =>
            asset?.statusType === "pending" &&
            asset?.originalStatus?.toUpperCase() === "IN REVIEW"
        );
      } else {
        filtered = filteredAssets.filter(
          (asset) => asset?.statusType === activeFilter
        );
      }
    }

    // Then apply search filter if search term exists
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (asset) =>
          asset?.name?.toLowerCase().includes(term) ||
          asset?.category?.toLowerCase().includes(term) ||
          asset?.assetId?.toLowerCase().includes(term) ||
          asset?.issuer?.toLowerCase().includes(term) ||
          asset?.issuerEmail?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [activeFilter, searchTerm, filteredAssets]);

  return (
    <div className="bg-[#FAFAFC] border rounded-tr-[24px] min-h-[calc(100vh-100px)]">
      <div className="flex items-center justify-between bg-[#FFFFFF] rounded-tr-[24px] px-5 pt-6 ">
        <div className="pl-4 mt-2 mb-2">
          <div className="text-start text-[32px] font-normal font-['Atacama'] leading-[120%] tracking-[0.48px] text-[#000]">
            Assets
          </div>
          <SubHeading className="text-start !py-0 mt-[10px] !text-[#000]">
            Manage your asset tokenization requests.
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
              <TableLoader />
            ) : isError ? (
              <div className="mx-auto w-full max-w-full rounded-[12px] border border-dashed border-[#CBD5F5] bg-white p-8">
                <p className="text-center text-[#48484A]">
                  Error loading assets. Please try again.
                </p>
              </div>
            ) : visibleAssets.length === 0 ? (
              <div className="mx-auto w-full max-w-full rounded-[12px] border border-dashed border-[#CBD5F5] bg-white">
                <EmptyState />
              </div>
            ) : (
              <table className="w-full text-left text-[13px] border border-[#E5E5EA] table-fixed">
                <thead className="bg-[#FAFAFC] border-b border-[#E5E5EA]">
                  <tr className="text-[13px] font-[700]">
                    <th className="px-4 py-3 text-left w-[25.57%]">
                      <div className="flex items-center gap-1">
                        Asset
                        <img
                          src={Arrowdown}
                          alt="Arrowdown"
                          className="h-3 w-3 mt-1 text-slate-400"
                        />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left w-[14.28%]">Issuer</th>
                    <th className="px-4 py-3 text-left w-[14.28%]">
                      Initial Mint / Total Supply
                    </th>
                    <th className="px-4 py-3 text-left w-[15.28%]">Registrar</th>
                    <th className="px-4 py-3 text-left w-[18.28%]">Latest Update</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {visibleAssets.map((asset, index) => {
                    const badgeStyle = getStatusBadgeStyle(asset.statusType);

                    const handleRowClick = () => {
                      switch (asset.statusType) {
                        case "pending":
                          navigate(`/admin/assets/pending-review/${asset.id}`);
                          break;
                        case "approved":
                          navigate(
                            `/admin/assets/approved-details/${asset.id}`
                          );
                          break;
                        case "minted":
                          navigate(`/admin/assets/minted-details/${asset.id}`);
                          break;
                        case "published":
                          navigate(
                            `/admin/assets/published-details/${asset.id}`
                          );
                          break;
                        case "denied":
                          navigate(`/admin/assets/denied-details/${asset.id}`);
                          break;
                        default:
                          break;
                      }
                    };

                    return (
                      <tr
                        key={`${asset.id}-${asset.statusType}-${index}`}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={handleRowClick}
                      >
                        <td className="px-3 py-5 w-[24.57%]">
                          <div className="flex items-center gap-2">
                            <div className="flex-shrink-0 border border-[#E5E5EA] bg-[#FAFAFC] rounded-md p-4 flex items-center justify-center">
                              {asset.iconUrl ? (
                                <AssetImage
                                  src={asset.iconUrl}
                                  alt={asset.name}
                                  name={asset.name}
                                />
                              ) : (
                                <div className="h-5 w-5 flex items-center justify-center text-gray-600 text-xs font-medium">
                                  {asset.name?.charAt(0)?.toUpperCase() || "—"}
                                </div>
                              )}
                            </div>
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
                        <td className="px-3 py-5 w-[16.28%]">
                          <div className="font-medium text-[#000]">
                            {asset.issuer}
                          </div>
                          <div className="text-[13px] text-[#48484A]">
                            {asset.issuerEmail}
                          </div>
                        </td>
                        <td className="px-3 py-5 text-[#000] w-[17.28%]">
                          <span className="text-[15px] text-[#000] font-medium pr-1">
                            <FormattedNumber value={asset.initialMint} />
                          </span>
                          <span className="text-[15px] text-[#48484A]">/</span>
                          <span className="text-[15px] text-[#48484A] font-medium pl-1">
                            <FormattedNumber value={asset.totalSupply} />
                          </span>
                        </td>
                        
                        <td className="px-3 py-5 w-[16.28%]">
                          {asset.registrarName ? (
                            <>
                              <div className="font-medium text-[#000]">
                                {asset.registrarName}
                              </div>
                              <div className="text-[13px] text-[#48484A]">
                                {asset.registrarEmail || "—"}
                              </div>
                            </>
                          ) : (
                            <div className="text-[13px] text-[#48484A] font-normal">
                              Not Assigned
                            </div>
                          )}
                        </td>
                        <td
                          className="px-3 py-5 w-[14.28%]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex flex-col gap-1 flex-1">
                              {asset.statusType === "minted" && asset.address ? (
                                <>
                                  <div
                                    className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold w-fit"
                                    style={badgeStyle}
                                  >
                                    {asset.status}
                                  </div>
                                  <div className="text-[15px] text-[#000] font-medium">
                                    {asset.date}
                                  </div>
                                  <div className="text-[11px] text-[#48484A] font-normal">
                                    {asset.requestId}
                                  </div>
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
                                </>
                              ) : (
                                <>
                                  <div
                                    className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold w-fit"
                                    style={badgeStyle}
                                  >
                                    {asset.status}
                                  </div>
                                  <div className="text-[15px] text-[#000] font-medium">
                                    {asset.date}
                                  </div>
                                  {/* <div className="text-[11px] text-[#48484A] font-normal">
                                    {asset.requestId}
                                  </div> */}
                                </>
                              )}
                            </div>
                            <div className="flex-shrink-0">
                              {asset.statusType === "pending" && (
                                <button
                                  onClick={() =>
                                    navigate(
                                      `/admin/assets/pending-review/${asset.id}`
                                    )
                                  }
                                  className="w-fit rounded-full !bg-white text-[#000] border !border-black px-4 py-1 text-xs font-medium hover:opacity-90"
                                >
                                  Review
                                </button>
                              )}
                              {asset.statusType === "approved" && (
                                <button
                                  onClick={() =>
                                    navigate(
                                      `/admin/assets/approved-details/${asset.id}`
                                    )
                                  }
                                  className="w-fit rounded-full !bg-white text-[#000] border !border-black px-4 py-1 text-xs font-medium hover:opacity-90"
                                >
                                  Mint
                                </button>
                              )}
                              {asset.statusType === "minted" && (
                                <button
                                  onClick={() =>
                                    navigate(
                                      `/admin/assets/minted-details/${asset.id}`
                                    )
                                  }
                                  className="w-fit text-[#48484A] hover:text-[#000] cursor-pointer"
                                >
                                  <FaChevronRight className="h-4 w-4" />
                                </button>
                              )}
                              {asset.statusType === "published" && (
                                <button
                                  onClick={() =>
                                    navigate(
                                      `/admin/assets/published-details/${asset.id}`
                                    )
                                  }
                                  className="w-fit text-[#48484A] hover:text-[#000] cursor-pointer"
                                >
                                  <FaChevronRight className="h-4 w-4" />
                                </button>
                              )}
                              {asset.statusType === "denied" && (
                                <button
                                  onClick={() =>
                                    navigate(
                                      `/admin/assets/denied-details/${asset.id}`
                                    )
                                  }
                                  className="w-fit text-[#48484A] hover:text-[#000] cursor-pointer"
                                >
                                  <FaChevronRight className="h-4 w-4 text-center" />
                                </button>
                              )}
                            </div>
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

export default AdminAssetsSection;
