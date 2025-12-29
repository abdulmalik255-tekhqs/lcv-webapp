import InvestorDashbaordCards from "../investor-dashboard/InvestorDashbaordCards";
import InvestorPortfolioCards from "./InvestorPortfolioCards";
import InvestorPortfolioGraph from "./InvestorPortfolioGraph";
import PortfolioTable from "./PortfolioTable";

function InvestorPortfolioSection() {
  return (
    <div className="pb-16 bg-[#FAFAFC] border rounded-tr-[24px] min-h-[calc(100vh-100px)]">
      <div className=" flex px-[15px] flex-col justify-center items-start gap-[8px] self-stretch pt-6 ]">
        <div className="px-[25px] py-[10px]">
          <div className="font-['Atacama_Trial_VAR'] font-[800] [font-stretch:condensed] text-[#0A0A0A]  text-[32px] leading-[120%] tracking-normal  [text-shadow:0_4px_4px_rgba(0,0,0,0.25)]">
            Portfolio
          </div>
          <p className="font-['Montserrat'] font-normal text-[13px] leading-[150%] tracking-[0] [paragraph-spacing:13px] text-black">
            Browse and invest in tokenized real world assets
          </p>
        </div>
      </div>
      {/* <InvestorPortfolioCards /> */}
      <InvestorDashbaordCards/>
      <InvestorPortfolioGraph />
      <PortfolioTable />
    </div>
  );
}

export default InvestorPortfolioSection;
