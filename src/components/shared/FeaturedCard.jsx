import React from "react";
import { FaBookmark } from "react-icons/fa6";
import Card from "@/components/shared/Card";
import bookmarkIcon from "@/assets/investor-assets/bookmark.svg";
import { useNavigate } from "react-router-dom";
const FeaturedCard = ({
  image,
  category,
  location,
  locationIcon,
  title,
  description,
  minInvestment,
  assetType,
  expectedTerm,
  expectedYield,
  onBookmarkClick,
  isBookmarked = false,
  id,
}) => {
  const navigate = useNavigate();
  const assetId = id || "f343c5e0-f262-4acc-8bc5-a4e72d721f15";
  return (
    <Card className="overflow-hidden !border-[#E5E5EA] !shadow-none !rounded-none hover:shadow-lg !p-0 transition-shadow" >
      {/* Image Header */}
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x225?text=Image+Not+Available";
          }}
        />
      </div>

      {/* Content Section */}
      <div className="p-5 md:p-4 relative bg-[#FAFAFC] cursor-pointer" onClick={() => navigate(`/investor/dashboard/detail/${assetId}`)}>
        {/* Bookmark Icon - Top Right */}
        <button
          onClick={onBookmarkClick}
          className="absolute top-5 right-5 md:top-4 md:right-2 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Bookmark"
        >
          <img src={bookmarkIcon} alt="Bookmark" className="w-4 h-4" />
        </button>

        {/* Category and Location */}
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          {category && (
            <span className="inline-block px-3 py-1 !bg-white border border-[#E5E5EA] text-[#000] text-[11px] font-[600] font-['Montserrat'] rounded-full">
              {category}
            </span>
          )}
          {location && (
            <div className="flex items-center gap-1.5">
              {locationIcon && (
                <img 
                  src={locationIcon} 
                  alt="Location" 
                  className="w-4 h-4"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <span className="text-[13px] font-medium text-[13px] text-[#000] font-['Montserrat']">
                {location}
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg md:text-[15px] font-[700] text-[#000] mb-2 pr-8 ">
          {title}
        </h3>

        {/* Description */}
        <p
          className="text-[13px] font-[400] text-[#000] mb-6 font-['Montserrat']h-[40px] min-h-[40px] max-h-[40px]  leading-relaxed overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
          }}
        >
          {description}
        </p>
        <hr className="border-t border-[#E5E5EA] my-4 border-1 " />
        {/* Investment Details Grid */}
        <div className="grid grid-cols-2 gap-4 border-t border-gray-100  ">
          <div className="space-y-1">
            <p className="text-[11px] font-[600] text-[#000] tracking-wide font-['Montserrat']">
              Min. Investment
            </p>
            <p className="text-[15px] font-normal text-[#000]">
              {minInvestment}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-[600] text-[#000] tracking-wide font-['Montserrat']">
              Asset Type
            </p>
            <p className="text-[15px] font-normal text-[#000]">{assetType}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-[600] text-[#000] tracking-wide font-['Montserrat']">
              Expected Term
            </p>
            <p className="text-[15px] font-normal text-[#000]">
              {expectedTerm}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-[600] text-[#000] tracking-wide font-['Montserrat']">
              Expected Yield
            </p>
            <p className="text-[15px] font-normal text-[#000]">
              {expectedYield}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FeaturedCard;
