import UserCards from "./DashbaordCards";
import TokenizationRequests from "./TokenizationRequests";
import IssuanceQueue from "./IssuanceQueue";
import Heading from "@/components/shared/heading";

function RegistrarDashboardSection() {
  return (
    <div className="pb-16 bg-[#FAFAFC] border rounded-tr-[24px] rounded-tr-[24px] min-h-[calc(100vh-100px)]">
       <div className="text-start pl-7 py-8 text-[32px] bg-[#FFFFFF] border-b border-gray-100 font-normal font-['Atacama'] leading-[120%] tracking-[0.48px] text-[#000] rounded-tr-[24px]">
       Completed Deals & Platform Overview
      </div>
      <UserCards />
      <div className="p-4 md:px-6 md:py-0 flex flex-row   gap-6">
      <div className="bg-[#FFFFFF]  border border-[#E5E5EA] shadow-[0_0_30px_rgba(0,0,0,0.08)]  rounded-[7px] p-4 md:p-4 w-1/2">
      <TokenizationRequests />
        </div>
        <div className="bg-[#FFFFFF]  border border-[#E5E5EA] shadow-[0_0_30px_rgba(0,0,0,0.08)]  rounded-[7px] p-4 md:p-4 w-1/2">
          <IssuanceQueue />
        </div>
      </div>
    </div>
  );
}

export default RegistrarDashboardSection;
