import { useGetTokenizedAssets } from "@/api";
import {
  Button,
  EmptyState,
  SearchBar,
  TableLoader,
} from "@/components/shared";
import SubHeading from "@/components/shared/subheading";
import useFormatNumber from "@/hooks/useFormatNumber";
import { useEffect, useMemo, useState } from "react";
import { GoPlus } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import ArrowGray from "../../../assets/issuer-assets/arrow-gray.svg";


// Formatted Number Component
const FormattedNumber = ({ value }) => {
  const formatted = useFormatNumber(value, { abbreviate: true, decimals: 1 });
  return <>{formatted}</>;
};

// Asset Image Component with fallback
const AssetImage = ({ src, alt, name }) => {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return (
      <div className="h-12 w-12 flex items-center justify-center bg-[#FAFAFC] text-[#48484A] text-xs font-medium">
        {name?.charAt(3)?.toUpperCase() || "—"}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="h-12 w-12 object-cover border-none"
      onError={() => setImageError(true)}
    />
  );
};

const FILTERS = [
  { id: "all", label: "All" },
  { id: "in-review", label: "In-Review" },
  { id: "Ready to Mint", label: "Approved" },
  { id: "minted", label: "Minted" },
  { id: "Published", label: "Published" },
  { id: "drafts", label: "Drafts" },
  { id: "denied", label: "Denied" },
];

const getStatusBadgeStyle = (statusType) => {
  switch (statusType) {
    case "active":
    case "minted":
      return {
        background: "#3BF69533",
        color: "#000",
      };

    case "denied":
      return {
        background: "#FFE5E5",
        color: "#000",
      };
    case "exited":
      return {
        background: "#F2F2F7",
        color: "#000",
      };
    case "drafts":
      return {
        background: "#FFF4E5",
        color: "#000",
      };
    case "Published":
      return {
        background: "#E3F2FD",
        color: "#000",
      };
    case "in-review":
      return {
        background: "rgba(155, 60, 255, 0.1)",
        color: "#000",
      };
    case "Ready to Mint":
      return {
        background: "#E8F5E9",
        color: "#000",
      };
    default:
      return {
        background: "#F2F2F7",
        color: "#000",
      };
  }
};

// Map API status to component statusType
const mapStatusToType = (status) => {
  const statusUpper = status?.toUpperCase();
  switch (statusUpper) {
    case "READY TO MINT":
      return "Ready to Mint";
    case "MINTED":
    case "READY TO PUBLISH":
      return "minted";
    case "ACTIVE":
      return "active";
    case "FUNDED":
      return "funded";
    case "EXITED":
      return "exited";
    case "DENIED":
      return "denied";
    case "REJECTED":
      return "denied";
    case "DRAFTS":
    case "DRAFT":
      return "drafts";
    case "PUBLISHED":
      return "Published";
    case "IN REVIEW":
      return "in-review";
    default:
      return "drafts";
  }
};

