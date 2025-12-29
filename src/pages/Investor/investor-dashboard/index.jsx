import InvestorDashbaordCards from "./InvestorDashbaordCards";
import InvestorDashboardHeroSection from "./InvestorDashboardHeroSection";
import InvestorFeaturedOpportunities from "./InvestorFeaturedOpportunities";
import InvestorRecentListing from "./InvestorRecentListing";
import InvestorTechnology from "./InvestorTechnology";
import InvestorSustainability from "./InvestorSustainability";

function InvestorDashboardSection() {
  return (
    <div className="pb-4 bg-[#FAFAFC] border rounded-tr-[24px] rounded-tr-[24px] min-h-[calc(100vh-100px)]">
      <InvestorDashbaordCards />
      <hr className="my-2 border-t border-[#E5E5EA]" />
      <InvestorDashboardHeroSection />
      <InvestorFeaturedOpportunities />
      {/* <InvestorRecentListing /> */}
      {/* <InvestorTechnology /> */}
      {/* <InvestorSustainability /> */}
    </div>
  );
}

export default InvestorDashboardSection;
