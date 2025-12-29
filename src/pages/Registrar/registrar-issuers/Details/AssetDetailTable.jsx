import React from "react";
import { HiChevronRight } from "react-icons/hi";
import Arrowdown from "../../../../assets/admin-assets/arrow-down.svg";
import { Button, EmptyState } from "@/components/shared";


function AssetDetailTable({ data = [] }) {
  if (data.length === 0) {
    return (
      <div className="mx-auto w-full max-w-full rounded-[12px] border border-dashed border-[#CBD5F5] bg-white">
        <EmptyState />
      </div>
    );
  }

  const getStatusBadgeClass = (statusType) => {
    switch (statusType) {
      case "pending":
        return "bg-purple-100 text-[#000]";
      case "approved":
        return "bg-green-100 text-[#000]";
      case "published":
        return "bg-gray-100 text-[#000]";
      case "denied":
        return "bg-red-100 text-[#000]";
      case "minted":
        return "bg-blue-100 text-[#000]";
      default:
        return "bg-gray-100 text-[#000]";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[13px] border border-[#E5E5EA]">
        <thead className="bg-[#FAFAFC] border-b border-[#E5E5EA]">
          <tr className="text-[13px] font-[700]">
            <th className="px-4 py-3 text-left">Asset</th>
            <th className="px-4 py-3 text-left">Initial Mint / Total Supply</th>
            <th className="px-4 py-3 text-left">Capital Target</th>
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
            const IconComponent = item.icon;

            return (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 border border-[#E5E5EA] bg-[#FAFAFC] rounded-md p-2">
                      {IconComponent && (
                        <IconComponent className="h-4 w-4 text-[#000]" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-[#000]">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-[#48484A]">
                        {item.category}
                      </div>
                      <div className="text-[11px] text-[#48484A]">
                        {item.assetId}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-5 text-[15px] font-medium text-[#000]">
                  {item.initialMint} / {item.totalSupply}
                </td>
                <td className="px-4 py-5 text-[15px] font-medium text-[#000]">
                  {item.capitalTarget}
                </td>
                <td className="px-4 py-5">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-1 rounded-full text-[11px] font-medium ${getStatusBadgeClass(
                        item.statusType
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#48484A]">{item.date}</div>
                  <div className="text-[11px] text-[#48484A]">
                    {item.requestId}
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
                    {item.statusType === "approved" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="!text-[11px] !px-3 !py-1 border border-[#000] rounded-full"
                      >
                        Mint
                      </Button>
                    )}
                    {item.statusType !== "pending" &&
                      item.statusType !== "approved" && (
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

export default AssetDetailTable;
