import React from "react";
import Card from "@/components/shared/Card";
import bookmarkIcon from "@/assets/investor-assets/bookmark.svg";

const FeatureCard = ({
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
  onClick,
}) => {
  return (
    <Card 
      className="overflow-hidden !border-[#E5E5EA] !shadow-none !rounded-lg hover:shadow-lg !p-0 transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {/* Image Header */}
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        {/* Bookmark Icon - Top Right */}
        {onBookmarkClick && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookmarkClick();
            }}
            className="absolute top-4 right-4 z-10 p-2 hover:bg-white/20 rounded-full transition-colors bg-white/10 backdrop-blur-sm"
            aria-label="Bookmark"
          >
            <img 
              src={bookmarkIcon} 
              alt="Bookmark" 
              className={`w-4 h-4 ${isBookmarked ? 'opacity-100' : 'opacity-60'}`} 
            />
          </button>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 md:p-4 relative bg-[#FAFAFC]">
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
                <img src={locationIcon} alt="Location" className="w-4 h-4" />
              )}
              <span className="text-[13px] font-medium text-[13px] text-[#000] font-['Montserrat']">
                {location}
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg md:text-[15px] font-[700] text-[#000] mb-2">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p
            className="text-[13px] font-[400] text-[#000] mb-6 font-['Montserrat'] leading-relaxed overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical",
            }}
          >
            {description}
          </p>
        )}
        
        <hr className="border-t border-[#E5E5EA] my-4 border-1" />
        
        {/* Investment Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          {minInvestment && (
            <div className="space-y-1">
              <p className="text-[11px] font-[600] text-[#000] tracking-wide font-['Montserrat']">
                Min. Investment
              </p>
              <p className="text-[15px] font-normal text-[#000]">
                {minInvestment}
              </p>
            </div>
          )}
          {assetType && (
            <div className="space-y-1">
              <p className="text-[11px] font-[600] text-[#000] tracking-wide font-['Montserrat']">
                Asset Type
              </p>
              <p className="text-[15px] font-normal text-[#000]">{assetType}</p>
            </div>
          )}
          {expectedTerm && (
            <div className="space-y-1">
              <p className="text-[11px] font-[600] text-[#000] tracking-wide font-['Montserrat']">
                Expected Term
              </p>
              <p className="text-[15px] font-normal text-[#000]">
                {expectedTerm}
              </p>
            </div>
          )}
          {expectedYield && (
            <div className="space-y-1">
              <p className="text-[11px] font-[600] text-[#000] tracking-wide font-['Montserrat']">
                Expected Yield
              </p>
              <p className="text-[15px] font-normal text-[#000]">
                {expectedYield}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default FeatureCard;

