import { useParams } from "react-router-dom";
import { useGetAssetDetails, useGetPurchaseRequestOrder } from "@/api";
import { TableLoader } from "@/components/shared";
import InvestorDashboardDocumentationSection from "./InvestorDashboardDocumentationSection";
import InvestorDashboardHeroSection from "./InvestorDashboardHeroSection";
import InvestorDashboardMarketPlace from "./InvestorDashboardMarketPlace";
import InvestorDashboardOverviewSection from "./InvestorDashboardOverviewSection";

function InvestorDashboardDetail() {
  const { id } = useParams();
  const assetId = id || null;
  const purchaseRequestId = id || null;

  const { data: assetDetails, isLoading: isLoadingAsset } =
    useGetAssetDetails(assetId);
  
  // Fetch purchase request order when page loads
  const { data: purchaseRequestOrder, isLoading: isLoadingOrder } =
    useGetPurchaseRequestOrder(purchaseRequestId);

  // Show loader while fetching asset details
  if (isLoadingAsset) {
    return (
      <div className="bg-white border rounded-tr-[24px] min-h-screen flex items-center justify-center">
        <TableLoader message="Loading asset details..." />
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
            <InvestorDashboardHeroSection asset={asset} />
            <InvestorDashboardOverviewSection asset={asset} />
            <InvestorDashboardDocumentationSection asset={asset} />
          </div>

          {/* Right Column - Action Required, Submission, Blockchain, Timeline */}
          <div className="p-4 border border-l-[#E5E5EA] rounded-tr-[24px] ">
            <InvestorDashboardMarketPlace 
              asset={asset} 
              assetId={assetId} 
              purchaseRequestOrder={purchaseRequestOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvestorDashboardDetail;
