import React from "react";



function PublishedOverviewSection({ asset }) {
  const businessDetail = asset?.assetBusinessDetail || {};
  const assetType = asset?.assetType || {};

  return (
    <div>
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="text-start !text-[40px] font-normal font-['Atacama'] text-[#000]">
          {asset?.name || "Not Provided"}
        </div>
        <span className="text-start !text-[#000] font-normal !text-[15px] !py-0">
          {assetType?.title || "Not Provided"}
        </span>
      </div>
      <div className="text-start mt-8 text-[20px] font-[500] font-['Atacama'] text-[#000]">
        Overview
      </div>{" "}
      <p className="text-start !text-[#000] font-normal !text-[17px] mt-4 !pb-8">
        {asset?.marketplace_description || asset?.description || "Not Provided"}
      </p>
      <hr className="border-t border-[#D1D1D6] my-4 border-1 "></hr>

      <div className=" rounded-lg pb-8">
        <h3 className="text-[20px] font-semibold text-[#000] mb-4 !font-['Atacama']">
          Business Details
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
          <div>
            <p className="text-[11px] !font-[600] text-[#000] mb-1">
              Industry / Sector
            </p>
            <p className="text-[17px] font-normal text-[#000]">
              {businessDetail?.industry || "Not Provided"}
            </p>
          </div>
          <div>
            <p className="text-[11px] !font-[600] text-[#000] mb-1">
              Year Established
            </p>
            <p className="text-[17px] font-normal text-[#000]">
              {businessDetail?.year_established || "Not Provided"}
            </p>
          </div>
          <div>
            <p className="text-[11px] !font-[600] text-[#000] mb-1">
              Number of Employees
            </p>
            <p className="text-[17px] font-normal text-[#000]">
              {businessDetail?.number_of_employees || "Not Provided"}
            </p>
          </div>
          <div>
            <p className="text-[11px] !font-[600] text-[#000] mb-1">
              Ownership Stake
            </p>
            <p className="text-[17px] font-normal text-[#000]">
              {businessDetail?.ownership_stake || "Not Provided"}
            </p>
          </div>
          <div>
            <p className="text-[11px] !font-[600] text-[#000] mb-1">
              Business Valuation
            </p>
            <p className="text-[17px] font-normal text-[#000]">
              {businessDetail?.business_valuation || "Not Provided"}
            </p>
          </div>
          <div>
            <p className="text-[11px] !font-[600] text-[#000] mb-1">
              Operational Status
            </p>
            <p className="text-[15px] font-normal text-[#000]">
              {businessDetail?.operational_status || "Not Provided"}
            </p>
          </div>
        </div>
      </div>
      <hr className="border-t border-[#D1D1D6] my-4 border-1 "></hr>


      <div className=" rounded-lg pb-8 ">
        <h3 className="text-[20px] font-semibold text-[#000] mb-4 !font-['Atacama']">
          Financials
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Column 1 */}
          <div className="space-y-4">
            <div>
              <p className="text-[11px] !font-[600] text-[#000] mb-1">
                Revenue
              </p>
              <p className="text-[17px] font-normal text-[#000]">
                {businessDetail?.annual_revenue || "Not Provided"}
              </p>
            </div>
            {businessDetail?.broadcasting_revenue && (
              <div>
                <p className="text-[11px] !font-[600] text-[#000] mb-1">
                  Broadcasting Revenue
                </p>
                <p className="text-[17px] font-normal text-[#000]">
                  {businessDetail.broadcasting_revenue}
                </p>
              </div>
            )}
            {businessDetail?.player_acquisitions && (
              <div>
                <p className="text-[11px] !font-[600] text-[#000] mb-1">
                  Player Acquisitions
                </p>
                <p className="text-[17px] font-normal text-[#000]">
                  {businessDetail.player_acquisitions}
                </p>
              </div>
            )}
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            {businessDetail?.revenue_cagr && (
              <div>
                <p className="text-[11px] !font-[600] text-[#000] mb-1">
                  Revenue CAGR
                </p>
                <p className="text-[17px] font-normal text-[#000]">
                  {businessDetail.revenue_cagr}%
                </p>
              </div>
            )}
            {businessDetail?.matchday_revenue && (
              <div>
                <p className="text-[11px] !font-[600] text-[#000] mb-1">
                  Matchday Revenue
                </p>
                <p className="text-[17px] font-normal text-[#000]">
                  {businessDetail.matchday_revenue}
                </p>
              </div>
            )}
            {businessDetail?.operating_expenses && (
              <div>
                <p className="text-[11px] !font-[600] text-[#000] mb-1">
                  Operating Expenses
                </p>
                <p className="text-[17px] font-normal text-[#000]">
                  {businessDetail.operating_expenses}
                </p>
              </div>
            )}
          </div>

          {/* Column 3 */}
          <div className="space-y-4">
            {businessDetail?.ebitda && (
              <div>
                <p className="text-[11px] !font-[600] text-[#000] mb-1">
                  EBITDA
                </p>
                <p className="text-[17px] font-normal text-[#000]">
                  {businessDetail.ebitda}
                </p>
              </div>
            )}
            {businessDetail?.commercial_revenue && (
              <div>
                <p className="text-[11px] !font-[600] text-[#000] mb-1">
                  Commercial Revenue
                </p>
                <p className="text-[17px] font-normal text-[#000]">
                  {businessDetail.commercial_revenue}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <hr className="border-t border-[#D1D1D6] my-4 border-1 "></hr>

    </div>
  );
}

export default PublishedOverviewSection;
