import { SearchBar, Button, EmptyState } from "@/components/shared";
import TransactionReceiptModal from "./TransactionReceiptModal";
import { useMemo, useState } from "react";
import {
  HiMagnifyingGlass,
  HiArrowTopRightOnSquare,

} from "react-icons/hi2";
import Arrowdown from "../../../../assets/admin-assets/arrow-down.svg";

import { HiChevronRight } from "react-icons/hi";
import {
  FaCopy,
  FaBuilding,
  FaLeaf,
  FaChartLine,
  FaAt,
  FaFutbol,
} from "react-icons/fa6";
import { HOLDINGS_DATA, TRANSACTIONS_DATA } from "@/constants/registrar";

// Icon mapping helper
const getAssetIcon = (category) => {
  const iconMap = {
    "Renewable Energy": FaLeaf,
    "Enterprise Analytics Software": FaChartLine,
    "Commercial Real Estate": FaBuilding,
    "AI & Technology": FaAt,
    "Sports & Entertainment": FaFutbol,
    Sustainability: FaLeaf,
  };
  return iconMap[category] || FaBuilding;
};

const TABS = [
  { id: "holdings", label: "Holdings", count: HOLDINGS_DATA.length },
  {
    id: "transactions",
    label: "Transactions",
    count: TRANSACTIONS_DATA.length,
  },
];


function ShareHoldersDetialsTable() {
  const [activeTab, setActiveTab] = useState("holdings");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const visibleData = useMemo(() => {
    const data = activeTab === "holdings" ? HOLDINGS_DATA : TRANSACTIONS_DATA;

    if (!searchTerm.trim()) {
      return data;
    }

    const term = searchTerm.toLowerCase();
    return data.filter((item) => {
      if (activeTab === "holdings") {
        return (
          item.assetName.toLowerCase().includes(term) ||
          item.issuer.toLowerCase().includes(term) ||
          item.assetId.toLowerCase().includes(term)
        );
      } else {
        return (
          item.assetName.toLowerCase().includes(term) ||
          item.fromName.toLowerCase().includes(term) ||
          item.transactionHash.toLowerCase().includes(term)
        );
      }
    });
  }, [activeTab, searchTerm]);

  const handleRowClick = (item) => {
    if (activeTab === "transactions") {
      setSelectedTransaction(item);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="mt-6">
      {/* Tabs and Actions */}
      <div className="border-none !p-0 mb-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <div className="flex items-center gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-3 text-[13px] transition ${
                  activeTab === tab.id
                    ? "primary-gradient font-semibold text-white"
                    : "bg-white border text-[#000] font-semibold hover:bg-slate-200"
                }`}
              >
                {tab.label}
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[12px] ${
                    activeTab === tab.id
                      ? "bg-white text-black"
                      : "bg-[linear-gradient(135deg,rgba(155,60,255,0.15)_0%,rgba(45,103,255,0.15)_100%)] text-[#000]"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 flex-1 justify-end">
            <Button
              variant="ghost"
              size="sm"
              icon={<HiArrowTopRightOnSquare className="h-4 w-4" />}
              className="text-[#000] !text-[11px]"
            >
              Export CSV
            </Button>
            <div className="w-full md:w-[84%]">
              <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-[#E5E5EA] overflow-hidden">
        <div className="overflow-x-auto">
          {visibleData.length === 0 ? (
            <div className="mx-auto w-full max-w-full rounded-[12px] border border-dashed border-[#CBD5F5] bg-white">
              <EmptyState />
            </div>
          ) : activeTab === "holdings" ? (
            <table className="w-full text-left text-[13px] border border-[#E5E5EA]">
              <thead className="bg-[#FAFAFC] border-b border-[#E5E5EA]">
                <tr className="text-[13px] font-[700]">
                  <th className="px-4 py-3 text-left">
                    <div className="flex items-center gap-1">
                      Asset
                      <img
                        src={Arrowdown}
                        alt="Arrowdown"
                        className="h-3 w-3 mt-1 text-slate-400"
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left">Issuer</th>
                  <th className="px-4 py-3 text-left">Tokens Held</th>
                  <th className="px-4 py-3 text-left">Ownership %</th>
                  <th className="px-4 py-3 text-left">Current Value</th>
                  <th className="px-4 py-3 text-left">
                    <div className="flex items-center gap-1">
                      Acquired
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
                {visibleData.map((holding) => (
                  <tr key={holding.id} className="hover:bg-gray-50">
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 border border-[#E5E5EA] bg-[#FAFAFC] rounded-md p-4">
                          {(() => {
                            const IconComponent = getAssetIcon(
                              holding.assetCategory
                            );
                            return (
                              <IconComponent className="h-5  w-5 text-[#000]" />
                            );
                          })()}
                        </div>
                        <div>
                          <div className="font-semibold text-[#000]">
                            {holding.assetName}
                          </div>
                          <div className="text-[11px] text-[#48484A]">
                            {holding.assetCategory}
                          </div>
                          <div className="text-[11px] text-[#48484A]">
                            {holding.assetId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <div className="font-semibold text-[#000]">
                        {holding.issuer}
                      </div>
                      <div className="text-[11px] text-[#48484A]">
                        {holding.issuerEmail}
                      </div>
                    </td>
                    <td className="px-4 py-5 text-[15px] text-[#000] font-medium">
                      {holding.tokensHeld}
                    </td>
                    <td className="px-4 py-5 text-[15px] text-[#000] font-medium">
                      {holding.ownershipPercent}
                    </td>
                    <td className="px-4 py-5 text-[15px] text-[#000] font-medium">
                      {holding.currentValue}
                    </td>
                    <td className="px-4 py-5 text-[15px] text-[#000] font-medium">
                      {holding.acquired}
                    </td>
                    <td className="px-4 py-5">
                      <HiChevronRight className="h-5 w-5 text-[#666]" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-[13px] border border-[#E5E5EA]">
              <thead className="bg-[#FAFAFC] border-b border-[#E5E5EA]">
                <tr className="text-[13px] font-[700]">
                  <th className="px-4 py-3 text-left">Date & Time</th>
                  <th className="px-4 py-3 text-left">Asset</th>
                  <th className="px-4 py-3 text-left">From</th>
                  <th className="px-4 py-3 text-left">Tokens</th>
                  <th className="px-4 py-3 text-left">
                    <div className="flex items-center gap-1">
                      Transaction Hash
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
                {visibleData.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(transaction)}
                  >
                    <td className="px-4 py-5 text-[15px] text-[#000] font-medium">
                      {transaction.dateTime}
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 border border-[#E5E5EA] bg-[#FAFAFC] rounded-md p-4">
                          {(() => {
                            const IconComponent = getAssetIcon(
                              transaction.assetCategory
                            );
                            return (
                              <IconComponent className="h-5 w-5 text-[#000]" />
                            );
                          })()}
                        </div>
                        <div>
                          <div className="font-semibold text-[#000]">
                            {transaction.assetName}
                          </div>
                          <div className="text-[11px] text-[#48484A]">
                            {transaction.assetCategory}
                          </div>
                          <div className="text-[11px] text-[#48484A]">
                            {transaction.assetId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 border border-[#E5E5EA] bg-[#FAFAFC] rounded-full p-2">
                          <FaBuilding className="h-4 w-4 text-[#000]" />
                        </div>
                        <div>
                          <div className="font-semibold text-[#000]">
                            {transaction.fromName}
                          </div>
                          <div className="text-[11px] text-[#48484A]">
                            {transaction.fromContact}
                          </div>
                          <div className="text-[11px] text-[#48484A]">
                            {transaction.fromEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <div className="text-[15px] font-medium text-[#000]">
                        {transaction.tokens}
                      </div>
                      <div className="text-[11px] text-[#48484A]">
                        {transaction.tokenValue}
                      </div>
                    </td>
                    <td className="px-2 py-5">
                      <div className="text-[13px] font-medium text-[#000]">
                        {transaction.transactionHash}
                      </div>
                      <div className="text-[11px] flex flex-row text-[#48484A] rounded-md ">
                        <div className="text-[13px] font-medium text-[#000]">
                          {transaction.txHash}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(
                              transaction.txHashFull
                            );
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Copy transaction hash"
                        >
                          <FaCopy className="w-3 h-3 text-[#000]" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <HiChevronRight className="h-5 w-5 text-[#666]" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Transaction Receipt Modal */}
      <TransactionReceiptModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTransaction(null);
        }}
        transaction={selectedTransaction}
      />
    </div>
  );
}

export default ShareHoldersDetialsTable;
