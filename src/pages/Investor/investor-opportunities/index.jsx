import SubHeading from "@/components/shared/subheading";
import InvestorOpportunities from "./InvestorOpportunities";

function InvestorOpportunitiesSection() {
  return (
    <div className=" border rounded-tr-[24px] min-h-[calc(100vh-100px)]">
      <div className="text-start pl-5 pt-6 text-[32px] bg-[#FFFFFF]  font-normal font-['Atacama'] leading-[120%] tracking-[0.48px] text-[#000] rounded-tr-[24px]">
        Investment Opportunities
      </div>
      <SubHeading className="text-start mt-2 !py-0 pl-5">
        {" "}
        Browse and invest in tokenized real-world assets
      </SubHeading>

      <InvestorOpportunities />
    </div>
  );
}

export default InvestorOpportunitiesSection;
