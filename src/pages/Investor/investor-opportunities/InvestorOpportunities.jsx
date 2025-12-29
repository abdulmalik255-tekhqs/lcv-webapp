import React, { useState, useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { SearchBar, Card, SimpleDropdown, Button } from "@/components/shared";
import GenericModal from "@/components/shared/GenericModal";
import { FaChevronRight, FaImage } from "react-icons/fa6";
import ListIcon from "@/assets/investor-assets/list.svg";
import GridIcon from "@/assets/investor-assets/grid.svg";
import FilterIcon from "@/assets/investor-assets/filterIcon.svg";
import { useGetInvestorStats } from "@/api/investors";
import axiosInstance from "@/api/axiosInstance";
import urls from "@/constants/urls";
import useFormatNumber from "@/hooks/useFormatNumber";

import {
  SORT_OPTIONS,
  PURCHASE_REQUEST_STATUS_FILTERS,
  PURCHASE_REQUEST_STATUS,
  ANNUAL_RETURN_FILTERS,
  INVESTMENT_TERM_FILTERS,
  MINIMUM_INVESTMENT_FILTERS,
} from "./constants";


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

// Get status badge color
const getStatusBadgeClass = (status) => {
  switch (status) {
    case PURCHASE_REQUEST_STATUS.AWAITING_UPLOAD:
      return "bg-yellow-100 text-yellow-800";
    case PURCHASE_REQUEST_STATUS.AWAITING_VERIFICATION:
      return "bg-blue-100 text-blue-800";
    case PURCHASE_REQUEST_STATUS.AWAITING_FOR_MINT:
      return "bg-purple-100 text-purple-800";
    case PURCHASE_REQUEST_STATUS.REJECTED:
      return "bg-red-100 text-red-800";
    case PURCHASE_REQUEST_STATUS.APPROVED:
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const AdvancedFiltersModal = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onClearAll,
  resultCount,
}) => {
  const handleFilterToggle = (category, filterId) => {
    const currentFilters = filters[category] || [];
    const newFilters = currentFilters.includes(filterId)
      ? currentFilters.filter((id) => id !== filterId)
      : [...currentFilters, filterId];
    onFilterChange(category, newFilters);
  };

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title="Filters"
      maxWidth="max-w-md"
      className="!p-0"
    >
      <div className="px-6 pb-6">
        {/* Annual Return */}
        <div className="mb-6">
          <h3 className="text-[15px] font-semibold text-[#000] mb-3">
            Annual Return
          </h3>
          <div className="flex flex-wrap gap-2">
            {ANNUAL_RETURN_FILTERS.map((filter) => (
              <button
                key={filter.id}
                onClick={() => handleFilterToggle("annualReturn", filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filters.annualReturn?.includes(filter.id)
                    ? "bg-[linear-gradient(135deg,rgba(155,60,255,0.2)_0%,rgba(45,103,255,0.2)_100%)] text-[#5D07B7] border border-[#5D07B7]"
                    : "bg-white border border-[#E5E5EA] text-[#000] hover:border-[#5D07B7]"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Investment Term */}
        <div className="mb-6">
          <h3 className="text-[15px] font-semibold text-[#000] mb-3">
            Investment Term
          </h3>
          <div className="flex flex-wrap gap-2">
            {INVESTMENT_TERM_FILTERS.map((filter) => (
              <button
                key={filter.id}
                onClick={() => handleFilterToggle("investmentTerm", filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filters.investmentTerm?.includes(filter.id)
                    ? "bg-[linear-gradient(135deg,rgba(155,60,255,0.2)_0%,rgba(45,103,255,0.2)_100%)] text-[#5D07B7] border border-[#5D07B7]"
                    : "bg-white border border-[#E5E5EA] text-[#000] hover:border-[#5D07B7]"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Minimum Investment */}
        <div className="mb-6">
          <h3 className="text-[15px] font-semibold text-[#000] mb-3">
            Minimum Investment
          </h3>
          <div className="flex flex-wrap gap-2">
            {MINIMUM_INVESTMENT_FILTERS.map((filter) => (
              <button
                key={filter.id}
                onClick={() =>
                  handleFilterToggle("minimumInvestment", filter.id)
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filters.minimumInvestment?.includes(filter.id)
                    ? "bg-[linear-gradient(135deg,rgba(155,60,255,0.2)_0%,rgba(45,103,255,0.2)_100%)] text-[#5D07B7] border border-[#5D07B7]"
                    : "bg-white border border-[#E5E5EA] text-[#000] hover:border-[#5D07B7]"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E5E5EA]">
          <button
            onClick={onClearAll}
            className="text-[14px] font-medium text-[#5D07B7] hover:underline"
          >
            Clear All
          </button>
          <Button
            variant="gradient"
            onClick={onClose}
            className="!px-8 !py-2.5"
          >
            Show {resultCount} results
          </Button>
        </div>
      </div>
    </GenericModal>
  );
};

const ListView = ({ purchaseRequests, onPurchaseRequestClick }) => {
  return (
    <div className="space-y-0">
      {purchaseRequests.map((request) => (
        <div
          key={request.id}
          onClick={() => onPurchaseRequestClick?.(request)}
          className={`flex items-center gap-4 p-4 border-b border-[#E5E5EA] transition-colors ${
            request.status !== PURCHASE_REQUEST_STATUS.REJECTED
              ? "hover:bg-[#FAFAFC] cursor-pointer"
              : "cursor-default"
          }`}
        >
          {/* Image and Details */}
          <div className="flex items-center gap-2 flex-1 min-w-[120px] max-w-[240px]">
            {request.asset?.featured_image || request.image ? (
              <img
                src={request.asset?.featured_image || request.image}
                alt={request.asset?.name || request.title || "Asset image"}
                className="w-12 md:w-12 h-12 md:h-12 sm:w-20 sm:h-20 object-cover flex-shrink-0 rounded"
              />
            ) : (
              <div className="w-12 md:w-16 h-12 md:h-16 sm:w-20 sm:h-20 flex items-center justify-center flex-shrink-0 rounded bg-gray-100">
                <FaImage className="text-gray-500 text-lg" />
              </div>
            )}
            <div className="flex-1 min-w-[120px] max-w-[160px]">
              <p className="text-[11px] font-medium text-[#000] mb-1">
                {request.asset?.name || request.title}
              </p>
              <h3 className="text-[15px] font-normal text-[#000] truncate">
                {request.asset?.description
                  ? request.asset.description.length > 50
                    ? request.asset.description.substring(0, 50) + "..."
                    : request.asset.description
                  : "Purchase Request"}
              </h3>
            </div>
          </div>

          {/* Details Grid */}
          <div className="hidden md:grid grid-cols-4 gap-6 flex-1">
            <div>
              <p className="text-[11px] font-semibold text-[#000] mb-1">
                Min. Investment
              </p>
              <p className="text-[14px] font-normal text-[#000]">
                <FormattedNumber value={request.minimumInvestment} />
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[#000] mb-1">
                Asset Type
              </p>
              <p className="text-[14px] font-normal text-[#000]">
                {request.assetType?.title || "—"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[#000] mb-1">
                Expected Term
              </p>
              <p className="text-[14px] font-normal text-[#000]">
                {request.expectedTerm || "—"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[#000] mb-1">
                Expected Yield
              </p>
              <p className="text-[14px] font-normal text-[#000]">
                {request.expectedYield || "—"}
              </p>
            </div>
          </div>

          {/* Arrow */}
          <FaChevronRight className="w-4 h-4 text-[#000] flex-shrink-0 ml-4" />
        </div>
      ))}
    </div>
  );
};

const GridView = ({ purchaseRequests, onPurchaseRequestClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {purchaseRequests.map((request) => (
        <Card
          key={request.id}
          onClick={() => onPurchaseRequestClick?.(request)}
          className={`!p-0 transition-shadow !rounded-[0px] overflow-hidden ${
            request.status !== PURCHASE_REQUEST_STATUS.REJECTED
              ? "cursor-pointer hover:shadow-lg"
              : "cursor-default"
          }`}
        >
          {request.asset?.featured_image || request.image ? (
            <img
              src={request.asset?.featured_image || request.image}
              alt={request.asset?.name || "Asset image"}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 flex items-center justify-center bg-gray-100">
              <FaImage className="text-gray-500 text-lg" />
            </div>
          )}
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-medium text-[#666]">
                {request.asset?.name || "Purchase Request"}
              </p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                  request.status
                )}`}
              >
                {request.status}
              </span>
            </div>
            <h3 className="text-[18px] font-semibold text-[#000] mb-2">
              {request.asset?.name || "Purchase Request"}
            </h3>
            <p className="text-[13px] font-normal text-[#666] line-clamp-3 mb-4">
              {request.asset?.description || "No description available"}
            </p>
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#E5E5EA]">
              <div>
                <p className="text-[11px] font-medium text-[#666] mb-1">
                  Tokens
                </p>
                <p className="text-[14px] font-normal text-[#000]">
                <FormattedNumber value={request.token_requested || request.tokens} />
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-[#666] mb-1">
                  Total Amount
                </p>
                <p className="text-[14px] font-normal text-[#000]">
                  <FormattedNumber value={request.total_amount || request.amount} />
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-[#666] mb-1">
                  Price/Token
                </p>
                <p className="text-[14px] font-normal text-[#000]">
                <FormattedNumber value={request.price_per_token || request.price} />
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-[#666] mb-1">
                  Expires
                </p>
                <p className="text-[14px] font-normal text-[#000]">
                  {formatDate(request.expiration_period)}
                </p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

function InvestorOpportunities() {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'grid'
  const [sortBy, setSortBy] = useState("relevance");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    annualReturn: [],
    investmentTerm: [],
    minimumInvestment: [],
  });

  // Fetch purchase requests from API
  const { data: statsData, isLoading, isError } = useGetInvestorStats();

  // Handle purchase request click - navigate to detail page if not rejected
  const handlePurchaseRequestClick = (request) => {
    if (request.status === PURCHASE_REQUEST_STATUS.REJECTED) {
      return; // Don't navigate for rejected requests
    }
    
    // Try multiple ways to get assetId
    const assetId = request.asset?.id || request.asset_id || request.assetId;
    if (assetId && assetId !== "-" && assetId !== "-0") {
      navigate(`/investor/dashboard/detail/${assetId}`);
    }
  };

  // Get unique asset IDs from purchase requests
  const uniqueAssetIds = useMemo(() => {
    if (!statsData?.data?.purchase_requests && !statsData?.purchase_requests)
      return [];

    const requests =
      statsData?.data?.purchase_requests || statsData?.purchase_requests || [];
    const assetIds = requests
      .map((req) => req.asset?.id)
      .filter((id) => id != null && id !== "");

    // Return unique asset IDs
    return [...new Set(assetIds)];
  }, [statsData]);

  // Fetch asset details for all unique asset IDs in parallel
  const assetDetailsQueries = useQueries({
    queries: uniqueAssetIds.map((assetId) => ({
      queryKey: ["asset-details", assetId],
      queryFn: async () => {
        // axiosInstance interceptor already returns response.data
        return await axiosInstance.get(
          urls.ASSETS.GET_ASSET_DETAILS(assetId)
        );
      },
      enabled: !!assetId,
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      retry: 1,
    })),
  });

  // Create a map of asset ID to asset details (including assetBusinessDetail and assetType)
  const assetDetailsMap = useMemo(() => {
    const map = {};
    assetDetailsQueries.forEach((query, index) => {
      if (query.data && uniqueAssetIds[index]) {
        const assetId = uniqueAssetIds[index];
        map[assetId] = {
          assetBusinessDetail: query.data?.assetBusinessDetail || {},
          assetType: query.data?.assetType || {},
        };
      }
    });
    return map;
  }, [assetDetailsQueries, uniqueAssetIds]);

  // Transform purchase requests to display format
  const purchaseRequests = useMemo(() => {
    if (!statsData?.data?.purchase_requests && !statsData?.purchase_requests)
      return [];

    const requests =
      statsData?.data?.purchase_requests || statsData?.purchase_requests || [];

    return requests.map((request) => {
      const assetId = request.asset?.id;
      const assetDetails = assetDetailsMap[assetId] || {};
      const assetBusinessDetail = assetDetails.assetBusinessDetail || {};
      const assetType = assetDetails.assetType || {};
      const expectedYield = assetBusinessDetail.expected_yield || "0";

      return {
        id: request.id,
        token_requested: request.token_requested,
        asset_id: assetId,
        tokens: request.token_requested??"-0",
        price_per_token: request.price_per_token??"-0"  ,
        price: request.price_per_token??"-0",
        total_amount: request.total_amount??"-0",
        amount: request.total_amount??"-0",
        status: request.status,
        expiration_period: request.expiration_period,
        created_at: request.created_at,
        asset: request.asset || null, // Preserve asset object for navigation
        investor: request.investor || null,
        issuer: request.issuer || null,
        // For compatibility with existing display logic
        title: request.asset?.name??"-",
        category: request.asset?.description
          ? request.asset.description.length > 50
            ? request.asset.description.substring(0, 50) + "..."
            : request.asset.description
          : "Investment",
        image: request.asset?.featured_image,
        description: request.asset?.description || "No description available",
        // Map assetBusinessDetail fields
        assetBusinessDetail: assetBusinessDetail,
        assetType: assetType,
        minimumInvestment: assetBusinessDetail.minimum_investment || "—",
        expectedTerm: assetBusinessDetail.expected_term || "—",
        expectedYield: expectedYield || "—",
        // For advanced filters
        annualReturn: expectedYield || "0%",
        investmentTerm: assetBusinessDetail.expected_term || "0",
        minInvestmentValue: parseFloat(
          (assetBusinessDetail.minimum_investment || "0").replace(/[,$]/g, "")
        ) || 0,
      };
    });
  }, [statsData, assetDetailsMap]);

  // Calculate status counts
  const statusCounts = useMemo(() => {
    const counts = { all: purchaseRequests.length };
    PURCHASE_REQUEST_STATUS_FILTERS.forEach((filter) => {
      if (filter.id !== "all") {
        counts[filter.id] = purchaseRequests.filter(
          (req) => req.status === filter.id
        ).length;
      }
    });
    return counts;
  }, [purchaseRequests]);

  // Filter and sort purchase requests
  const filteredPurchaseRequests = useMemo(() => {
    let filtered = [...purchaseRequests];

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((req) => req.status === selectedStatus);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (req) =>
          req.asset?.name?.toLowerCase().includes(query) ||
          req.asset?.description?.toLowerCase().includes(query) ||
          req.title?.toLowerCase().includes(query) ||
          req.category?.toLowerCase().includes(query)
      );
    }

    // Advanced filters
    if (advancedFilters.annualReturn.length > 0) {
      filtered = filtered.filter((req) => {
        const yieldStr = req.annualReturn || "0%";
        const yieldNum = parseFloat(yieldStr.replace(/[%,]/g, "")) || 0;
        return advancedFilters.annualReturn.some((filterId) => {
          if (filterId === "under-5") return yieldNum < 5;
          if (filterId === "5-10") return yieldNum >= 5 && yieldNum < 10;
          if (filterId === "10-15") return yieldNum >= 10 && yieldNum < 15;
          if (filterId === "over-15") return yieldNum >= 15;
          return false;
        });
      });
    }

    if (advancedFilters.investmentTerm.length > 0) {
      filtered = filtered.filter((req) =>
        advancedFilters.investmentTerm.includes(req.investmentTerm)
      );
    }

    if (advancedFilters.minimumInvestment.length > 0) {
      filtered = filtered.filter((req) => {
        return advancedFilters.minimumInvestment.some((filterId) => {
          const minVal = req.minInvestmentValue;
          if (filterId === "500-1k") return minVal >= 500 && minVal < 1000;
          if (filterId === "1k-5k") return minVal >= 1000 && minVal < 5000;
          if (filterId === "5k-10k") return minVal >= 5000 && minVal < 10000;
          if (filterId === "10k-plus") return minVal >= 10000;
          return false;
        });
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "investment-low":
          return (a.total_amount || 0) - (b.total_amount || 0);
        case "investment-high":
          return (b.total_amount || 0) - (a.total_amount || 0);
        case "tokens-low":
          return (a.token_requested || 0) - (b.token_requested || 0);
        case "tokens-high":
          return (b.token_requested || 0) - (a.token_requested || 0);
        case "date-new":
          return new Date(b.created_at) - new Date(a.created_at);
        case "date-old":
          return new Date(a.created_at) - new Date(b.created_at);
        default:
          return 0;
      }
    });

    return filtered;
  }, [selectedStatus, searchQuery, sortBy, purchaseRequests, advancedFilters]);

  const handleFilterChange = (category, value) => {
    setAdvancedFilters((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleClearAllFilters = () => {
    setAdvancedFilters({
      annualReturn: [],
      investmentTerm: [],
      minimumInvestment: [],
    });
  };

  const hasActiveFilters =
    advancedFilters.annualReturn.length > 0 ||
    advancedFilters.investmentTerm.length > 0 ||
    advancedFilters.minimumInvestment.length > 0;

  if (isLoading) {
    return (
      <div className="bg-white p-4 sm:p-6">
        <div className="text-center py-12">
          <p className="text-[16px] font-medium text-[#666]">
            Loading purchase requests...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white p-4 sm:p-6">
        <div className="text-center py-12">
          <p className="text-[16px] font-medium text-[#666]">
            Error loading purchase requests. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6">
      {/* Status Filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <p className="font-['Montserrat'] text-[13px] font-semibold leading-[150%] text-[var(--Dark-Black,#000)]">
          Status
        </p>
        {PURCHASE_REQUEST_STATUS_FILTERS.map((status) => (
          <button
            key={status.id}
            onClick={() => setSelectedStatus(status.id)}
            className={`flex items-center gap-2 rounded-full px-4 py-1 h-[42px] text-[13px] transition ${
              selectedStatus === status.id
                ? "bg-gradient-to-tr from-[#0734A9] via-[#0E1696] to-[#4B0792] font-semibold text-white"
                : "bg-white border text-[#000] font-semibold hover:bg-[linear-gradient(135deg,rgba(155,60,255,0.06)_0%,rgba(45,103,255,0.06)_100%)] hover:text-[#000]"
            }`}
          >
            {status.label}
            <span
             className={`flex h-5 items-center justify-center rounded-full px-[5px] text-[11px]  ${
              selectedStatus === status.id
                ? "bg-white text-black"
                : "bg-[linear-gradient(135deg,rgba(155,60,255,0.15)_0%,rgba(45,103,255,0.15)_100%)] text-[#000] hover:!bg-white hover:!bg-none"
            }`}
            >
              {statusCounts[status.id] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search purchase requests"
          />
        </div>
        <div className="flex items-center gap-2">
          <SimpleDropdown
            options={SORT_OPTIONS}
            selectedValue={sortBy}
            onChange={setSortBy}
            className="min-w-[150px]"
            label="Sort By"
            placeholder="Sort By"
            showLabelWithValue={false} // This will hide "Sort By:" prefix
          />
          <div className="flex flex-wrap items-center bg-white border text-[#000] font-semibold rounded-[24px] ">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-2 rounded-full p-2 text-[13px] transition ${
                viewMode === "list"
                  ? "border border-blue-800 font-semibold "
                  : "bg-white  text-[#000] font-semibold hover:bg-slate-200"
              }`}
            >
              <img src={ListIcon} alt="List view" className="w-3 h-3" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 rounded-full p-2 text-[13px] transition ${
                viewMode === "grid"
                  ? "border border-blue-800 font-semibold "
                  : "bg-white  text-[#000] font-semibold hover:bg-slate-200"
              }`}
            >
              <img src={GridIcon} alt="Grid view" className="w-3 h-3" />
            </button>
          </div>
          {/* Advanced Filters Button */}
          <button
            onClick={() => setIsFiltersOpen(true)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              hasActiveFilters
                ? "bg-[linear-gradient(135deg,rgba(155,60,255,0.2)_0%,rgba(45,103,255,0.2)_100%)] text-[#5D07B7] border border-[#5D07B7]"
                : "bg-white  text-[#000] hover:border-[#5D07B7]"
            }`}
          >
            <span className="font-['Montserrat'] text-[13px] font-semibold leading-[150%] text-[var(--Dark-Black,#000)]">
              Advanced Filters
            </span>
            <img src={FilterIcon} alt="Filters" className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-[14px] font-normal text-[#666]">
          <span className="text-[#000] font-['Montserrat'] text-[11px] font-medium leading-[150%]">
            Showing
          </span>{" "}
          <span className="text-[#000] font-['Montserrat'] text-[11px] font-[700] leading-[150%]">
            {filteredPurchaseRequests.length} of {purchaseRequests.length}{" "}
            purchase requests
          </span>
        </p>
      </div>

      {/* Purchase Requests List/Grid */}
      {filteredPurchaseRequests.length > 0 ? (
        viewMode === "list" ? (
          <ListView 
            purchaseRequests={filteredPurchaseRequests} 
            onPurchaseRequestClick={handlePurchaseRequestClick}
          />
        ) : (
          <GridView 
            purchaseRequests={filteredPurchaseRequests} 
            onPurchaseRequestClick={handlePurchaseRequestClick}
          />
        )
      ) : (
        <div className="text-center py-12">
          <p className="text-[16px] font-medium text-[#666]">
            No purchase requests found matching your criteria.
          </p>
        </div>
      )}

      {/* Advanced Filters Modal */}
      <AdvancedFiltersModal
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        filters={advancedFilters}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAllFilters}
        resultCount={filteredPurchaseRequests.length}
      />
    </div>
  );
}

export default InvestorOpportunities;
