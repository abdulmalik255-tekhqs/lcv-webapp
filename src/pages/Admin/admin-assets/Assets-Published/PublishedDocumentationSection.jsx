import pdfIcon from "@/assets/registrar-assets/pdf.svg";
import linkIcon from "@/assets/registrar-assets/link.svg";
import downloadIcon from "@/assets/registrar-assets/downlaod.svg";
import nikeLogo from "@/assets/registrar-assets/nike.svg";
import emirateLogo from "@/assets/registrar-assets/emirate.svg";
import snapdragonLogo from "@/assets/registrar-assets/snapdragon.svg";
import americianLogo from "@/assets/registrar-assets/americian.svg";


function PublishedDocumentationSection({ asset }) {
  const assetFiles = asset?.assetFiles || [];
  const businessDetail = asset?.assetBusinessDetail || {};
  const assetSponsers = asset?.assetSponser || [];

  // Map documents from assetFiles (filter for documents slug)
  const documents = assetFiles
    .filter((file) => file.slug === "documents")
    .map((file, index) => ({
      id: file.id || index,
      name: file.file_name || "Document",
      size: "N/A", // Size not provided in API
      url: file.url,
    }));

  // Map sponsors from assetSponser
  const partners = assetSponsers.map((sponsor, index) => ({
    id: sponsor.id || index,
    name: sponsor.title || "Sponsor",
    logo: sponsor.url || null, // Logo URL from API (can be null)
    value: sponsor.value || "N/A",
    contract: sponsor.contract_year || "N/A",
  }));

  return (
    <div className="">
      <h3 className="text-[20px] font-semibold text-[#000] mb-4 !font-['Atacama']">
        Documentation
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center gap-2 p-2 border border-[#E5E5EA] bg-[#FAFAFC] rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            {/* Document Thumbnail with PDF Icon Overlay */}

            {/* PDF Icon Overlay - Red square with PDF text */}
            <div className="">
              <img
                src={pdfIcon}
                alt="PDF"
                className="w-12 h-12 object-contain"
              />
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-medium text-[#000] truncate">
                {doc.name}
              </p>
              <p className="text-[11px] text-[#000] font-medium mt-1">
                {doc.size}
              </p>
            </div>

            {/* Action Icons */}
            <div className="flex items-center  flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (doc.url) {
                    const link = document.createElement("a");
                    link.href = doc.url;
                    link.download = doc.name;
                    link.click();
                  }
                }}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                aria-label="Download"
              >
                <img
                  src={downloadIcon}
                  alt="Download"
                  className="w-5 h-5 text-gray-600"
                />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (doc.url) {
                    window.open(doc.url, "_blank");
                  }
                }}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                aria-label="Open in new tab"
              >
                <img
                  src={linkIcon}
                  alt="External link"
                  className="w-5 h-5 text-gray-600"
                />
              </button>
            </div>
          </div>
        ))}
      </div>
      <hr className="border-t border-[#D1D1D6] my-4 border-1"></hr>

      {/* Data Overview Section */}
      <div className="space-y-6">
        {/* Costs Section */}
        <div>
          <h4 className="text-[20px] font-[500] text-[#000] mb-4 !font-['Atacama']">
            Costs
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {businessDetail?.player_acquisitions && (
              <div>
                <p className="text-[11px] !font-[600] text-[#000] mb-1">
                  Player Acquisitions
                </p>
                <p className="text-[17px] font-normal text-[#000]">
                  {businessDetail.player_acquisitions}
                </p>
              </div>
            )}
            {businessDetail?.operating_expenses && (
              <div>
                <p className="text-[11px] !font-[600] text-[#000] mb-1">
                  Operating Expenses
                </p>
                <p className="text-[17px] font-normal text-[#000]">
                  {businessDetail.operating_expenses}
                </p>
              </div>
            )}
          </div>
        </div>

        <hr className="border-t border-[#D1D1D6] my-4 border-1"></hr>

        {/* Scale Section */}
        <div>
          <h4 className="text-[20px] font-[500] text-[#000] mb-4 !font-['Atacama']">
            Scale
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {businessDetail?.global_audience_size && (
              <div>
                <p className="text-[11px] !font-[600] text-[#000] mb-1">
                  Global Audience Size
                </p>
                <p className="text-[17px] font-normal text-[#000]">
                  {businessDetail.global_audience_size}
                </p>
              </div>
            )}
            {businessDetail?.special_media_presence && (
              <div>
                <p className="text-[11px] !font-[600] text-[#000] mb-1">
                  Social Media Presence
                </p>
                <p className="text-[17px] font-normal text-[#000]">
                  {businessDetail.special_media_presence}
                </p>
              </div>
            )}
          </div>
        </div>

        <hr className="border-t border-[#D1D1D6] my-4 border-1"></hr>

        {/* Stadium Utilization Section */}
        <div>
          <h4 className="text-[20px] font-[500] text-[#000] mb-4 !font-['Atacama']">
            Stadium Utilization
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {businessDetail?.stadium_occupancy_rate && (
              <div>
                <p className="text-[11px] !font-[600] text-[#000] mb-1">
                  Occupancy Rate
                </p>
                <p className="text-[17px] font-normal text-[#000]">
                  {businessDetail.stadium_occupancy_rate}%
                </p>
              </div>
            )}
            {businessDetail?.stadium_annual_attendence && (
              <div>
                <p className="text-[11px] !font-[600] text-[#000] mb-1">
                  Annual Attendance
                </p>
                <p className="text-[17px] font-normal text-[#000]">
                  {businessDetail.stadium_annual_attendence}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <hr className="border-t border-[#D1D1D6] my-6 border-1 "></hr>

      {/* Key Sponsors and Partners Section */}
      <div>
        <h4 className="text-[20px] font-[500] text-[#000] mb-4 !font-['Atacama']">
          Key Sponsors and Partners
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {partners.length > 0 ? (
            partners.map((partner) => (
              <div
                key={partner.id}
                className="flex items-center gap-4  border border-[#E5E5EA] bg-[#FAFAFC] rounded-xl"
              >
                <div className="flex items-center justify-center">
                  {partner.logo ? (
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="!w-[76px] !h-[76px] object-contain"
                    />
                  ) : (
                    <div className="!w-[76px] !h-[76px] flex items-center justify-center bg-gray-200 rounded">
                      <span className="text-xs text-gray-500">No Logo</span>
                    </div>
                  )}
                </div>

              <div className="flex-1 gap-4">
                <p className="text-[15px] font-medium text-[#000] mb-2 mt-2">
                  {partner.name}
                </p>
                <div className="flex gap-16">
                  <div className="flex flex-col">
                    <span className="text-[11px] !font-[600] text-[#000]">
                      Value
                    </span>
                    <span className="text-[15px] font-medium text-[#000]">
                      {partner.value}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[11px] !font-[600] text-[#000]">
                      Contract
                    </span>
                    <span className="text-[15px] font-medium text-[#000]">
                      {partner.contract}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
          ) : (
            <div className="col-span-2 text-center py-4 text-gray-500">
              No sponsors available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PublishedDocumentationSection;
