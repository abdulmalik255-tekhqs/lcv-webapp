import { EmptyState, SearchBar } from "@/components/shared";
import { ISSUERS_DATA } from "@/constants/registrar";
import { useMemo, useState } from "react";
import { HiMagnifyingGlass, HiArrowTopRightOnSquare } from "react-icons/hi2";
import { HiChevronRight } from "react-icons/hi";
import Arrowdown from "../../../assets/admin-assets/arrow-down.svg";
import { useNavigate } from "react-router-dom";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
];

const statusFilterMap = {
  all: "All",
  active: "Active",
  inactive: "Inactive",
};



function IssuersTable() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState(FILTERS[0].id);
  const [searchTerm, setSearchTerm] = useState("");

  const filterCounts = useMemo(() => {
    const base = { all: ISSUERS_DATA.length };
    FILTERS.forEach((filter) => {
      if (filter.id !== "all") {
        base[filter.id] = ISSUERS_DATA.filter(
          (issuer) => issuer.status === statusFilterMap[filter.id]
        ).length;
      }
    });
    return base;
  }, []);

  const visibleIssuers = useMemo(() => {
    const filtered =
      activeFilter === "all"
        ? ISSUERS_DATA
        : ISSUERS_DATA.filter(
            (issuer) => issuer.status === statusFilterMap[activeFilter]
          );

    if (!searchTerm.trim()) {
      return filtered;
    }

    const term = searchTerm.toLowerCase();
    return filtered.filter(
      (issuer) =>
        issuer.issuer.toLowerCase().includes(term) ||
        issuer.issuerEmail.toLowerCase().includes(term)
    );
  }, [activeFilter, searchTerm]);

  const isAllView = activeFilter === "all";

  const handleExportCSV = () => {
    // CSV export functionality
    const headers = isAllView
      ? ["Issuer", "Email", "Assets", "Total Tokens Issued", "Last Active", "Payment Status"]
      : ["Issuer", "Email", "Assets", "Capital Target", "Submitted", "Payment Status"];
    
    const csvContent = [
      headers.join(","),
      ...visibleIssuers.map((issuer) =>
        [
          issuer.issuer,
          issuer.issuerEmail,
          issuer.assets,
          isAllView ? issuer.totalTokensIssued : issuer.capitalTarget,
          isAllView ? issuer.lastActive : issuer.submitted,
          issuer.paymentStatus,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "issuers.csv");
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
            {visibleIssuers.length === 0 ? (
              <div className="mx-auto w-full max-w-full rounded-[12px] border border-dashed border-[#CBD5F5] bg-white">
                <EmptyState />
              </div>
            ) : (
              <table className="w-full text-left text-[13px] ">
                <thead className="bg-[#FAFAFC] border-b border-[#E5E5EA]">
                  <tr className="text-[13px] font-[700]">
                    <th className="px-4 py-3 text-left">Issuer</th>
                    <th className="px-4 py-3 text-left">Assets</th>
                    {isAllView ? (
                      <>
                        <th className="px-4 py-3 text-left">Total Tokens Issued</th>
                        <th className="px-4 py-3 text-left">
                          <div className="flex items-center gap-1">
                            Last Active
                            <img
                              src={Arrowdown}
                              alt="Arrowdown"
                              className="h-3 w-3 mt-1 text-slate-400"
                            />
                          </div>
                        </th>
                      </>
                    ) : (
                      <>
                        <th className="px-4 py-3 text-left">Capital Target</th>
                        <th className="px-4 py-3 text-left">
                          <div className="flex items-center gap-1">
                            Submitted
                            <img
                              src={Arrowdown}
                              alt="Arrowdown"
                              className="h-3 w-3 mt-1 text-slate-400"
                            />
                          </div>
                        </th>
                      </>
                    )}
                    <th className="px-4 py-3 text-left">Payment Status</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {visibleIssuers.map((issuer) => {
                    const handleRowClick = () => {
                      // Navigate to issuer details page when route is set up
                      navigate(`/registrar/issuers/details/${issuer.id}`);
                    };

                    return (
                      <tr
                        key={issuer.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={handleRowClick}
                      >
                        <td className="px-4 py-5">
                          <div className="font-medium text-[#000]">
                            {issuer.issuer}
                          </div>
                          <div className="text-[13px] text-[#48484A]">
                            {issuer.issuerEmail}
                          </div>
                        </td>
                        <td className="px-4 py-5 text-[15px] text-[#000] font-medium">
                          {issuer.assets}
                        </td>
                        {isAllView ? (
                          <>
                            <td className="px-4 py-5 text-[15px] text-[#000] font-medium">
                              {issuer.totalTokensIssued}
                            </td>
                            <td className="px-4 py-5 text-[15px] text-[#000] font-medium">
                              {issuer.lastActive}
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-4 py-5 text-[15px] text-[#000] font-medium">
                              {issuer.capitalTarget}
                            </td>
                            <td className="px-4 py-5 text-[15px] text-[#000] font-medium">
                              {issuer.submitted}
                            </td>
                          </>
                        )}
                        <td className="px-4 py-5">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] ${
                              issuer.paymentStatus === "Active"
                                ? "bg-[#26E92D33] text-[#000] !font-semibold border border-[#26E92D33]"
                                : "bg-[#F5F5F5] text-[#000] !font-semibold border border-[#E5E5EA]"
                            }`}
                          >
                            {issuer.paymentStatus}
                          </span>
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

export default IssuersTable;
