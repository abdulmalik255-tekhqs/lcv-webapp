import React, { useState, useMemo } from "react";
import { Button, SearchBar, Dropdown, Card } from "@/components/shared";
import GenericModal from "@/components/shared/GenericModal";
import { FaChevronRight, FaChevronDown } from "react-icons/fa6";
import ListIcon from "@/assets/investor-assets/list.svg";
import GridIcon from "@/assets/investor-assets/grid.svg";
import FilterIcon from "@/assets/investor-assets/filter.svg";
import SwapIcon from "@/assets/investor-assets/swap.svg";
import {
  OPPORTUNITIES,
  STATUS_FILTERS,
  INDUSTRY_OPTIONS,
  SORT_OPTIONS,
  ANNUAL_RETURN_FILTERS,
  INVESTMENT_TERM_FILTERS,
  MINIMUM_INVESTMENT_FILTERS,
} from "./constants";

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

const ListView = ({ opportunities, onOpportunityClick }) => {
  return (
    <div className="space-y-0">
      {opportunities.map((opportunity) => (
        <div
          key={opportunity.id}
          onClick={() => onOpportunityClick?.(opportunity)}
          className="flex items-center gap-4 p-4 border-b border-[#E5E5EA] hover:bg-[#FAFAFC] cursor-pointer transition-colors"
        >
          {/* Image and Details */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <img
              src={opportunity.image}
              alt={opportunity.title}
              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium text-[#666] mb-1">
                {opportunity.category}
              </p>
              <h3 className="text-[15px] font-semibold text-[#000] truncate">
                {opportunity.title}
              </h3>
            </div>
          </div>

          {/* Details Grid */}
          <div className="hidden md:grid grid-cols-4 gap-6 flex-1">
            <div>
              <p className="text-[11px] font-medium text-[#666] mb-1">
                Min. Investment
              </p>
              <p className="text-[14px] font-normal text-[#000]">
                {opportunity.minInvestment}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-[#666] mb-1">
                Asset Type
              </p>
              <p className="text-[14px] font-normal text-[#000]">
                {opportunity.assetType}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-[#666] mb-1">
                Expected Term
              </p>
              <p className="text-[14px] font-normal text-[#000]">
                {opportunity.expectedTerm}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-[#666] mb-1">
                Expected Yield
              </p>
              <p className="text-[14px] font-normal text-[#000]">
                {opportunity.expectedYield}
              </p>
            </div>
          </div>

          {/* Arrow */}
          <FaChevronRight className="w-5 h-5 text-[#666] flex-shrink-0 ml-4" />
        </div>
      ))}
    </div>
  );
};

const GridView = ({ opportunities, onOpportunityClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {opportunities.map((opportunity) => (
        <Card
          key={opportunity.id}
          onClick={() => onOpportunityClick?.(opportunity)}
          className="!p-0 cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
        >
          <img
            src={opportunity.image}
            alt={opportunity.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-medium text-[#666]">
                {opportunity.category}
              </p>
              <p className="text-[11px] font-medium text-[#666]">
                {opportunity.location}
              </p>
            </div>
            <h3 className="text-[18px] font-semibold text-[#000] mb-2">
              {opportunity.title}
            </h3>
            <p className="text-[13px] font-normal text-[#666] line-clamp-3 mb-4">
              {opportunity.description}
            </p>
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#E5E5EA]">
              <div>
                <p className="text-[11px] font-medium text-[#666] mb-1">
                  Min. Investment
                </p>
                <p className="text-[14px] font-normal text-[#000]">
                  {opportunity.minInvestment}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-[#666] mb-1">
                  Asset Type
                </p>
                <p className="text-[14px] font-normal text-[#000]">
                  {opportunity.assetType}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-[#666] mb-1">
                  Expected Term
                </p>
                <p className="text-[14px] font-normal text-[#000]">
                  {opportunity.expectedTerm}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-[#666] mb-1">
                  Expected Yield
                </p>
                <p className="text-[14px] font-normal text-[#000]">
                  {opportunity.expectedYield}
                </p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

function InvestorOpportunitiesTable() {
  const [selectedStatus, setSelectedStatus] = useState("available");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'grid'
  const [sortBy, setSortBy] = useState("relevance");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    annualReturn: [],
    investmentTerm: [],
    minimumInvestment: [],
  });

  // Filter and sort opportunities
  const filteredOpportunities = useMemo(() => {
    let filtered = [...OPPORTUNITIES];

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((opp) => opp.status === selectedStatus);
    }

    // Industry filter
    if (selectedIndustry !== "all") {
      filtered = filtered.filter((opp) => opp.industry === selectedIndustry);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (opp) =>
          opp.title.toLowerCase().includes(query) ||
          opp.category.toLowerCase().includes(query) ||
          opp.description.toLowerCase().includes(query) ||
          opp.location.toLowerCase().includes(query)
      );
    }

    // Advanced filters
    if (advancedFilters.annualReturn.length > 0) {
      filtered = filtered.filter((opp) => {
        const yieldNum = parseFloat(opp.annualReturn.replace("%", ""));
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
      filtered = filtered.filter((opp) =>
        advancedFilters.investmentTerm.includes(opp.investmentTerm)
      );
    }

    if (advancedFilters.minimumInvestment.length > 0) {
      filtered = filtered.filter((opp) => {
        return advancedFilters.minimumInvestment.some((filterId) => {
          const minVal = opp.minInvestmentValue;
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
        case "yield-high":
          return (
            parseFloat(b.expectedYield.replace("%", "")) -
            parseFloat(a.expectedYield.replace("%", ""))
          );
        case "yield-low":
          return (
            parseFloat(a.expectedYield.replace("%", "")) -
            parseFloat(b.expectedYield.replace("%", ""))
          );
        case "investment-low":
          return a.minInvestmentValue - b.minInvestmentValue;
        case "investment-high":
          return b.minInvestmentValue - a.minInvestmentValue;
        case "term-short":
          const termA =
            a.expectedTerm === "Perpetual" ? 999 : parseInt(a.expectedTerm);
          const termB =
            b.expectedTerm === "Perpetual" ? 999 : parseInt(b.expectedTerm);
          return termA - termB;
        case "term-long":
          const termA2 =
            a.expectedTerm === "Perpetual" ? 999 : parseInt(a.expectedTerm);
          const termB2 =
            b.expectedTerm === "Perpetual" ? 999 : parseInt(b.expectedTerm);
          return termB2 - termA2;
        default:
          return 0;
      }
    });

    return filtered;
  }, [selectedStatus, selectedIndustry, searchQuery, sortBy, advancedFilters]);

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

  return (
    <div className="bg-white p-4 sm:p-6">
      {/* Status Filters */}
      <div className="flex flex-row gap-2 mb-4">
        <div className="flex flex-wrap items-center gap-2">
        {STATUS_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedStatus(filter.id)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] transition ${
                    selectedStatus === filter.id
                      ? "bg-gradient-to-tr from-[#0734A9] via-[#0E1696] to-[#4B0792] font-semibold text-white"
                      : "bg-white border text-[#000] font-semibold hover:bg-slate-200"
                  }`}
                >
                  {filter.label}
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[12px]  ${
                      selectedStatus === filter.id
                        ? "bg-white text-black"
                        : "bg-[linear-gradient(135deg,rgba(155,60,255,0.15)_0%,rgba(45,103,255,0.15)_100%)] text-[#000]"
                    }`}
                  >
                    {filter.id === "available"
                      ? STATUS_FILTERS.length
                      : STATUS_FILTERS.find((status) => status.id === filter.id)?.count || 0}
                  </span>
                </button>
              ))}
        </div>

        {/* Industry Filter */}
        <div className="mb-4">
          <Dropdown
            label="Industry"
            options={INDUSTRY_OPTIONS}
            selectedValue={selectedIndustry}
            onChange={setSelectedIndustry}
            className="max-w-xs !border-none"
            hideLabel
            placeholder="Industry: All"
          />
        </div>
      </div>
      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search opportunities"
          />
        </div>
        <div className="flex items-center gap-2">
          <Dropdown
            options={SORT_OPTIONS}
            selectedValue={sortBy}
            onChange={setSortBy}
            className="min-w-[150px]"
            hideLabel
            placeholder="Sort By"
          />
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "list"
                ? "bg-[linear-gradient(135deg,rgba(155,60,255,0.2)_0%,rgba(45,103,255,0.2)_100%)] border border-[#5D07B7]"
                : "bg-white border border-[#E5E5EA] hover:border-[#5D07B7]"
            }`}
          >
            <img src={ListIcon} alt="List view" className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "grid"
                ? "bg-[linear-gradient(135deg,rgba(155,60,255,0.2)_0%,rgba(45,103,255,0.2)_100%)] border border-[#5D07B7]"
                : "bg-white border border-[#E5E5EA] hover:border-[#5D07B7]"
            }`}
          >
            <img src={GridIcon} alt="Grid view" className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsFiltersOpen(true)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              hasActiveFilters
                ? "bg-[linear-gradient(135deg,rgba(155,60,255,0.2)_0%,rgba(45,103,255,0.2)_100%)] text-[#5D07B7] border border-[#5D07B7]"
                : "bg-white border border-[#E5E5EA] text-[#000] hover:border-[#5D07B7]"
            }`}
          >
            <img src={FilterIcon} alt="Filters" className="w-4 h-4" />
            Advanced Filters
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-[14px] font-normal text-[#666]">
          Showing {filteredOpportunities.length} of {OPPORTUNITIES.length}{" "}
          opportunities
        </p>
      </div>

      {/* Opportunities List/Grid */}
      {filteredOpportunities.length > 0 ? (
        viewMode === "list" ? (
          <ListView opportunities={filteredOpportunities} />
        ) : (
          <GridView opportunities={filteredOpportunities} />
        )
      ) : (
        <div className="text-center py-12">
          <p className="text-[16px] font-medium text-[#666]">
            No opportunities found matching your criteria.
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
        resultCount={filteredOpportunities.length}
      />
    </div>
  );
}

export default InvestorOpportunitiesTable;