// Format status label
const formatStatusLabel = (status) => {
  const statusUpper = status?.toUpperCase();
  switch (statusUpper) {
    case "PENDING":
      return "Pending";
    case "DRAFTS":
    case "DRAFT":
      return "Drafts";
    case "APPROVED":
      return "Ready to Mint";
    case "MINTED":
    case "READY TO PUBLISH":
      return "Minted";
    case "ACTIVE":
      return "Active";
    case "FUNDED":
      return "Funded";
    case "EXITED":
      return "Exited";
    case "DENIED":
      return "Denied";
    case "REJECTED":
      return "Denied";
    case "PUBLISHED":
      return "Published";
    case "IN REVIEW":
      return "In-Review";
    default:
      return status || "Unknown";
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

// Map API response to component format
const mapAssetData = (apiAsset) => {
  const statusType = mapStatusToType(apiAsset.status);
  const capitalTarget = apiAsset.assetBusinessDetail?.minimum_investment;

  return {
    id: apiAsset.id,
    name: apiAsset.name || "—",
    category:
      
      apiAsset.assetType?.title ||
      "—",
    assetId: apiAsset.id?.substring(0, 8).toUpperCase() || "—",
    initialMint: apiAsset.initial_mint || "—",
    totalSupply: apiAsset.total_supply || "—",
    capitalTarget: capitalTarget,
    status: formatStatusLabel(apiAsset.status),
    statusType: statusType,
    totalInvestors: null,
    lastUpdated: formatDate(apiAsset.updated_at),
    expirationDate: apiAsset.assetBusinessDetail?.target_close_date
      ? formatDate(apiAsset.assetBusinessDetail.target_close_date)
      : null,
    icon: apiAsset.featured_image || apiAsset.assetType?.image || "",
  };
};

function IssuerAssetsSection() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: assetsData,
    isLoading,
    isError,
    refetch,
  } = useGetTokenizedAssets();

  // Refetch data when component mounts or route is visited
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Map API data to component format
  const mappedAssets = useMemo(() => {
    const apiAssets =
      assetsData && Array.isArray(assetsData)
        ? assetsData.map(mapAssetData)
        : [];
    // Merge static mock data with API data
    return [...apiAssets];
  }, [assetsData]);

  const filterCounts = useMemo(() => {
    const base = {};
    FILTERS.forEach((filter) => {
      if (filter.id === "all") {
        base[filter.id] = mappedAssets.length;
      } else {
        base[filter.id] = mappedAssets.filter(
          (asset) => asset?.statusType === filter.id
        ).length;
      }
    });
    return base;
  }, [mappedAssets]);

  const visibleAssets = useMemo(() => {
    // First apply status filter - filter by exact statusType match
    let filtered = mappedAssets;

    if (activeFilter && activeFilter !== "all") {
      filtered = mappedAssets.filter(
        (asset) => asset?.statusType === activeFilter
      );
    }

    // Then apply search filter if search term exists
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (asset) =>
          asset?.name?.toLowerCase().includes(term) ||
          asset?.category?.toLowerCase().includes(term) ||
          asset?.assetId?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [activeFilter, searchTerm, mappedAssets]);

  return (
    <div className="bg-white border rounded-tr-[24px] min-h-[calc(100vh-100px)]">
      <div className="flex items-center justify-between bg-[#FFFFFF] rounded-tr-[24px] px-5 pt-6 ">
        <div className="pl-4 mt-2 mb-2">
          <div className="text-start text-[32px] font-normal font-['Atacama'] leading-[120%] tracking-[0.48px] text-[#000]">
            Assets
          </div>
          <SubHeading className="text-start !py-0 mt-[10px] !text-[#000]">
            Manage your asset tokenization requests.
          </SubHeading>
        </div>

        <Button
          onClick={() => navigate("/issuer/assets/create")}
          variant="secondary"
          size="sm"
          className="!rounded-full !text-[#000] !font-[600] !text-[13px] !h-[38px] !border-[1.6px] "
          icon={<GoPlus size={20} />}
          iconPosition="left"
        >
          Add Asset
        </Button>
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

        <div className="bg-white rounded-lg border border-[#E5E5EA] overflow-hidden min-h-[600px]">
          <div className="overflow-x-auto">
            {isLoading ? (
              <table className="w-full text-left text-[13px] border border-[#E5E5EA]">
            
                <tbody>
                  <tr>
                    <td colSpan="7" className="h-[510px]">
                      <TableLoader message="" />
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : isError ? (
              <div className="mx-auto w-full max-w-full rounded-[12px] border border-dashed border-[#CBD5F5] bg-white p-8">
                <div className="text-center text-red-500">
                  Error loading assets. Please try again.
                </div>
              </div>
            ) : visibleAssets.length === 0 ? (
              <div className="mx-auto w-full max-w-full  bg-white">
                <EmptyState />
              </div>
            ) : (
              <table className="w-full table-fixed text-center text-[13px]">
                <thead className="bg-[#FAFAFC] border-b border-[#E5E5EA]">
                  <tr className="text-[13px] font-[700]">
                    <th className="px-6 py-3 text-center w-1/4">
                      <div className="flex items-center gap-1">Asset </div>
                    </th>
                    <th className="px-6 py-3 text-center w-1/4">
                      Initial Mint / Total Supply
                    </th>
                    <th className="px-6 py-3 text-center w-1/4">
                      Total Offering
                    </th>
                    <th className="px-6 md:px-16  py-3 text-left w-1/4 md:ml-3">Last Updated</th>
                    
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {visibleAssets.map((asset, index) => {
                    const badgeStyle = getStatusBadgeStyle(asset.statusType);

                    return (
                      <tr
                        key={`${asset.id}-${asset.statusType}-${index}`}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 w-1/4 text-start">
                          <div className="flex items-start gap-2 ">
                            <div className="flex-shrink-0 border border-[#E5E5EA] bg-[#FAFAFC] overflow-hidden mt-1">
                              <AssetImage
                                src={asset.icon}
                                alt={asset.name}
                                name={asset.name}
                              />
                            </div>
                            <div className="flex flex-col gap-0.3">
                              <div className="font-medium text-[#000]">
                                {asset.name}
                              </div>
                              <div className="text-[13px] text-[#48484A]">
                                {asset.category}
                              </div>
                              <div className="text-[11px] text-[#48484A]">
                                {asset.assetId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-[#000] text-center w-1/4">
                          <span className="text-[15px] text-[#000] font-medium pr-1">
                            <FormattedNumber value={asset.initialMint} />
                          </span>
                          <span className="text-[15px] text-[#48484A]">
                          
                            /
                          </span>
                          <span className="text-[15px] text-[#48484A] font-medium pl-1">
                            <FormattedNumber value={asset.totalSupply} />
                          </span>
                        </td>
                        <td className="px-6 py-3 text-[15px] text-[#000] font-medium text-center w-1/4">
                          <FormattedNumber value={asset.capitalTarget} />
                        </td>

                        <td className="px-4 py-3 w-1/2 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="flex flex-col gap-1 items-end">
                              <div
                                className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold w-fit"
                                style={badgeStyle}
                              >
                                {asset.status}
                              </div>
                              <div className="text-[15px] text-[#000] font-medium">
                                {asset.lastUpdated}
                              </div>
                              <div className="text-[11px] text-[#48484A]">
                                {asset.assetId}
                              </div>
                            </div>
                            <div>
                              {(asset.statusType === "draft" ||
                                asset.statusType === "drafts") && (
                                <button
                                  onClick={() =>
                                    navigate(
                                      `/issuer/assets/create?id=${asset.id}`
                                    )
                                  }
                                  className="rounded-full ml-12 !bg-white text-[#000] border !border-[#EFEFEF] p-3 text-xs font-medium hover:opacity-90"
                                >
                                  <img
                                    src={ArrowGray}
                                    alt="Revise"
                                    className="w-4 h-4"
                                  />
                                </button>
                              )}

                              {asset.statusType === "denied" && (
                                <div className="flex items-center flex-col gap-2">
                                  <button
                                    onClick={() =>
                                      navigate(
                                        `/issuer/assets/denied-details/${asset.id}`
                                      )
                                    }
                                    className="w-fit rounded-full  !bg-white text-[#000] border !border-black px-6 py-1 text-xs font-medium hover:opacity-90"
                                  >
                                    Revise
                                  </button>
                                  <button
                                    onClick={() =>
                                      navigate(
                                        `/issuer/assets/create?id=${asset.id}`
                                      )
                                    }
                                    className="w-fit rounded-full  !bg-white text-[#000] border !border-black px-4 py-1 text-xs font-medium hover:opacity-90"
                                  >
                                    Resubmit
                                  </button>
                                </div>
                              )}
                              {asset.statusType === "minted" && (
                                <button
                                  onClick={() =>
                                    navigate(
                                      `/issuer/assets/minted-details/${asset.id}`
                                    )
                                  }
                                  className="rounded-full ml-8 !bg-white text-[#000] border !border-[#000] px-4 py-1.5 text-xs font-medium hover:opacity-90"
                                >
                                  Publish
                                </button>
                              )}
                              {asset.statusType === "in-review" && (
                                <button
                                  onClick={() =>
                                    navigate(
                                      `/issuer/assets/review-details/${asset.id}`
                                    )
                                  }
                                  className="rounded-full ml-8 !bg-white text-[#000] border !border-[#EFEFEF] p-3 text-xs font-medium hover:opacity-90"
                                >
                                  <img
                                    src={ArrowGray}
                                    alt="Revise"
                                    className="w-4 h-4"
                                  />
                                </button>
                              )}
                              {asset.statusType === "Published" && (
                                <button
                                  onClick={() =>
                                    navigate(
                                      `/issuer/assets/publish-details/${asset.id}`
                                    )
                                  }
                                  className="rounded-full ml-8 !bg-white text-[#000] border !border-[#EFEFEF] p-3 text-xs font-medium hover:opacity-90"
                                >
                                  <img
                                    src={ArrowGray}
                                    alt="Revise"
                                    className="w-4 h-4"
                                  />
                                </button>
                              )}
                              {(asset.statusType === "funded" ||
                                asset.statusType === "exited" ||
                                asset.statusType === "approved") && (
                                <button
                                  onClick={() =>
                                    navigate(
                                      `/issuer/assets/details/${asset.id}`
                                    )
                                  }
                                  className="rounded-full ml-8 !bg-white text-[#000] border !border-[#EFEFEF] p-3 text-xs font-medium hover:opacity-90"
                                >
                                  <img
                                    src={ArrowGray}
                                    alt="Revise"
                                    className="w-4 h-4"
                                  />
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

export default IssuerAssetsSection;