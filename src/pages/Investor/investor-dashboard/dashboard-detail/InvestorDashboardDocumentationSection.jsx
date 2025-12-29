import downloadIcon from "@/assets/registrar-assets/downlaod.svg";
import linkIcon from "@/assets/registrar-assets/link.svg";
import pdfIcon from "@/assets/registrar-assets/pdf.svg";

function InvestorDashboardDocumentationSection({ asset }) {
  const businessDetail = asset?.assetBusinessDetail || {};



  // Map assetFiles to documents format - only include files with slug "documents"
  const documents = (asset?.assetFiles || [])
    .filter((file) => file?.slug === "documents")
    .map((file, index) => ({
      id: file.id || index,
      name: file.file_name || "Document",
      url: file.url,
      size: "12.3MB", // File size not available in API response
    }));

  // Map assetSponser to partners format
  const partners = (asset?.assetSponser || []).map((sponsor, index) => ({
    id: sponsor.id || index,
    name: sponsor.title || "Sponsor",
    logo: sponsor.url, // Logo URL from API (can be null)
    value: sponsor.value || "N/A",
    contract: sponsor.contract_year || "N/A",
  }));

  return (
    <div className="">
      <h3 className="text-[20px] font-semibold text-[#000] mb-4 !font-['Atacama']">
        Legal & Compliance Documents{" "}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {documents.length > 0 ? (
          documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center gap-2 p-2 border border-[#E5E5EA] bg-[#FAFAFC] rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >

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
                      // Trigger download
                      const link = document.createElement("a");
                      link.href = doc.url;
                      link.download = doc.name;
                      link.target = "_blank";
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
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
                      window.open(doc.url, "_blank", "noopener,noreferrer");
                    }
                  }}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                  aria-label="Open in new tab"
                >
                  <div className="flex h-7 min-w-7 px-[10px] pb-[1px] justify-center items-center gap-[10px] rounded-full border border-[#E5E5EA] bg-[#F2F2F7] text-[11px] font-semibold">
                    {" "}
                    View
                  </div>
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-[15px] text-[#48484A] col-span-2">
            No documents available
          </p>
        )}
      </div>
      <hr className="border-t border-[#D1D1D6] my-4 border-1"></hr>

      {/* Data Overview Section */}
      <div className="space-y-6">
        {/* Costs Section */}
        {/* <div> */}
        {/* <h4 className="text-[20px] font-[500] text-[#000] mb-4 !font-['Atacama']">
            Costs
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-[11px] !font-[600] text-[#000] mb-1">
                Player Acquisitions
              </p>
              <p className="text-[17px] font-normal text-[#000]">
                {businessDetail.player_acquisitions 
                  ? (businessDetail.player_acquisitions)
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-[11px] !font-[600] text-[#000] mb-1">
                Operating Expenses
              </p>
              <p className="text-[17px] font-normal text-[#000]">
                {businessDetail.operating_expenses 
                  ? (businessDetail.operating_expenses)
                  : "N/A"}
              </p>
            </div>
          </div>
        </div> */}

        <hr className="border-t border-[#D1D1D6] my-4 border-1"></hr>

        {/* Scale Section */}
        <div>
          <h4 className="text-[20px] font-[500] text-[#000] mb-4 !font-['Atacama']">
            Scale
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-[11px] !font-[600] text-[#000] mb-1">
                Global Audience Size
              </p>
              <p className="text-[17px] font-normal text-[#000]">
                {businessDetail.global_audience_size ? (businessDetail.global_audience_size): "N/A"}
              </p>
            </div>
            <div>
              <p className="text-[11px] !font-[600] text-[#000] mb-1">
                Social Media Presence
              </p>
              <p className="text-[17px] font-normal text-[#000]">
                {businessDetail.special_media_presence ? (businessDetail.special_media_presence) : "N/A"}
              </p>
            </div>
          </div>
        </div>

        <hr className="border-t border-[#D1D1D6] my-4 border-1"></hr>

        {/* Stadium Utilization Section */}
        <div>
          <h4 className="text-[20px] font-[500] text-[#000] mb-4 !font-['Atacama']">
            Stadium Utilization
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-[11px] !font-[600] text-[#000] mb-1">
                Occupancy Rate
              </p>
              <p className="text-[17px] font-normal text-[#000]">
                {businessDetail.stadium_occupancy_rate ? (businessDetail.stadium_occupancy_rate): "N/A"}
              </p>
            </div>
            <div>
              <p className="text-[11px] !font-[600] text-[#000] mb-1">
                Annual Attendance
              </p>
              <p className="text-[17px] font-normal text-[#000]">
                {businessDetail.stadium_annual_attendence ? (businessDetail.stadium_annual_attendence) : "N/A"}
              </p>
            </div>
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
                <div className={` flex items-center justify-center `}>
                  {partner.logo ? (
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="!w-[76px] !h-[76px] object-contain"
                    />
                  ) : (
                    <div className="!w-[76px] !h-[76px] flex items-center justify-center bg-gray-100 rounded">
                      <span className="text-[12px] font-medium text-gray-600 text-center px-2">
                        {partner.name.charAt(0).toUpperCase()}
                      </span>
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
            <p className="text-[15px] text-[#48484A] col-span-2">
              No sponsors available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default InvestorDashboardDocumentationSection;
