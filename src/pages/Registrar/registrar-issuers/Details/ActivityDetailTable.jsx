import React from "react";
import { HiChevronRight } from "react-icons/hi";
import Arrowdown from "../../../../assets/admin-assets/arrow-down.svg";
import { EmptyState } from "@/components/shared";



function ActivityDetailTable({ data = [] }) {
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
            <th className="px-4 py-3 text-left">Date & Time</th>
            <th className="px-4 py-3 text-left">Category</th>
            <th className="px-4 py-3 text-left">Activity</th>
            <th className="px-4 py-3 text-left">Related Entity</th>
            <th className="px-4 py-3 text-left">
              <div className="flex items-center gap-1">
                Details
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
            const CategoryIcon = item.categoryIcon;
            const EntityIcon = item.relatedEntity?.icon;

            return (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-5">
                  <div className="text-[13px] font-medium text-[#000]">
                    {item.dateTime}
                  </div>
                  <div className="text-[11px] text-[#48484A]">{item.time}</div>
                </td>
                <td className="px-4 py-5">
                  <div className="flex items-center gap-2">
                    {CategoryIcon && (
                      <CategoryIcon className="h-8 w-8 text-[#000] border border-[#E5E5EA] rounded-full p-2" />
                    )}
                    <span className="text-[13px] font-medium text-[#000]">
                      {item.category}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-5 text-[13px] font-medium text-[#000]">
                  {item.activity}
                </td>
                <td className="px-4 py-5">
                  {item.relatedEntity && (
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 border h-12 w-12 border-[#E5E5EA] bg-[#FAFAFC] rounded-md p-2 flex items-center justify-center">
                        {EntityIcon && (
                          <EntityIcon className="h-4 w-4 text-[#000]" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-[15px] text-[#000]">
                          {item.relatedEntity.name}
                        </div>
                        <div className="text-[11px] text-[#48484A]">
                          {item.relatedEntity.category}
                        </div>
                        <div className="text-[11px] text-[#48484A]">
                          {item.relatedEntity.assetId}
                        </div>
                      </div>
                    </div>
                  )}
                </td>
                <td className="px-4 py-5">
                  <div className="text-[11px] text-[#48484A]">
                    {item.details?.requestId && (
                      <div className="text-[11px] font-medium text-[#000]">{item.details.requestId}</div>
                    )}
                    {item.details?.tokens && (
                      <div>{item.details.tokens}</div>
                    )}
                    {item.details?.target && (
                      <div>{item.details.target}</div>
                    )}
                    {item.details?.purchaser && (
                      <div>{item.details.purchaser}</div>
                    )}
                    {item.details?.amount && (
                      <div>{item.details.amount}</div>
                    )}
                    {item.details?.reason && (
                      <div>{item.details.reason}</div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-5 text-right">
                  <HiChevronRight className="h-5 w-5 text-[#666] ml-auto" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ActivityDetailTable;
