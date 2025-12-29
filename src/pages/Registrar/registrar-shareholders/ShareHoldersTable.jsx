import { EmptyState, SearchBar } from "@/components/shared";
import { SHAREHOLDERS_DATA } from "@/constants/registrar";
import { useMemo, useState } from "react";
import { HiMagnifyingGlass, HiArrowTopRightOnSquare } from "react-icons/hi2";
import { HiChevronRight } from "react-icons/hi";
import { FaBuilding, FaUser } from "react-icons/fa6";
import Arrowdown from "../../../assets/admin-assets/arrow-down.svg";
import { useNavigate } from "react-router-dom";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "institutional", label: "Institutions" },
  { id: "individual", label: "Individuals" },
];

const typeFilterMap = {
  all: "all",
  institutional: "institutional",
  individual: "individual",
};


function ShareHoldersTable() {
  const [activeFilter, setActiveFilter] = useState(FILTERS[0].id);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const filterCounts = useMemo(() => {
    const base = { all: SHAREHOLDERS_DATA.length };
    FILTERS.forEach((filter) => {
      if (filter.id !== "all") {
        base[filter.id] = SHAREHOLDERS_DATA.filter(
          (shareholder) => shareholder.type === typeFilterMap[filter.id]
        ).length;
      }
    });
    return base;
  }, []);

  const visibleShareholders = useMemo(() => {
    const filtered =
      activeFilter === "all"
        ? SHAREHOLDERS_DATA
        : SHAREHOLDERS_DATA.filter(
            (shareholder) => shareholder.type === typeFilterMap[activeFilter]
          );

    if (!searchTerm.trim()) {
      return filtered;
    }

    const term = searchTerm.toLowerCase();
    return filtered.filter(
      (shareholder) =>
        shareholder.name.toLowerCase().includes(term) ||
        shareholder.email.toLowerCase().includes(term)
    );
  }, [activeFilter, searchTerm]);

  const handleExportCSV = () => {
    // CSV export functionality
    const headers = ["Shareholder", "Email", "Type", "Assets Held", "Total Tokens", "Total Value"];
    
    const csvContent = [
      headers.join(","),
      ...visibleShareholders.map((shareholder) =>
        [
          shareholder.name,
          shareholder.email,
          shareholder.type,
          shareholder.assetsHeld,
          shareholder.totalTokens,
          shareholder.totalValue,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "shareholders.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
      <div className="p-4 sm:p-6">
        <div className="border-none  !p-0 mb-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
            <div className="flex flex-wrap items-center gap-2">
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

            <div className="flex items-center gap-4 flex-1 justify-end">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 text-[13px] font-medium text-[#000] hover:opacity-80 transition"
              >
                Export CSV
                <HiArrowTopRightOnSquare className="h-4 w-4" />
              </button>
              <div className="w-full md:w-[85%]">
                <SearchBar
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#E5E5EA] overflow-hidden">
          <div className="overflow-x-auto">
            {visibleShareholders.length === 0 ? (
              <div className="mx-auto w-full max-w-full rounded-[12px] border border-dashed border-[#CBD5F5] bg-white">
                <EmptyState />
              </div>
            ) : (
              <table className="w-full text-left text-[13px] border border-[#E5E5EA]">
                <thead className="bg-[#FAFAFC] border-b border-[#E5E5EA]">
                  <tr className="text-[13px] font-[700]">
                    <th className="px-4 py-3 text-left">Shareholder</th>
                    <th className="px-4 py-3 text-left">Assets Held</th>
                    <th className="px-4 py-3 text-left">Total Tokens</th>
                    <th className="px-4 py-3 text-left">
                      <div className="flex items-center gap-1">
                        Total Value
                        <img
                          src={Arrowdown}
                          alt="Arrowdown"
                          className="h-3 w-3 mt-1 text-slate-400"
                        />
                      </div>
                    </th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {visibleShareholders.map((shareholder) => {
                    const handleRowClick = () => {
                      navigate(`/registrar/shareholders/details/${shareholder.id}`);
                    };

                    const IconComponent = shareholder.type === "institutional" ? FaBuilding : FaUser;

                    return (
                      <tr
                        key={shareholder.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={handleRowClick}
                      >
                        <td className="px-4 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 border border-[#E5E5EA] bg-[#FAFAFC] rounded-md p-2">
                              <IconComponent className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <div className="font-medium text-[#000]">
                                {shareholder.name}
                              </div>
                              <div className="text-[13px] text-[#48484A]">
                                {shareholder.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-5 text-[15px] text-[#000] font-medium">
                          {shareholder.assetsHeld}
                        </td>
                        <td className="px-4 py-5 text-[15px] text-[#000] font-medium">
                          {shareholder.totalTokens}
                        </td>
                        <td className="px-4 py-5 text-[15px] text-[#000] font-medium">
                          {shareholder.totalValue}
                        </td>
                        <td className="px-4 py-5">
                          <HiChevronRight className="h-5 w-5 text-[#666]" />
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
  );
}

export default ShareHoldersTable;
