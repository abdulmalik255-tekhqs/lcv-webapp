import { EmptyState, SearchBar } from "@/components/shared";
import SubHeading from "@/components/shared/subheading";
import { TOKENIZATION_REQUESTS_DATA } from "@/constants/registrar";
import { useMemo, useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import Arrowdown from "../../../assets/admin-assets/arrow-down.svg";
const FILTERS = [
  { id: "pending", label: "Pending Review" },
  { id: "minted", label: "Ready to Mint" },
];

const statusFilterMap = {
  pending: "Pending Review",
  minted: "Ready to Mint",
};



function RegistrarTokenizationRequestsSection() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState(FILTERS[0].id);
  const [searchTerm, setSearchTerm] = useState("");

  const filterCounts = useMemo(() => {
    const base = { all: TOKENIZATION_REQUESTS_DATA.length };
    FILTERS.forEach((filter) => {
      base[filter.id] = TOKENIZATION_REQUESTS_DATA.filter(
        (asset) => asset.status === statusFilterMap[filter.id]
      ).length;
    });
    return base;
  }, []);

  const visibleAssets = useMemo(() => {
    const filtered =
      activeFilter === "all"
        ? TOKENIZATION_REQUESTS_DATA
        : TOKENIZATION_REQUESTS_DATA.filter(
            (asset) => asset.status === statusFilterMap[activeFilter]
          );

    if (!searchTerm.trim()) {
      return filtered;
    }

    const term = searchTerm.toLowerCase();
    return filtered.filter(
      (asset) =>
        asset.name.toLowerCase().includes(term) ||
        asset.category.toLowerCase().includes(term) ||
        asset.assetId.toLowerCase().includes(term) ||
        asset.issuer.toLowerCase().includes(term) ||
        asset.issuerEmail.toLowerCase().includes(term)
    );
  }, [activeFilter, searchTerm]);

  return (
    <div className="bg-white border rounded-tr-[24px] min-h-[calc(100vh-100px)]">
       <div className="flex items-center justify-between bg-[#FFFFFF] rounded-tr-[24px] px-5 pt-6 ">
        <div className="pl-4 mt-2 mb-2">
          <div className="text-start text-[32px] font-normal font-['Atacama'] leading-[120%] tracking-[0.48px] text-[#000]">
            Tokenization Requests
          </div>
          <SubHeading className="text-start !py-0 mt-[10px] !text-[#000]">
            Review and manage tokenization requests.
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
            {visibleAssets.length === 0 ? (
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
                    <th className="px-4 py-3 text-left">Issuer</th>
                    <th className="px-4 py-3 text-left">
                      Initial Mint / Total Supply
                    </th>
                    <th className="px-4 py-3 text-left">Capital Target</th>
                    <th className="px-4 py-3 text-left">
                      <div className="flex items-center gap-1">
                        Latest Update{" "}
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
                  {visibleAssets.map((asset) => {
                    const IconComponent = asset.icon;

                    const handleRowClick = () => {
                      switch (asset.statusType) {
                        case "pending":
                          navigate(
                            `/registrar/tokenization-requests/pending-review/${asset.id}`
                          );
                          break;

                        case "minted":
                          navigate(
                            `/registrar/tokenization-requests/minted-details/${asset.id}`
                          );
                          break;

                        default:
                          break;
                      }
                    };

                    return (
                      <tr
                        key={asset.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={handleRowClick}
                      >
                        <td className="px-3 py-5">
                          <div className="flex items-center gap-2">
                            <div className="flex-shrink-0 border border-[#E5E5EA]  bg-[#FAFAFC] rounded-md p-4 ">
                              <IconComponent className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
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
                        <td className="px-3 py-5">
                          <div className="font-medium text-[#000]">
                            {asset.issuer}
                          </div>
                          <div className="text-[13px] text-[#48484A]">
                            {asset.issuerEmail}
                          </div>
                        </td>
                        <td className="px-3 py-5 text-[#000]">
                          <span className="text-[15px] text-[#000] font-medium pr-1">
                            {asset.initialMint}
                          </span>
                          <span className="text-[15px] text-[#48484A]">/</span>
                          <span className="text-[15px] text-[#48484A] font-medium pl-1">
                            {asset.totalSupply}
                          </span>
                        </td>
                        <td className="px-3 py-5 text-[15px] text-[#000] font-medium">
                          {asset.capitalTarget}
                        </td>
                        <td className="px-3 py-5">
                          <div className="flex flex-col gap-1">
                            <div className="text-[15px] text-[#000] font-medium">
                              {asset.date}
                            </div>
                            <div className="text-[11px] text-[#48484A] font-normal">
                              {asset.requestId}
                            </div>
                          </div>
                        </td>
                        <td
                          className="px-3 py-5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {asset.statusType === "pending" && (
                            <button
                              onClick={() =>
                                navigate(
                                  `/registrar/tokenization-requests/pending-details/${asset.id}`
                                )
                              }
                              className="w-fit rounded-full !bg-white text-[#000] border !border-black px-4 py-1 text-xs font-medium hover:opacity-90"
                            >
                              Review
                            </button>
                          )}
                          {asset.statusType === "minted" && (
                            <button
                              onClick={() =>
                                navigate(
                                  `/registrar/tokenization-requests/minted-details/${asset.id}`
                                )
                              }
                              className="w-fit rounded-full !bg-white text-[#000] border !border-black px-4 py-1 text-xs font-medium hover:opacity-90"
                            >
                              Mint
                            </button>
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
}

export default RegistrarTokenizationRequestsSection;
