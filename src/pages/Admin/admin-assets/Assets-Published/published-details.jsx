import { useParams } from "react-router-dom";
import { useGetAssetDetails } from "@/api";
import { TableLoader } from "@/components/shared";
import PublishedBlockchainTransaction from "./PublishedBlockchainTransaction";
import PublishedDocumentationSection from "./PublishedDocumentationSection";
import PublishedHeroSection from "./PublishedHeroSection";
import PublishedIssuerSubmission from "./PublishedIssuerSubmission";
import PublishedMarketPlace from "./PublishedMarketPlace";
import PublishedOverviewSection from "./PublishedOverviewSection";
import PublishedRecentActivity from "./PublishedRecentActivity";
import PublishedTokenizationTimeline from "./PublishedTokenizationTimeline";

function AdminAssetsPublishedDetailsPage() {
  const { id } = useParams();
  const assetId = id || null;
  const { data: assetDetails, isLoading, isError } = useGetAssetDetails(assetId);
  
  if (isLoading) {
    return (
      <div className="bg-white border rounded-tr-[24px] min-h-screen flex items-center justify-center">
        <TableLoader message="Loading asset details..." />
      </div>
    );
  }
  
  if (isError || !assetDetails) {
    return (
      <div className="bg-white border rounded-tr-[24px] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">
            {id
              ? `Asset with ID: ${id} not found`
              : "Error loading asset details"}
          </p>
        </div>
      </div>
    );
  }

  // Extract data from API response
  const asset = assetDetails || {};
  
  return (
    <div className="bg-white border rounded-tr-[24px] min-h-screen">
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Asset Details */}
          <div className="lg:col-span-2 space-y-10 p-4">
            <PublishedHeroSection asset={asset} />
            <PublishedOverviewSection asset={asset} />
            <PublishedDocumentationSection asset={asset} />
          </div>

          {/* Right Column - Action Required, Submission, Blockchain, Timeline */}
          <div className="p-4 border border-l-[#E5E5EA] ">
            <PublishedMarketPlace asset={asset} />
            <PublishedRecentActivity asset={asset} />
            <PublishedIssuerSubmission asset={asset} />
            <PublishedBlockchainTransaction asset={asset} />
            <PublishedTokenizationTimeline asset={asset} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAssetsPublishedDetailsPage;
