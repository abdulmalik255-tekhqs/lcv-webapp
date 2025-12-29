import { useGetInvestorStats } from "@/api/investors";
import ukFlagIcon from "@/assets/registrar-assets/flag.svg";
import { EmptyState, SearchBar, TableLoader } from "@/components/shared";
import FeatureCard from "@/components/shared/FeatureCard";
import { useMemo, useState } from "react";
import { FaImage } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import circleButton2 from "../../../assets/investor-assets/grid.svg";
import iconDown from "../../../assets/investor-assets/iconDown.svg";
import circleButton1 from "../../../assets/investor-assets/list.svg";
import useFormatNumber from "@/hooks/useFormatNumber";

// Formatted Number Component
const FormattedNumber = ({ value }) => {
  const formatted = useFormatNumber(value, { abbreviate: true, decimals: 1 });
  return <>{formatted}</>;
};  

const FILTERS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "funded", label: "Funded" },
  { id: "exited", label: "Exited" },
  { id:"Awaiting Verification", label: "Awaiting Verification" },
];
const FILTERS_BUTTONS = [
  {
    id: 1,
    label: <img src={circleButton2} alt="Circle Button" className="h-3 w-3" />,
  },
  {
    id: 2,
    label: (
      <img src={circleButton1} alt="Circle Button 2" className="h-3 w-3" />
    ),
  },
];

// Map API status to component status
const mapStatus = (apiStatus) => {
  const statusMap = {
    "Awaiting Verification": "Awaiting Verification",
    "Pending": "Awaiting Verification",
    "Pending Approval": "Awaiting Verification",
    "Approved": "Funded",
    "Funded": "Funded",
    "Exited": "Exited",
    "Cancelled": "Exited",
  };
  return statusMap[apiStatus] || "Active";
};

