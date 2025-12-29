import React from "react";

function PublishedMarketPlace() {
  // Marketplace data
  const marketplaceData = {
    tokensSold: 57, // percentage
    investors: 127,
    capitalRaised: {
      current: 2900000,
      target: 5000000,
    },
    tokensDistributed: {
      current: 1100000,
      target: 5000000,
    },
  };

  // Calculate percentages
  const capitalRaisedPercentage = Math.round(
    (marketplaceData.capitalRaised.current / marketplaceData.capitalRaised.target) * 100
  );
  const tokensDistributedPercentage = Math.round(
    (marketplaceData.tokensDistributed.current / marketplaceData.tokensDistributed.target) * 100
  );

  return (
    <div className="bg-white ">
      <div className="">

        <h4 className="text-[20px] font-[500] text-[#000] mb-6 !font-['Atacama']">
          Marketplace Performance
        </h4>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Tokens Sold Card */}
          <div className="bg-[#FAFAFC] border border-[#E5E5EA] rounded-lg py-2 px-4">
            <div className="text-[24px] font-medium text-[#000] mb-2">
              {marketplaceData.tokensSold}%
            </div>
            <div className="text-[13px] font-normal text-[#000]">Tokens Sold</div>
          </div>

          {/* Investors Card */}
          <div className="bg-[#FAFAFC] border border-[#E5E5EA] rounded-lg py-2 px-4">
            <div className="text-[24px] font-medium text-[#000] mb-2">
              {marketplaceData.investors}
            </div>
            <div className="text-[13px] font-normal text-[#000]">Investors</div>
          </div>
        </div>

        {/* Progress Sections */}
        <div className="space-y-3">
          {/* Capital Raised */}
          <div className="bg-white ">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[11px] font-semibold text-[#000]">
                Capital Raised
              </span>
              <span className="text-[13px] font-[400] text-[#000]">
                {marketplaceData.capitalRaised.current} /{" "}
                {marketplaceData.capitalRaised.target}
              </span>
            </div>
            <div className="w-full h-2 bg-[#E5E5EA] rounded-full overflow-hidden ">
              <div
                className="h-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full transition-all duration-500"
                style={{ width: `${capitalRaisedPercentage}%` }}
              />
            </div>
            <div className="text-[11px] font-semibold text-[#000]">{capitalRaisedPercentage}%</div>
          </div>

          {/* Tokens Distributed */}
          <div className="bg-white !mt-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[11px] font-semibold text-[#000]">
                Tokens Distributed
              </span>
              <span className="text-[13px] font-[400] text-[#000]">
                  {marketplaceData.tokensDistributed.current} /{" "}
                {marketplaceData.tokensDistributed.target}
              </span>
            </div>
            <div className="w-full h-2 bg-[#E5E5EA] rounded-full overflow-hidden ">
              <div
                className="h-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full transition-all duration-500"
                style={{ width: `${tokensDistributedPercentage}%` }}
              />
            </div>
            <div className="text-[11px] font-semibold text-[#000]">{tokensDistributedPercentage}%</div>
          </div>
        </div>
      </div>
      <hr className="border-t border-[#D1D1D6]  border-1 mt-4 "></hr>
    </div>
  );
}

export default PublishedMarketPlace;
