import PublishedBlockchainTransaction from "./PublishedBlockchainTransaction";
import PublishedDocumentationSection from "./PublishedDocumentationSection";
import PublishedHeroSection from "./PublishedHeroSection";
import PublishedIssuerSubmission from "./PublishedIssuerSubmission";
import PublishedMarketPlace from "./PublishedMarketPlace";
import PublishedOverviewSection from "./PublishedOverviewSection";
import PublishedRecentActivity from "./PublishedRecentActivity";
import PublishedTokenizationTimeline from "./PublishedTokenizationTimeline";

function AssetsPublishedDetailsPage() {
  return (
    <div className="bg-white border rounded-tr-[24px] min-h-screen">
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Asset Details */}
          <div className="lg:col-span-2 space-y-10 p-4">
            <PublishedHeroSection />
            <PublishedOverviewSection />
            <PublishedDocumentationSection />
          </div>

          {/* Right Column - Action Required, Submission, Blockchain, Timeline */}
          <div className="p-4 border border-l-[#E5E5EA] ">
            <PublishedMarketPlace />
            <PublishedRecentActivity />
            <PublishedIssuerSubmission />
            <PublishedBlockchainTransaction />
            <PublishedTokenizationTimeline />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssetsPublishedDetailsPage;
