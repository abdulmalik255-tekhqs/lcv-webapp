import React from "react";
import commericalIcon from "@/assets/admin-assets/commerical.svg";

function InvestorDashboardOverviewSection({ asset }) {
  return (
    <div>
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="text-start !text-[40px] font-normal font-['Atacama'] text-[#000]">
          {asset?.name}
        </div>
        {/* <span className="text-start !text-[#000] font-normal !text-[15px] !py-0">
          {asset?.description}
        </span> */}
      </div>
      {/* Opprotunity Description */}
      <div className="flex w-[815px] pt-[18px] flex-col items-start gap-[18px]">
        <p class="text-black font-['Atacama_VAR'] text-[20px] font-normal ">
          Opportunity Description
        </p>
        <p className="flex flex-col items-start  border-t border-black pt-6 pb-6">
          {" "}
          {asset?.marketplace_description}
        </p>
      </div>
      {/*Basic Information */}
      <div className="flex w-[815px] pt-[18px] flex-col items-start gap-[18px]">
        <p class="text-black font-['Atacama_VAR'] text-[20px] font-normal ">
          Basic Information
        </p>

        <div class="flex items-start gap-10  border-t border-black pt-6 w-full ">
          <div className="flex flex-col items-start py-6 flex-1 w-full">
            <p className="text-black  text-[11px] font-semibold">Asset Name:</p>
            <p className="text-black  text-[17px] font-normal">
            {asset?.name}
            </p>
          </div>
          <div className="flex flex-col items-start py-6 flex-1 w-full">
            <p className="text-black  text-[11px] font-semibold">Asset Type:</p>
            <p className="text-black  text-[17px] font-normal">
                {asset?.assetType?.title}{" "}
            </p>
          </div>
        </div>
        <p className="flex flex-col items-start  py-6 border-t border-[#D1D1D6]">
          {" "}
          {asset?.description}
        </p>
      </div>
      <div className="text-start mt-8 text-[20px] font-[500] font-['Atacama'] text-[#000]">
        Overview
      </div>{" "}
      <div className="text-start !text-[#000] font-normal !text-[17px] mt-4 !pb-8">
        {asset?.marketplace_description}
      </div>
      <hr className="border-t border-[#D1D1D6] my-4 border-1 "></hr>
      <div className=" rounded-lg pb-8">
        <h3 className="text-[20px] font-semibold text-[#000] mb-4 !font-['Atacama']">
          Business Details
        </h3>
        <div className="grid grid-cols-3 md:grid-cols-2 gap-5 mb-6">
          <div>
            <p className="text-[11px] !font-[600] text-[#000] mb-1">
              Industry / Sector
            </p>
            <p className="text-[17px] font-normal text-[#000]">
              {asset?.assetBusinessDetail?.industry}
            </p>
          </div>
          <div>
            <p className="text-[11px] !font-[600] text-[#000] mb-1">
              Year Established
            </p>
            <p className="text-[17px] font-normal text-[#000]">
              {" "}
              {asset?.assetBusinessDetail?.year_established}
            </p>
          </div>
          <div>
            <p className="text-[11px] !font-[600] text-[#000] mb-1">
              Number of Employees
            </p>
            <p className="text-[17px] font-normal text-[#000]">
              {asset?.assetBusinessDetail?.number_of_employees}
            </p>
          </div>
          <div>
            <p className="text-[11px] !font-[600] text-[#000] mb-1">
              Ownership Stake
            </p>
            <p className="text-[17px] font-normal text-[#000]">
              {asset?.assetBusinessDetail?.ownership_stake}%
            </p>
          </div>
          <div>
            <p className="text-[11px] !font-[600] text-[#000] mb-1">
              Business Valuation
            </p>
            <p className="text-[17px] font-normal text-[#000]">
              ${asset?.assetBusinessDetail?.business_valuation}
            </p>
          </div>
          <div>
            <p className="text-[11px] !font-[600] text-[#000] mb-1">
              Operational Status
            </p>
            <p className="text-[15px] font-normal text-[#000]">
              {asset?.assetBusinessDetail?.operational_status}
            </p>
          </div>
        </div>
      </div>
      <hr className="border-t border-[#D1D1D6] my-4 border-1 "></hr>
      <div className=" rounded-lg pb-8 ">
        <h3 className="text-[20px] font-semibold text-[#000] mb-4 !font-['Atacama']">
          Financials Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Column 1 */}
          <div className="space-y-4">
            <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
              <p className="text-[11px] !font-[600] text-[#000] mb-1">
                Revenue
              </p>
              <p className="text-[17px] font-normal text-[#000]">
                ${asset?.assetBusinessDetail?.annual_revenue}
              </p>
            </div>
            <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
              <p className="text-[11px] !font-[600] text-[#000] mb-1">
                Broadcasting Revenue
              </p>
              <p className="text-[17px] font-normal text-[#000]">
                ${asset?.assetBusinessDetail?.broadcasting_revenue}
              </p>
            </div>
            <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
              <p className="text-[11px] !font-[600] text-[#000] mb-1">
                Player Acquisitions
              </p>
              <p className="text-[17px] font-normal text-[#000]">
                ${asset?.assetBusinessDetail?.player_acquisitions}
              </p>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
              <p className="text-[11px] !font-[600] text-[#000] mb-1">
                Revenue CAGR
              </p>
              <p className="text-[17px] font-normal text-[#000]">
                {asset?.assetBusinessDetail?.revenue_cagr}%
              </p>
            </div>
            <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
              <p className="text-[11px] !font-[600] text-[#000] mb-1">
                Matchday Revenue
              </p>
              <p className="text-[17px] font-normal text-[#000]">
                ${asset?.assetBusinessDetail?.matchday_revenue}
              </p>
            </div>
            <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
              <p className="text-[11px] !font-[600] text-[#000] mb-1">
                Operating Expenses
              </p>
              <p className="text-[17px] font-normal text-[#000]">
                ${asset?.assetBusinessDetail?.operating_expenses}
              </p>
            </div>
          </div>

          {/* Column 3 */}
          <div className="space-y-4">
            <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
              <p className="text-[11px] !font-[600] text-[#000] mb-1">EBITDA</p>
              <p className="text-[17px] font-normal text-[#000]">
                ${asset?.assetBusinessDetail?.ebitda}
              </p>
            </div>
            <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
              <p className="text-[11px] !font-[600] text-[#000] mb-1">
                Commercial Revenue
              </p>
              <p className="text-[17px] font-normal text-[#000]">
                ${asset?.assetBusinessDetail?.commercial_revenue}
              </p>
            </div>
            <div className="flex flex-col pb-3 border-b border-[#E5E5EA]"></div>
          </div>
          
        </div>
      </div>
      {/* Investment Terms Section */}
      <div className=" rounded-lg pb-8 ">
      <h3 className="text-[20px] font-semibold text-[#000] mb-4 !font-['Atacama']">
          Investment Terms
        </h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
              <span className="text-xs font-medium text-[#000] mb-1">
                Ownership Stake:
              </span>
              <span className="text-xs text-[#000]">
                {asset?.assetBusinessDetail?.ownership_stake || "0"}%
              </span>
            </div>
            <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
              <span className="text-xs font-medium text-[#000] mb-1">
                Minimum Investment:
              </span>
              <span className="text-xs text-[#000]">
                ${asset?.assetBusinessDetail?.minimum_investment ||
                  "0"}
              </span>
            </div>
            <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
              <span className="text-xs font-medium text-[#000] mb-1">
                Expected Yield:
              </span>
              <span className="text-xs text-[#000]">
                {asset?.assetBusinessDetail?.expected_yield || "0"}%
              </span>
            </div>
            <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
              <span className="text-xs font-medium text-[#000] mb-1">
                Minimum Annual Return:
              </span>
              <span className="text-xs text-[#000]">
                ${asset?.assetBusinessDetail?.minimum_annual_return ||
                  "0"}
              </span>
            </div>
            <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
              <span className="text-xs font-medium text-[#000] mb-1">
                Expected Term:
              </span>
              <span className="text-xs text-[#000]">
                {asset?.assetBusinessDetail?.expected_term || "0 years"} 
              </span>
            </div>
            <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
              <span className="text-xs font-medium text-[#000] mb-1">
                Target Close Date:
              </span>
              <span className="text-xs text-[#000]">
                {asset?.assetBusinessDetail?.target_close_date
                  ? new Date(
                      asset?.assetBusinessDetail?.target_close_date
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "Not Provided"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <hr className="border-t border-[#D1D1D6] my-4 border-1 "></hr>
  
    </div>
  );
}

export default InvestorDashboardOverviewSection;
