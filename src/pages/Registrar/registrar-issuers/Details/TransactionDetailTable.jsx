import React from "react";
import { HiChevronRight } from "react-icons/hi";
import { 
  FaBuilding, 
  FaUser, 
  FaCopy,
  FaLeaf,
  FaChartBar,
  FaLaptopCode,
  FaHouse,
  FaHospital
} from "react-icons/fa6";
import Arrowdown from "../../../../assets/admin-assets/arrow-down.svg";
import TransactionsReceiptModal from "./TransactionsReceiptModal";
import { useState } from "react";
import { EmptyState } from "@/components/shared";

// Icon mapping helper
const getAssetIcon = (category) => {
  const iconMap = {
    "Renewable Energy": FaLeaf,
    "Enterprise Analytics Software": FaChartBar,
    "Commercial Real Estate": FaBuilding,
    "AI & Technology": FaLaptopCode,
    "Residential Real Estate": FaHouse,
    "Real Estate Development": FaBuilding,
    "Medical Devices": FaHospital,
    Technology: FaLaptopCode,
    Sustainability: FaLeaf,
  };
  const IconComponent = iconMap[category] || FaBuilding;
  return <IconComponent className="h-5 w-5 text-[#000]" />;
};


function TransactionDetailTable({ data = [] }) {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = (item) => {
    setSelectedTransaction(item);
    setIsModalOpen(true);
  };

  if (data.length === 0) {
    return (
      <div className="mx-auto w-full max-w-full rounded-[12px] border border-dashed border-[#CBD5F5] bg-white">
        <EmptyState />
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px] border border-[#E5E5EA]">
          <thead className="bg-[#FAFAFC] border-b border-[#E5E5EA]">
            <tr className="text-[13px] font-[700]">
              <th className="px-4 py-3 text-left">Date & Time</th>
              <th className="px-4 py-3 text-left">Asset</th>
              <th className="px-4 py-3 text-left">Recipient</th>
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
              <th className="px-4 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => {
              // Determine recipient icon based on fromName (could be company or individual)
              const RecipientIcon = item.fromName?.includes("Inc") ||
                item.fromName?.includes("LLC") ||
                item.fromName?.includes("Holdings") ||
                item.fromName?.includes("Corp")
                ? FaBuilding
                : FaUser;

              return (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(item)}
                >
                  <td className="px-4 py-5 text-[13px] font-medium text-[#000]">
                    {item.dateTime}
                    <div className="text-[11px] text-[#48484A]">{item.time}</div>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 border h-12 w-12 border-[#E5E5EA] bg-[#FAFAFC] rounded-md p-2 flex items-center justify-center">
                        {getAssetIcon(item.assetCategory)}
                      </div>
                      <div>
                        <div className="font-semibold text-[#000]">
                          {item.assetName}
                        </div>
                        <div className="text-[11px] text-[#48484A]">
                          {item.assetCategory}
                        </div>
                        <div className="text-[11px] text-[#48484A]">
                          {item.assetId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 border border-[#E5E5EA] bg-[#FAFAFC] rounded-full p-2">
                        <RecipientIcon className="h-4 w-4 text-[#000]" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#000]">
                          {item.fromName}
                        </div>
                        <div className="text-[11px] text-[#48484A]">
                          {item.fromContact}
                        </div>
                        <div className="text-[11px] text-[#48484A]">
                          {item.fromEmail}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <div className="text-[15px] font-medium text-[#000]">
                      {item.tokens}
                    </div>
                    <div className="text-[11px] text-[#48484A]">
                      {item.tokenValue}
                    </div>
                  </td>
                  <td className="px-2 py-5">
                    <div className="text-[13px] font-medium text-[#000]">
                      {item.transactionHash}
                    </div>
                    <div className="text-[11px] flex flex-row items-center gap-1 text-[#48484A] rounded-md">
                      <div className="text-[13px] font-medium text-[#000] bg-gray-100 px-2 py-1 rounded">
                        {item.txHash}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(item.txHashFull);
                        }}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Copy transaction hash"
                      >
                        <FaCopy className="w-3 h-3 text-[#000]" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-5 text-right">
                    <div className="flex justify-end">
                      <HiChevronRight className="h-5 w-5 text-[#666]" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Transaction Receipt Modal */}
      <TransactionsReceiptModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTransaction(null);
        }}
        transaction={selectedTransaction}
      />
    </>
  );
}

export default TransactionDetailTable;