function PortfolioTable() {
  const [activeFilter, setActiveFilter] = useState(FILTERS[0].id);
  const [viewMode, setViewMode] = useState("table"); // New state for view mode
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Fetch data from API
  const { data: statsData, isLoading, isError } = useGetInvestorStats();

  // Transform purchase_requests to investment format
  const investments = useMemo(() => {
    if (!statsData?.purchase_requests) return [];
    
    return statsData.purchase_requests.map((request) => {
      const asset = request.asset || {};
      const currentValue = request.token_requested * request.price_per_token;
      const returnAmount = currentValue - request.total_amount;
      const returnPercentage = request.total_amount > 0 
        ? ((returnAmount / request.total_amount) * 100).toFixed(1)
        : "0.0";
      
      return {
        id: asset.id || request.id,
        purchaseRequestId: request.id,
        name: asset.name || "Unknown Asset",
        img: asset.featured_image || null,
        email: asset.description 
          ? asset.description.substring(0, 50) + (asset.description.length > 50 ? "..." : "")
          : "Investment",
        category: asset.description 
          ? asset.description.substring(0, 50) + (asset.description.length > 50 ? "..." : "")
          : "Investment",
        location: "Global",
        type: "individual",
        assetsHeld: request.total_amount,
        totalTokens: request.token_requested,
        totalValue: currentValue,
        returnValue: returnAmount >= 0 
          ? `+${returnAmount} (+${returnPercentage}%)`
          : `${returnAmount} (${returnPercentage}%)`,
        status: mapStatus(request.status),
        l_heading: asset.id || request.id,
        assetType: "Equity",
        expectedTerm: "Ongoing",
        expectedYield: `${returnPercentage}%`,
        description: asset.description || `Your investment in ${asset.name || "this asset"}. You own ${request.token_requested} tokens. Current value: ${currentValue}.`,
      };
    });
  }, [statsData]);

  const filterCounts = useMemo(() => {
    const base = { all: investments.length };
    FILTERS.forEach((filter) => {
      if (filter.id !== "all") {
        base[filter.id] = investments.filter(
          (investment) =>
            investment.status.toLowerCase() === filter.id.toLowerCase()
        ).length;
      }
    });
    return base;
  }, [investments]);

  const visibleInvestments = useMemo(() => {
    let filtered =
      activeFilter === "all"
        ? investments
        : investments.filter(
            (investment) =>
              investment.status.toLowerCase() === activeFilter.toLowerCase()
          );

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (investment) =>
          investment.name?.toLowerCase().includes(term) ||
          investment.email?.toLowerCase().includes(term) ||
          investment.l_heading?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [activeFilter, searchTerm, investments]);

  return (
    <div className="p-4 sm:p-6 md:py-[40px] md:px-[25px] bg-[#FFF]">
      <div className="px-[15px] flex flex-col items-start  gap-[24px]">
        <div className="text-[#0A0A0A] font-['Atacama_Trial_VAR'] text-[24px] font-normal not-italic leading-[120%]">
          My Investments
        </div>

        <div className="border-none !p-0 mb-6 w-full">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
            <div className="flex flex-wrap items-center gap-2 ">
              {FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] transition ${
                    activeFilter === filter.id
                      ? "bg-gradient-to-tr from-[#0734A9] via-[#0E1696] to-[#4B0792] font-semibold text-white"
                      : "bg-white border text-[#000] font-semibold hover:bg-slate-200"
                  }`}
                >
                  {filter.label}
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[12px]  ${
                      activeFilter === filter.id
                        ? "bg-white text-black"
                        : "bg-[linear-gradient(135deg,rgba(155,60,255,0.15)_0%,rgba(45,103,255,0.15)_100%)] text-[#000]"
                    }`}
                  >
                    {filter.id === "all"
                      ? filterCounts.all
                      : filterCounts[filter.id] || 0}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 flex-1 justify-center ">
              <div className="w-full md:w-[50%] ">
                <SearchBar
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search opportunities"
                />
              </div>
              <div className="text-[#000] text-[15px] font-[700] flex items-center gap-2 px-[15px] cursor-pointer">
                Sort by{" "}
                <span>
                  <img src={iconDown} sizes="60px" className="w-3 h-3" />
                </span>
              </div>
              <div className="flex flex-wrap items-center bg-white border text-[#000] font-semibold rounded-[24px] ">
                {FILTERS_BUTTONS.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => {
                      if (filter.id === 1) {
                        setViewMode("grid");
                      } else {
                        setViewMode("table");
                      }
                    }}
                    className={`flex items-center gap-2 rounded-full p-2 text-[13px] transition ${
                      (filter.id === 1 && viewMode === "grid") ||
                      (filter.id === 2 && viewMode === "table")
                        ? "border border-blue-800 font-semibold "
                        : "bg-white  text-[#000] font-semibold hover:bg-slate-200"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-4 text-[#000] font-['Montserrat'] text-[11px] font-[500] leading-[150%]">
            Showing{" "}
            <span className="text-[#000] font-['Montserrat'] text-[11px] font-bold leading-[150%]">
              {visibleInvestments.length} of {investments.length}{" "}
              opportunities
            </span>{" "}
          </div>
        </div>
      </div>

      {/* Conditionally render the table only when viewMode is "table" */}
      {viewMode === "table" && (
        <div className="bg-white rounded-lg border border-[#E5E5EA] overflow-hidden">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="mx-auto w-full max-w-full rounded-[12px] bg-white">
                <TableLoader message="Loading investments..." />
              </div>
            ) : isError ? (
              <div className="mx-auto w-full max-w-full rounded-[12px] border border-dashed border-[#CBD5F5] bg-white p-8">
                <div className="text-center text-red-500">
                  Error loading investments. Please try again.
                </div>
              </div>
            ) : visibleInvestments.length === 0 ? (
              <div className="mx-auto w-full max-w-full rounded-[12px] border border-dashed border-[#CBD5F5] bg-white">
                <EmptyState />
              </div>
            ) : (
              <table className="w-full text-left text-[13px] border border-[#E5E5EA]">
                <thead className="bg-[#FAFAFC] border-b border-[#E5E5EA]">
                  <tr className="text-[var(--Dark-Black,#000)] font-['Montserrat'] text-[13px] font-bold leading-[150%]">
                    <th className="px-4 py-3 text-left">Asset</th>
                    <th className="px-4 py-3 text-left">Your Investment</th>
                    <th className="px-4 py-3 text-left">Tokens Owned</th>
                    <th className="px-4 py-3 text-left">Current Value</th>
                    <th className="px-4 py-3 text-left">Return</th>
                    <th className="px-4 py-3 text-left">Status</th>

                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {visibleInvestments.map((investment, index) => {
                    const handleRowClick = () =>
                      navigate(`/investor/portfolio/details/${investment.id}`);
                 
                    return (
                      <tr
                        key={`${investment.id}-${index}-${investment.name}`}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={handleRowClick}
                      >
                        <td className="px-4 py-5">
                          <div className="flex items-center pr-[15px] gap-[10px]">
                            <div className="flex-shrink-0  bg-[#FAFAFC]  p-[4px] flex max-w-[60px] h-[65px] justify-center items-center aspect-square overflow-hidden rounded">
                              {investment.img ? (
                                <img
                                  src={investment.img}
                                  alt={investment.name}
                                  className="w-full h-full object-cover min-w-full min-h-full"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                  <FaImage className="text-gray-500 text-lg" />
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col gap-1">
                              <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[var(--Dark-Black,#000)] font-['Montserrat'] text-[15px] font-medium leading-[150%]">
                                {investment.name}
                              </div>
                              <div className="overflow-hidden text-ellipsis text-[var(--dark-gray-3,#48484A)] font-['Montserrat'] text-[13px] font-normal leading-[150%]">
                                {investment.email}
                              </div>
                              <div className="overflow-hidden text-ellipsis text-[var(--dark-gray-3,#48484A)] font-['Montserrat'] text-[13px] font-normal leading-[150%]">
                                {investment.l_heading}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="overflow-hidden text-ellipsis text-left ps-4 text-[var(--Dark-Black,#000)] font-['Montserrat'] text-[15px] font-medium leading-[150%]">
                          <FormattedNumber value={investment.assetsHeld} />
                        </td>

                        <td className="overflow-hidden text-ellipsis text-left ps-4 text-[var(--Dark-Black,#000)] font-['Montserrat'] text-[15px] font-medium not-italic leading-[150%]">
                          <FormattedNumber value={investment.totalTokens} />
                        </td>
                        <td className="overflow-hidden text-ellipsis text-left ps-4 text-[var(--Dark-Black,#000)] font-['Montserrat'] text-[15px] font-medium not-italic leading-[150%]">
                          <FormattedNumber value={investment.totalValue} />
                        </td>
                        <td className="overflow-hidden text-ellipsis text-left ps-4 text-[var(--Light-Green,#248A3D)] font-['Montserrat'] text-[15px] font-medium not-italic leading-[150%]">
                          <FormattedNumber value={investment.returnValue} />
                        </td>
                        <td className="px-4 py-4 text-[15px] text-[#000] font-medium">
                          <div
                            className={`flex h-6 px-[10px] justify-center items-center rounded-[99px] ${
                              investment.status === "Active"
                                ? "bg-[rgba(131,246,59,0.2)]"
                                : investment.status === "Exited"
                                ? "bg-[#F2F2F7] border border-[#D1D1D6]"
                                : investment.status === "Funded"
                                ? "bg-gradient-to-br from-[rgba(155,60,255,0.1)] to-[rgba(45,103,255,0.1)]"
                                : investment.status === "Awaiting Verification"
                                ? "bg-[rgba(255,193,7,0.2)] border border-[rgba(255,193,7,0.5)]"
                                : ""
                            }`}
                          >
                            <span className="text-[var(--Dark-Black,#000)] font-['Montserrat'] text-[11px] font-semibold not-italic leading-[150%]">
                              {investment.status}
                            </span>
                          </div>
                        </td>

                        {/* <td className="px-4 py-5">
                          <HiChevronRight className="h-5 w-5 text-[#666]" />
                        </td> */}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="w-full">
          {isLoading ? (
            <div className="mx-auto w-full max-w-full rounded-[12px] bg-white py-12">
              <TableLoader message="Loading investments..." />
            </div>
          ) : isError ? (
            <div className="mx-auto w-full max-w-full rounded-[12px] border border-dashed border-[#CBD5F5] bg-white p-8 py-12">
              <div className="text-center text-red-500">
                Error loading investments. Please try again.
              </div>
            </div>
          ) : visibleInvestments.length === 0 ? (
            <div className="mx-auto w-full max-w-full rounded-[12px] border border-dashed border-[#CBD5F5] bg-white py-12">
              <EmptyState />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleInvestments.map((investment, index) => {
                const handleCardClick = () =>
                  navigate(`/investor/portfolio/details/${investment.id}`);

                return (
                  <FeatureCard
                    key={`${investment.id}-${index}-${investment.name}`}
                    image={investment.img}
                    category={investment.category || investment.email || "Investment"}
                    location={investment.location || "Global"}
                    locationIcon={ukFlagIcon}
                    title={investment.name}
                    description={investment.description || `Your investment in ${investment.name}. ${
                      investment.totalTokens
                        ? `You own ${investment.totalTokens} tokens. `
                        : ""
                    }${
                      investment.totalValue
                        ? `Current value: ${investment.totalValue}. `
                        : ""
                    }`}
                    minInvestment={investment.assetsHeld}
                    assetType={investment.assetType || investment.email || "Equity"}
                    expectedTerm={investment.expectedTerm || "Ongoing"}
                    expectedYield={investment.expectedYield || investment.returnValue}
                    onClick={handleCardClick}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PortfolioTable;
