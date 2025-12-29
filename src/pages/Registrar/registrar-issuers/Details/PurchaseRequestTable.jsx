import React from "react";
import { HiChevronRight } from "react-icons/hi";
import { FaBuilding, FaUser } from "react-icons/fa6";
import Arrowdown from "../../../../assets/admin-assets/arrow-down.svg";
import ChevronDown from "../../../../assets/registrar-assets/chevron.svg";
import { Button, EmptyState } from "@/components/shared";



function PurchaseRequestTable({ data = [] }) {
  if (data.length === 0) {
    return (
      <div className="mx-auto w-full max-w-full rounded-[12px] border border-dashed border-[#CBD5F5] bg-white">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[13px] border border-[#E5E5EA]">
        <thead className="bg-[#FAFAFC] border-b border-[#E5E5EA]">
          <tr className="text-[13px] font-[700]">
            <th className="px-4 py-3 text-left">Request ID</th>
            <th className="px-4 py-3 text-left">Asset</th>
            <th className="px-4 py-3 text-left">Purchaser</th>
            <th className="px-4 py-3 text-left">Total Tokens Issued</th>
            <th className="px-4 py-3 text-left">
              <div className="flex items-center gap-1">
                Latest Update
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
            const IconComponent = item.icon || FaBuilding;
            const PurchaserIcon =
              item.purchaserType === "company" ? FaBuilding : FaUser;

            return (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-5 text-[13px] font-medium text-[#000]">
                  {item.requestId}
                </td>
                <td className="px-4 py-5">
                  <div className="flex items-center gap-3">
                   
                    <div>
                      <div className="font-semibold text-[#000]">{item.name}</div>
                      <div className="text-[11px] text-[#48484A]">
                        {item.category}
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
                      <PurchaserIcon className="h-4 w-4 text-[#000]" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#000]">
                        {item.purchaser}
                      </div>
                      <div className="text-[11px] text-[#48484A]">
                        {item.purchaserContact}
                      </div>
                      <div className="text-[11px] text-[#48484A]">
                        {item.purchaserEmail}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-5">
                  <div className="text-[15px] font-medium text-[#000]">
                    {item.totalTokensIssued || item.tokens}
                  </div>
                  <div className="text-[11px] text-[#48484A]">
                    {item.totalValue || item.amount}
                  </div>
                </td>
                <td className="px-4 py-5">
                  <div className="text-[13px] font-medium text-[#000]">
                    {item.latestUpdate || item.date}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`px-2 py-1 rounded-full text-[11px] font-medium ${
                        item.statusType === "pending"
                          ? "bg-purple-100 text-[#000]"
                          : "bg-gray-100 text-[#000]"
                      }`}
                    >
                      {item.status === "Pending Issuance"
                        ? "Pending Issuance"
                        : "Issued"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {item.statusType === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="!text-[11px] !px-3 !py-1 border border-[#000] rounded-full"
                      >
                        Review
                      </Button>
                    )}
                    {item.statusType === "issued" && (
                      <HiChevronRight className="h-5 w-5 text-[#666]" />
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default PurchaseRequestTable;
