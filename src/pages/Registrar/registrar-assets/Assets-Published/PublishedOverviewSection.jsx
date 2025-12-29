import React from "react";
import commericalIcon from "@/assets/admin-assets/commerical.svg";

function PublishedOverviewSection() {
  return (
    <div>
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="text-start !text-[40px] font-normal font-['Atacama'] text-[#000]">
          European Football Club
        </div>
        <span className="text-start !text-[#000] font-normal !text-[15px] !py-0">
          Fractional Equity Ownership
        </span>
      </div>
      <div className="text-start mt-8 text-[20px] font-[500] font-['Atacama'] text-[#000]">
        Overview
      </div>{" "}
      <p className="text-start !text-[#000] font-normal !text-[17px] mt-4 !pb-8">
        Fractional corporate ownership in the operating company that controls
        the club's commercial, media, and matchday rights, providing exposure to
        a top-tier European football brand with deep fan loyalty, regular
        European competition participation, and diversified revenue streams
        beyond matchday operations.
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
              Professional Sports & Entertainment
            </p>
          </div>
          <div>
            <p className="text-[11px] !font-[600] text-[#000] mb-1">
              Year Established
            </p>
            <p className="text-[17px] font-normal text-[#000]">1908</p>
          </div>
          <div>
            <p className="text-[11px] !font-[600] text-[#000] mb-1">
              Number of Employees
            </p>
            <p className="text-[17px] font-normal text-[#000]">420+</p>
          </div>
          <div>
            <p className="text-[11px] !font-[600] text-[#000] mb-1">
              Ownership Stake
            </p>
            <p className="text-[17px] font-normal text-[#000]">1.50%</p>
          </div>
          <div>
            <p className="text-[11px] !font-[600] text-[#000] mb-1">
              Business Valuation
            </p>
            <p className="text-[17px] font-normal text-[#000]">$650,000,000</p>
          </div>
          <div>
            <p className="text-[11px] !font-[600] text-[#000] mb-1">
              Operational Status
            </p>
            <p className="text-[15px] font-normal text-[#000]">
              Active—Top Division, regular European competition
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
                $48,000,000
              </p>
            </div>
            <div>
              <p className="text-[11px] !font-[600] text-[#000] mb-1">
                Broadcasting Revenue
              </p>
              <p className="text-[17px] font-normal text-[#000]">
                $48,000,000
              </p>
            </div>
            <div>
              <p className="text-[11px] !font-[600] text-[#000] mb-1">
                Player Acquisitions
              </p>
              <p className="text-[17px] font-normal text-[#000]">
                $348,000,000
              </p>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <div>
              <p className="text-[11px] !font-[600] text-[#000] mb-1">
                Revenue CAGR
              </p>
              <p className="text-[17px] font-normal text-[#000]">
                7.72%
              </p>
            </div>
            <div>
              <p className="text-[11px] !font-[600] text-[#000] mb-1">
                Matchday Revenue
              </p>
              <p className="text-[17px] font-normal text-[#000]">
                $48,000,000
              </p>
            </div>
            <div>
              <p className="text-[11px] !font-[600] text-[#000] mb-1">
                Operating Expenses
              </p>
              <p className="text-[17px] font-normal text-[#000]">
                $137,000,000
              </p>
            </div>
          </div>

          {/* Column 3 */}
          <div className="space-y-4">
            <div>
              <p className="text-[11px] !font-[600] text-[#000] mb-1">
                EBITDA
              </p>
              <p className="text-[17px] font-normal text-[#000]">
                $1,536,000
              </p>
            </div>
            <div>
              <p className="text-[11px] !font-[600] text-[#000] mb-1">
                Commercial Revenue
              </p>
              <p className="text-[17px] font-normal text-[#000]">
                $48,000,000
              </p>
            </div>
          </div>
        </div>
      </div>
      <hr className="border-t border-[#D1D1D6] my-4 border-1 "></hr>

    </div>
  );
}

export default PublishedOverviewSection;
