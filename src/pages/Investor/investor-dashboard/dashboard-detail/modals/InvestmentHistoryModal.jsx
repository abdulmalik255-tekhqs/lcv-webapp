import React, { useState } from "react";
import GenericModal from "@/components/shared/GenericModal";
import { FaCopy, FaArrowDown, FaArrowUp } from "react-icons/fa6";
import { FaHistory } from "react-icons/fa";

const InvestmentHistoryModal = ({ isOpen, onClose, asset }) => {
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc' or 'desc'
  const [sortColumn, setSortColumn] = useState("date");

  // Sample data - replace with actual API data
  const purchaseHistory = [
    {
      id: 1,
      date: "Dec 8, 2025",
      time: "8:42 AM",
      purchaseId: "PUR-2025-001",
      tokens: 5000,
      amount: 5000000,
      transactionHash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
    },
    {
      id: 2,
      date: "Dec 2, 2025",
      time: "11:39 AM",
      purchaseId: "PUR-2025-001",
      tokens: 5000,
      amount: 5000000,
      transactionHash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
    },
  ];

 

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const sortedData = [...purchaseHistory].sort((a, b) => {
    if (sortColumn === "date") {
      const dateA = new Date(a.date + " " + a.time);
      const dateB = new Date(b.date + " " + b.time);
      return sortOrder === "asc"
        ? dateA - dateB
        : dateB - dateA;
    }
    return 0;
  });

  const truncateHash = (hash) => {
    if (!hash) return "";
    return hash.length > 10 ? `${hash.substring(0, 4)}...${hash.substring(hash.length - 4)}` : hash;
  };

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      subheader=""
      maxWidth="max-w-4xl"
      className="bg-white"
    >
      <div className="space-y-6">
        {/* Icon and Title */}
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-[#9B3CFF] flex items-center justify-center mb-4">
            <FaHistory className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-[24px] font-['Atacama'] font-normal text-[#000] mb-2">
            Investment History
          </h2>
          <p className="text-[13px] font-normal text-[#000] mb-4">
            View all token purchases for this investment.
          </p>
        </div>

        {/* Purchase Count */}
        <div className="text-center">
          <p className="text-[13px] font-normal text-[#000]">
            Showing <span className="font-semibold">{purchaseHistory.length}</span> purchases
          </p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E5EA]">
                  <th className="text-left py-3 px-4">
                    <button
                      onClick={() => handleSort("date")}
                      className="flex items-center gap-2 text-[11px] font-medium text-[#000] hover:text-[#073BC3] transition-colors"
                    >
                      Date & Time
                      {sortColumn === "date" && (
                        sortOrder === "asc" ? (
                          <FaArrowUp className="w-3 h-3 text-[#073BC3]" />
                        ) : (
                          <FaArrowDown className="w-3 h-3 text-[#073BC3]" />
                        )
                      )}
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 text-[11px] font-medium text-[#000]">
                    Purchase ID
                  </th>
                  <th className="text-left py-3 px-4 text-[11px] font-medium text-[#000]">
                    Tokens Purchased
                  </th>
                  <th className="text-left py-3 px-4 text-[11px] font-medium text-[#000]">
                    Transaction Hash
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((purchase, index) => (
                  <tr
                    key={purchase.id}
                    className={`border-b border-[#E5E5EA] ${
                      index % 2 === 0 ? "bg-white" : "bg-[#FAFAFC]"
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-normal text-[#000]">
                          {purchase.date}
                        </span>
                        <span className="text-[11px] font-normal text-[#48484A]">
                          {purchase.time}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-normal text-[#000]">
                          {purchase.purchaseId}
                        </span>
                        <button
                          onClick={() => copyToClipboard(purchase.purchaseId)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Copy Purchase ID"
                        >
                          <FaCopy className="w-3 h-3 text-[#48484A]" />
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-normal text-[#000]">
                          {purchase.tokens} Tokens
                        </span>
                        <span className="text-[11px] font-normal text-[#48484A]">
                          {purchase.amount}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-normal text-[#000]">
                          {truncateHash(purchase.transactionHash)}
                        </span>
                        <button
                          onClick={() => copyToClipboard(purchase.transactionHash)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Copy Transaction Hash"
                        >
                          <FaCopy className="w-3 h-3 text-[#48484A]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </GenericModal>
  );
};

export default InvestmentHistoryModal;

