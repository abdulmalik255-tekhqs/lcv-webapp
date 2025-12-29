import React from "react";
import UserCards from "./UsersCards";
import InvestorTable from "./InvestorTable";

function AdminInvestorsSection() {
  return (
    <div className=" flex flex-col pt-[40px] !px-[32px] pb-[50] bg-[#FFF] min-h-[calc(100vh-100px)]">
      {/* Top Heading */}
      <div className="px-[15px] py-[0px]  flex  flex-col justify-center items-start gap-2">
        <div className=" text-[32px] font-medium text-[#0A0A0A]">
          Investors
        </div>
        <p className=" text-[16px] font-normal text-[#4A5565]">
          Token holders across all assets on the platform.
        </p>
      </div>

      <UserCards />
      <InvestorTable />
    </div>
  );
}

export default AdminInvestorsSection;
