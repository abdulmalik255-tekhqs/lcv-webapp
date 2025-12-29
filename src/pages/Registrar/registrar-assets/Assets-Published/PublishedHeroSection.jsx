import React, { useState, useRef } from "react";
import badgeIcon from "@/assets/registrar-assets/upcoming.svg";
import dollarSignIcon from "@/assets/registrar-assets/dollar.svg";
import photoIcon from "@/assets/registrar-assets/photo.svg";
import vedioIcon from "@/assets/registrar-assets/vedio.svg";
import photo2 from "@/assets/registrar-assets/photo 2.svg";
import photo3 from "@/assets/registrar-assets/photo 3.svg";
import photo4 from "@/assets/registrar-assets/photo 4.svg";
import photo5 from "@/assets/registrar-assets/photo 5.svg";
import photo6 from "@/assets/registrar-assets/photo 6.svg";
import photo7 from "@/assets/registrar-assets/photo 7.svg";
import photo8 from "@/assets/registrar-assets/photo 8.svg";
import photo9 from "@/assets/registrar-assets/photo 9.svg";
import photo10 from "@/assets/registrar-assets/photo 10.svg";
import ukFlagIcon from "@/assets/registrar-assets/flag.svg";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

function PublishedHeroSection() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const thumbnailContainerRef = useRef(null);

  // Hero images should be 825x400, thumbnails should be 138x72
  const images = [
    {
      id: 1,
      url: photo6,
      thumbnail: photo6,
    },
    {
      id: 2,
      url: photo2,
      thumbnail: photo2,
    },
    {
      id: 3,
      url: photo3,
      thumbnail: photo3,
    },
    {
      id: 4,
      url: photo4,
      thumbnail: photo4,
    },
    {
      id: 5,
      url: photo5,
      thumbnail: photo5,
    },
    {
      id: 6,
      url: photo6,
      thumbnail: photo6,
    },
    {
      id: 7,
      url: photo7,
      thumbnail: photo7,
    },
    {
      id: 8,
      url: photo8,
      thumbnail: photo8,
    },
    {
      id: 9,
      url: photo9,
      thumbnail: photo9,
    },
    {
      id: 10,
      url: photo10,
      thumbnail: photo10,
    },
  ];

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
  };

  const scrollThumbnails = (direction) => {
    const container = thumbnailContainerRef.current;
    if (!container) return;

    const scrollAmount = 150; // 138px thumbnail width + 8px gap
    const currentScroll = container.scrollLeft;
    const newScroll =
      direction === "left"
        ? currentScroll - scrollAmount
        : currentScroll + scrollAmount;

    container.scrollTo({
      left: newScroll,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-white overflow-hidden">
      {/* Main Hero Image Section */}
      <div className="relative w-full" style={{ aspectRatio: "825/400" }}>
        <img
          src={images[selectedImageIndex].url}
          alt={`Hero image ${selectedImageIndex + 1}`}
          className="w-full h-full object-cover"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        {/* Tags Overlay */}
        <div className="absolute top-3 left-4 flex gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-white backdrop-blur-sm rounded-full px-3 py-1.5">
            <img src={badgeIcon} alt="Badge" className="w-3 h-3" />
            <span className="text-[11px] font-[600] text-[#000]">New Listing</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white backdrop-blur-sm rounded-full px-3 py-1.5">
            <img src={dollarSignIcon} alt="Dollar" className="w-3 h-3" />
            <span className="text-[11px] font-[600] text-[#000]">High Yield</span>
          </div>
        </div>

        {/* Action Buttons - Bottom Left */}
        <div className="absolute bottom-0 left-0 flex ">
          <button className="flex items-center gap-2 text-sm font-[500] text-[13px] text-white bg-white backdrop-blur-sm  px-3 py-1.5 hover:bg-white transition-colors">
            <img src={photoIcon} alt="Photo" className="w-4 h-4" />
            <span className="text-[13px] font-[500] text-[#000]">10 Photos</span>
            <span className="inline-block h-6 w-px mx-2 bg-[#E5E5EA] align-middle"></span>
          </button>
          <button className="flex items-center gap-2 text-sm font-[500] text-[13px] text-white bg-white backdrop-blur-sm  px-3 py-1.5 hover:bg-white transition-colors">
            <img src={vedioIcon} alt="Video" className="w-4 h-4" />
            <span className="text-[13px] font-[500] text-[#000]">Virtual Tour</span>    
          </button>
        </div>
      </div>

      {/* Thumbnail Carousel */}
      <div className="relative p-4">
        <div className="flex items-center gap-1">
          {/* Left Arrow */}
          <button
            onClick={() => scrollThumbnails("left")}
            className="flex-shrink-0 w-8 h-12 flex items-center justify-center bg-black !text-white rounded hover:bg-gray-800 transition-colors"
            aria-label="Scroll left"
          >
            <FaArrowLeft className="w-4 h-4 !text-white !color-white" />
          </button>

          {/* Thumbnail Container */}
          <div
            ref={thumbnailContainerRef}
            className="flex-1 flex gap-2 overflow-x-auto scroll-smooth scrollbar-hide"
          >
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => handleThumbnailClick(index)}
                className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImageIndex === index
                    ? "border-[#0734A9] ring-5 border !border-2 ring-[#0734A9]/80"
                    : "border-transparent hover:border-gray-300"
                }`}
                style={{ width: "138px", height: "72px" }}
              >
                <img
                  src={image.thumbnail}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  style={{ width: "138px", height: "72px", objectFit: "cover" }}
                />
              </button>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scrollThumbnails("right")}
            className="flex-shrink-0 w-8 h-12 flex items-center justify-center bg-black rounded hover:bg-gray-800 transition-colors"
            aria-label="Scroll right"
          >
            <FaArrowRight className="w-4 h-4 !text-white !color-white" />
          </button>
        </div>
      </div>

      {/* Bottom Tags */}
      <div className="flex gap-2 px-4  flex-wrap">
        <div className="inline-flex items-center gap-2 bg-white border border-[#D1D1D6] rounded-full px-3 py-1">
          <span className="text-[11px] font-[600] text-[#000]">
            Pro. Sports & Entertainment
          </span>
        </div>
        <div className="inline-flex items-center gap-2  rounded-full px-3 py-1.5">
            <img src={ukFlagIcon} alt="UK Flag" className="w-4 h-4" />
          <span className="text-[11px] font-[600] text-[#000]">London, UK</span>
        </div>
      </div>
    </div>
  );
}

export default PublishedHeroSection;
