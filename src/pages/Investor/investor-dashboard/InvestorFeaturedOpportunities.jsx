import { useEffect, useMemo, useState } from "react";
import ukFlagIcon from "@/assets/registrar-assets/flag.svg";
import photo6 from "@/assets/investor-assets/hero.svg";
import { Button } from "@/components/shared";
import { FaChevronRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import FeaturedCard from "../../../components/shared/FeaturedCard";
import { useGetTokenizedAssets } from "@/api/assets";

function InvestorFeaturedOpportunities() {
  const navigate = useNavigate();
  const [bookmarkedCards, setBookmarkedCards] = useState(new Set());
  const [countryFlags, setCountryFlags] = useState({});

  // Fetch tokenized assets
  const { data: assetsData, isLoading } = useGetTokenizedAssets();

  // Get published assets and limit to 3
  const featuredOpportunities = useMemo(() => {
    if (!assetsData || !Array.isArray(assetsData)) return [];
    
    // Filter only Published assets and sort by updated_at descending
    const publishedAssets = assetsData
      .filter((asset) => asset.status === "Published")
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 3); // Get only first 3
    
    return publishedAssets;
  }, [assetsData]);

  // Fetch country flags for all opportunities
  useEffect(() => {
    const fetchCountryFlags = async () => {
      const flags = {};
      
      for (const asset of featuredOpportunities) {
        const countryName = asset?.assetBusinessDetail?.country;
        if (!countryName || flags[countryName]) continue;

        try {
          const response = await fetch(
            `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fields=flags`
          );
          const data = await response.json();
          
          if (data && data.length > 0 && data[0].flags?.png) {
            flags[countryName] = data[0].flags.png;
          } else {
            flags[countryName] = ukFlagIcon;
          }
        } catch (error) {
          console.error(`Error fetching country flag for ${countryName}:`, error);
          flags[countryName] = ukFlagIcon;
        }
      }
      
      setCountryFlags(flags);
    };

    if (featuredOpportunities.length > 0) {
      fetchCountryFlags();
    }
  }, [featuredOpportunities]);


  // Map API data to FeaturedCard format
  const mappedOpportunities = useMemo(() => {
    return featuredOpportunities.map((asset) => {
      const country = asset?.assetBusinessDetail?.country || "";
      const city = asset?.assetBusinessDetail?.city || "";
      const location = city && country ? `${city}, ${country}` : country || city || "";
      const countryName = asset?.assetBusinessDetail?.country || "";
      
      return {
        id: asset.id,
        image: asset.featured_image || photo6,
        category: asset.assetBusinessDetail?.industry || asset.assetType?.title || "N/A",
        location: location,
        locationIcon: countryFlags[countryName] || ukFlagIcon,
        title: asset.name || "Asset",
        description: asset.marketplace_description || asset.description || "",
        minInvestment: asset.assetBusinessDetail?.minimum_investment,
        assetType: asset.assetType?.title || "N/A",
        expectedTerm: asset.assetBusinessDetail?.expected_term || "N/A",
        expectedYield: asset.assetBusinessDetail?.expected_yield || "N/A",
      };
    });
  }, [featuredOpportunities, countryFlags]);

  const handleBookmarkClick = (cardId) => {
    setBookmarkedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const handleViewAll = () => {
    navigate("/investor/opportunities");
  };

  if (isLoading) {
    return (
      <div className="bg-white p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <p className="text-left !text-[32px] font-normal font-['Atacama'] text-[#000]">
              Featured Opportunities
            </p>
            <p className="text-left !text-[#000] font-normal !text-[13px]">
              Curated investment opportunities
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3,4,5,6,7,8,9].map((i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-96"></div>
          ))}
        </div>
      </div>
    );
  }

  if (mappedOpportunities.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 ">
        <div>
          <p className="text-left !text-[32px] font-normal font-['Atacama'] text-[#000]">
            Featured Opportunities
          </p>
          <p className="text-left  !text-[#000] font-normal !text-[13px]">
            Curated investment opportunities
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="!rounded-full border !border-black"
          icon={<FaChevronRight className="!h-3 !w-3" />}
          iconPosition="right"
          onClick={handleViewAll}
        >
          {" "}
          View All{" "}
        </Button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mappedOpportunities.map((opportunity) => (
          <FeaturedCard
            key={opportunity.id}
            id={opportunity.id}
            image={opportunity.image}
            category={opportunity.category}
            location={opportunity.location}
            locationIcon={opportunity.locationIcon}
            title={opportunity.title}
            description={opportunity.description}
            minInvestment={opportunity.minInvestment}
            assetType={opportunity.assetType}
            expectedTerm={opportunity.expectedTerm}
            expectedYield={opportunity.expectedYield}
            onBookmarkClick={() => handleBookmarkClick(opportunity.id)}
            isBookmarked={bookmarkedCards.has(opportunity.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default InvestorFeaturedOpportunities;
