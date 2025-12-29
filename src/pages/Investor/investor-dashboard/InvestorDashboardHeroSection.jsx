import { useEffect, useMemo, useState } from "react";
import ukFlagIcon from "@/assets/registrar-assets/flag.svg";
import photo6 from "@/assets/investor-assets/hero.svg";
import { FaChevronRight, FaStar } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useGetTokenizedAssets } from "@/api/assets";

function InvestorDashboardHeroSection() {
  const navigate = useNavigate();
  const [countryFlagUrl, setCountryFlagUrl] = useState(ukFlagIcon);

  // Fetch tokenized assets
  const { data: assetsData, isLoading } = useGetTokenizedAssets();

  // Get the latest/updated record (sorted by updated_at descending)
  const latestAsset = useMemo(() => {
    if (!assetsData || !Array.isArray(assetsData)) return null;
    
    // Filter only Published assets and sort by updated_at descending
    const publishedAssets = assetsData
      .filter((asset) => asset.status !== "Rejected")
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    
    return publishedAssets.length > 0 ? publishedAssets[0] : null;
  }, [assetsData]);

  // Fetch country flag
  useEffect(() => {
    const fetchCountryFlag = async () => {
      const countryName = latestAsset?.assetBusinessDetail?.country;
      if (!countryName) {
        setCountryFlagUrl(ukFlagIcon);
        return;
      }

      try {
        const response = await fetch(
          `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fields=flags`
        );
        const data = await response.json();
        
        if (data && data.length > 0 && data[0].flags?.png) {
          setCountryFlagUrl(data[0].flags.png);
        } else {
          setCountryFlagUrl(ukFlagIcon);
        }
      } catch (error) {
        console.error("Error fetching country flag:", error);
        setCountryFlagUrl(ukFlagIcon);
      }
    };

    if (latestAsset) {
      fetchCountryFlag();
    }
  }, [latestAsset]);

 

  // If loading or no asset, show placeholder or return null
  if (isLoading) {
    return (
      <div className="bg-white overflow-hidden p-2 sm:p-4 md:p-6">
        <div className="relative w-full aspect-[825/400] min-h-[300px] sm:min-h-[350px] md:min-h-[400px] bg-gray-200 animate-pulse"></div>
      </div>
    );
  }

  if (!latestAsset) {
    return null;
  }

  // Map API data to component fields
  const heroImage = latestAsset.featured_image || photo6;
  const title = latestAsset.name || "Asset";
  const description = latestAsset.marketplace_description || latestAsset.description || "";
  const country = latestAsset.assetBusinessDetail?.country || "";
  const city = latestAsset.assetBusinessDetail?.city || "";
  const location = city && country ? `${city}, ${country}` : country || city || "";
  const minInvestment = latestAsset.assetBusinessDetail?.minimum_investment || "N/A";
  const expectedTerm = latestAsset.assetBusinessDetail?.expected_term || "N/A";
  const assetType = latestAsset.assetType?.title || "N/A";
  const expectedYield = latestAsset.assetBusinessDetail?.expected_yield || "N/A";
  const isPublished = latestAsset.status === "Published";
  const assetId = latestAsset.id;

  return (
    <div className="bg-white overflow-hidden p-2 sm:p-4 md:p-6">
      {/* Main Hero Image Section */}
      <div className="relative w-full aspect-[825/400] sm:aspect-[825/400] md:aspect-[825/400] min-h-[300px] sm:min-h-[350px] md:min-h-[400px]">
        <img
          src={heroImage}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = photo6;
          }}
        />

        {/* Overlay gradient for text readability - responsive */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30 sm:from-black/80 sm:via-black/40 sm:to-black/30"></div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-3 sm:p-4 md:p-6 lg:p-8">
          {/* Top Section - Featured Badge and Location */}
          <div className="flex items-start justify-between w-full">
            <div className="flex items-center gap-2 sm:gap-4 md:gap-6 flex-wrap">
              {/* Featured Badge - only show if Published */}
              {isPublished && (
                <div className="flex items-center gap-1 sm:gap-1.5 bg-white rounded-full px-2 py-1 sm:px-3 sm:py-1.5">
                  <FaStar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-600" />
                  <span className="text-[10px] sm:text-[11px] font-[600] text-[#000]">
                    Featured
                  </span>
                </div>
              )}
              {/* Location */}
              {location && (
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <img 
                    src={countryFlagUrl} 
                    alt={country || "Country Flag"} 
                    className="w-3 h-3 sm:w-4 sm:h-4" 
                    onError={(e) => {
                      e.target.src = ukFlagIcon;
                    }}
                  />
                  <span className="text-[10px] sm:text-[11px] font-[600] text-white">
                    {location}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Section - Title, Description, Details, and CTA */}
          <div className="space-y-3 sm:space-y-4 w-full max-w-full sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%]">
            {/* Title */}
            <h1 className="text-white text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] mt-4 sm:mt-6 md:mt-8 font-normal font-['Atacama'] leading-tight">
              {title}
            </h1>

            {/* Description */}
            {description && (
              <p className="text-white text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] leading-relaxed !font-['Montserrat'] font-[500] line-clamp-3 sm:line-clamp-none">
                {description}
              </p>
            )}

            {/* Investment Details */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 !mt-4 sm:!mt-6 md:!mt-4 lg:!mt-6 mb-4 sm:mb-4 md:mb-4">
              {/* Left Column */}
              <div className="space-y-1 sm:space-y-2">
                <p className="text-white text-[10px] sm:text-[11px] font-[600] font-['Montserrat'] tracking-wide">
                  Min. Investment
                </p>
                <p className="text-white text-[13px] sm:text-[14px] md:text-[15px] font-normal">{minInvestment}</p>
                <p className="text-white text-[10px] sm:text-[11px] font-[600] font-['Montserrat'] tracking-wide mt-2 sm:mt-4">
                  Expected Term
                </p>
                <p className="text-white text-[13px] sm:text-[14px] md:text-[15px] font-normal">{expectedTerm}</p>
              </div>

              {/* Right Column */}
              <div className="space-y-1 sm:space-y-2">
                <p className="text-white text-[10px] sm:text-[11px] font-[600] font-['Montserrat'] tracking-wide">
                  Asset Type
                </p>
                <p className="text-white text-[13px] sm:text-[14px] md:text-[15px] font-normal">{assetType}</p>
                <p className="text-white text-[10px] sm:text-[11px] font-[600] font-['Montserrat'] tracking-wide mt-2 sm:mt-4">
                  Expected Yield
                </p>
                <p className="text-white text-[13px] sm:text-[14px] md:text-[15px] font-normal">{expectedYield}</p>
              </div>
            </div>

            {/* View Details Button */}
            <button
              className="flex items-center justify-center gap-2 !mt-4 sm:!mt-4 md:!mt-4 lg:!mt-4 border border-white text-white rounded-full px-4 py-2 sm:px-6 sm:py-2.5 hover:bg-white hover:text-black transition-colors w-full sm:w-auto"
              onClick={() => navigate(`/investor/dashboard/detail/${assetId}`)}
            >
              <span className="text-[12px] sm:text-[13px] md:text-[14px] font-[500]">View Details</span>
              <FaChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvestorDashboardHeroSection;
