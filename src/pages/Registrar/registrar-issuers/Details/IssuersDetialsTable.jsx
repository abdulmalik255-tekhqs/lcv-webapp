import { SearchBar, Button } from "@/components/shared";
import { useMemo, useState, useRef, useEffect } from "react";
import { HiMagnifyingGlass, HiArrowTopRightOnSquare } from "react-icons/hi2";
import ChevronDown from "../../../../assets/registrar-assets/chevron.svg";
import { HiCheck } from "react-icons/hi";
import {
  PURCHASE_REQUESTS_DATA,
  ASSETS_DATA,
  TRANSACTIONS_DATA,
  ACTIVITY_LOG_DATA,
} from "@/constants/registrar";
import PurchaseRequestTable from "./PurchaseRequestTable";
import AssetDetailTable from "./AssetDetailTable";
import TransactionDetailTable from "./TransactionDetailTable";
import ActivityDetailTable from "./ActivityDetailTable";

const TABS = [
  {
    id: "purchase-requests",
    label: "Purchase Requests",
    count: PURCHASE_REQUESTS_DATA.length,
    hasFilter: true,
  },
  {
    id: "assets",
    label: "Assets",
    count: ASSETS_DATA.length,
    hasFilter: true,
  },
  {
    id: "transactions",
    label: "Transactions",
    count: TRANSACTIONS_DATA.length,
    hasFilter: false,
  },
  {
    id: "activity-log",
    label: "Activity Log",
    count: ACTIVITY_LOG_DATA.length,
    hasFilter: false,
  },
];

// Filter options for Purchase Requests
const PURCHASE_REQUEST_FILTERS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending Issuance" },
  { id: "issued", label: "Tokens Issued" },
];

// Filter options for Assets
const ASSET_FILTERS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending Review" },
  { id: "approved", label: "Approved" },
  { id: "published", label: "Published" },
  { id: "denied", label: "Denied" },
];

function IssuersDetialsTable() {
  const [activeTab, setActiveTab] = useState("purchase-requests");
  const [searchTerm, setSearchTerm] = useState("");
  const [purchaseRequestFilter, setPurchaseRequestFilter] = useState("all");
  const [assetFilter, setAssetFilter] = useState("all");
  const [showPurchaseRequestFilter, setShowPurchaseRequestFilter] =
    useState(false);
  const [showAssetFilter, setShowAssetFilter] = useState(false);
  const purchaseRequestFilterRef = useRef(null);
  const assetFilterRef = useRef(null);

  // Close filter dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        purchaseRequestFilterRef.current &&
        !purchaseRequestFilterRef.current.contains(event.target)
      ) {
        setShowPurchaseRequestFilter(false);
      }
      if (
        assetFilterRef.current &&
        !assetFilterRef.current.contains(event.target)
      ) {
        setShowAssetFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get filter counts
  const getPurchaseRequestFilterCounts = () => {
    const all = PURCHASE_REQUESTS_DATA.length;
    const pending = PURCHASE_REQUESTS_DATA.filter(
      (item) => item.statusType === "pending"
    ).length;
    const issued = PURCHASE_REQUESTS_DATA.filter(
      (item) => item.statusType === "issued"
    ).length;
    return { all, pending, issued };
  };

  const getAssetFilterCounts = () => {
    const all = ASSETS_DATA.length;
    const pending = ASSETS_DATA.filter(
      (item) => item.statusType === "pending"
    ).length;
    const approved = ASSETS_DATA.filter(
      (item) => item.statusType === "approved"
    ).length;
    const published = ASSETS_DATA.filter(
      (item) => item.statusType === "published"
    ).length;
    const denied = ASSETS_DATA.filter(
      (item) => item.statusType === "denied"
    ).length;
    return { all, pending, approved, published, denied };
  };

  const purchaseRequestCounts = getPurchaseRequestFilterCounts();
  const assetCounts = getAssetFilterCounts();

  // Get filtered data based on active tab and filters
  const getFilteredData = () => {
    let data = [];
    if (activeTab === "purchase-requests") {
      data = PURCHASE_REQUESTS_DATA;
      if (purchaseRequestFilter !== "all") {
        data = data.filter((item) => item.statusType === purchaseRequestFilter);
      }
    } else if (activeTab === "assets") {
      data = ASSETS_DATA;
      if (assetFilter !== "all") {
        data = data.filter((item) => item.statusType === assetFilter);
      }
    } else if (activeTab === "transactions") {
      data = TRANSACTIONS_DATA;
    } else if (activeTab === "activity-log") {
      data = ACTIVITY_LOG_DATA;
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      data = data.filter((item) => {
        if (activeTab === "purchase-requests") {
          return (
            item.name?.toLowerCase().includes(term) ||
            item.assetId?.toLowerCase().includes(term) ||
            item.purchaser?.toLowerCase().includes(term) ||
            item.requestId?.toLowerCase().includes(term)
          );
        } else if (activeTab === "assets") {
          return (
            item.name?.toLowerCase().includes(term) ||
            item.assetId?.toLowerCase().includes(term) ||
            item.category?.toLowerCase().includes(term) ||
            item.requestId?.toLowerCase().includes(term)
          );
        } else if (activeTab === "transactions") {
          return (
            item.assetName?.toLowerCase().includes(term) ||
            item.fromName?.toLowerCase().includes(term) ||
            item.transactionHash?.toLowerCase().includes(term) ||
            item.assetId?.toLowerCase().includes(term)
          );
        } else if (activeTab === "activity-log") {
          return (
            item.activity?.toLowerCase().includes(term) ||
            item.relatedEntity?.name?.toLowerCase().includes(term) ||
            item.relatedEntity?.assetId?.toLowerCase().includes(term) ||
            item.details?.requestId?.toLowerCase().includes(term)
          );
        }
        return false;
      });
    }

    return data;
  };

  const filteredData = useMemo(
    () => getFilteredData(),
    [activeTab, searchTerm, purchaseRequestFilter, assetFilter]
  );

  const activeTabConfig = TABS.find((tab) => tab.id === activeTab);

  return (
    <div className="mt-6">
      {/* Tabs and Actions */}
      <div className="border-none !p-0 mb-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            {TABS.map((tab) => (
              <div
                key={tab.id}
                className="relative"
                ref={
                  tab.id === "purchase-requests"
                    ? purchaseRequestFilterRef
                    : tab.id === "assets"
                    ? assetFilterRef
                    : null
                }
              >
                <button
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === "purchase-requests") {
                      setShowPurchaseRequestFilter(false);
                    } else if (tab.id === "assets") {
                      setShowAssetFilter(false);
                    }
                  }}
                  className={`flex items-center gap-2 rounded-full px-4 py-1 h-[42px] text-[13px] transition ${
                    activeTab === tab.id
                      ? "bg-gradient-to-tr from-[#0734A9] via-[#0E1696] to-[#4B0792] font-semibold text-white"
                      : "bg-white border text-[#000] font-semibold hover:bg-[linear-gradient(135deg,rgba(155,60,255,0.06)_0%,rgba(45,103,255,0.06)_100%)] hover:text-[#000]"
                  }`}
                >
                  {tab.label}
                  <span
                      className={`flex h-5 items-center justify-center rounded-full px-[5px] text-[11px]  ${
                        activeTab === tab.id
                          ? "bg-white text-black"
                          : "bg-[linear-gradient(135deg,rgba(155,60,255,0.15)_0%,rgba(45,103,255,0.15)_100%)] text-[#000] hover:!bg-white hover:!bg-none"
                      }`}
                  >
                    {tab.count}
                  </span>
                  {tab.hasFilter && (
                    <img
                      src={ChevronDown}
                      alt="Arrowdown"
                      className="h-3 w-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (tab.id === "purchase-requests") {
                          setShowPurchaseRequestFilter(
                            !showPurchaseRequestFilter
                          );
                          setShowAssetFilter(false);
                        } else if (tab.id === "assets") {
                          setShowAssetFilter(!showAssetFilter);
                          setShowPurchaseRequestFilter(false);
                        }
                      }}
                    />
                  )}
                </button>

                {/* Purchase Request Filter Dropdown */}
                {tab.id === "purchase-requests" &&
                  showPurchaseRequestFilter && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-[#E5E5EA] rounded-lg shadow-lg z-50 min-w-[200px]">
                      {PURCHASE_REQUEST_FILTERS.map((filter) => (
                        <button
                          key={filter.id}
                          onClick={() => {
                            setPurchaseRequestFilter(filter.id);
                            setShowPurchaseRequestFilter(false);
                          }}
                          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 text-[13px] text-[#000]"
                        >
                          <span>{filter.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-[#666]">
                              {purchaseRequestCounts[filter.id]}
                            </span>
                            {purchaseRequestFilter === filter.id && (
                              <HiCheck className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                {/* Asset Filter Dropdown */}
                {tab.id === "assets" && showAssetFilter && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-[#E5E5EA] rounded-lg shadow-lg z-50 min-w-[200px]">
                    {ASSET_FILTERS.map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => {
                          setAssetFilter(filter.id);
                          setShowAssetFilter(false);
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 text-[13px] text-[#000]"
                      >
                        <span>{filter.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-[#666]">
                            {assetCounts[filter.id]}
                          </span>
                          {assetFilter === filter.id && (
                            <HiCheck className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 flex-1 justify-end w-auto w-full">
          <button
                className="flex items-center gap-2 text-[13px] font-medium text-[#000] hover:opacity-80 transition"
              >
                Export CSV
                <HiArrowTopRightOnSquare className="h-4 w-4" />
              </button>
            <div className="w-auto">
              <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-lg border border-[#E5E5EA] overflow-hidden">
        {activeTab === "purchase-requests" && (
          <PurchaseRequestTable data={filteredData} />
        )}
        {activeTab === "assets" && <AssetDetailTable data={filteredData} />}
        {activeTab === "transactions" && (
          <TransactionDetailTable data={filteredData} />
        )}
        {activeTab === "activity-log" && (
          <ActivityDetailTable data={filteredData} />
        )}
      </div>
    </div>
  );
}

export default IssuersDetialsTable;
