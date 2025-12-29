import pdfIcon from "@/assets/registrar-assets/pdf.svg";
import linkIcon from "@/assets/registrar-assets/link.svg";
import downloadIcon from "@/assets/registrar-assets/downlaod.svg";
import nikeLogo from "@/assets/registrar-assets/nike.svg";
import emirateLogo from "@/assets/registrar-assets/emirate.svg";
import snapdragonLogo from "@/assets/registrar-assets/snapdragon.svg";
import americianLogo from "@/assets/registrar-assets/americian.svg";

function PublishedDocumentationSection() {
  const documents = [
    {
      id: 1,
      name: "Prospectus.pdf",
      size: "12.3MB",
    },
    {
      id: 2,
      name: "Key-Sponsorships.pdf",
      size: "12.3MB",
    },
    {
      id: 3,
      name: "Financials.pdf",
      size: "12.3MB",
    },
    {
      id: 4,
      name: "Operating-Expenses.pdf",
      size: "12.3MB",
    },
  ];

  const partners = [
    {
      id: 1,
      name: "Nike",
      logo: nikeLogo,
      value: "$100M+",
      contract: "10 years",
    },
    {
      id: 2,
      name: "Emirates",
      logo: emirateLogo,
      value: "$100M+",
      contract: "10 years",
    },
    {
      id: 3,
      name: "Snapdragon",
      logo: snapdragonLogo,
      value: "$100M+",
      contract: "10 years",
    },
    {
      id: 4,
      name: "American Express",
      logo: americianLogo,
      value: "$100M+",
      contract: "10 years",
    },
  ];

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
                  console.log("Download:", doc.name);
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
                  console.log("Open link:", doc.name);
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
            <div>
              <p className="text-[11px] !font-[600] text-[#000] mb-1">
                Player Acquisitions
              </p>
              <p className="text-[17px] font-normal text-[#000]">
                $348,000,000
              </p>
            </div>
            <div>
              <p className="text-[11px] !font-[600] text-[#000] mb-1">
                Operating Expenses
              </p>
              <p className="text-[17px] font-normal text-[#000]">
                $137,000,000
              </p>
            </div>
          </div>
        </div>

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
              <p className="text-[17px] font-normal text-[#000]">550M+</p>
            </div>
            <div>
              <p className="text-[11px] !font-[600] text-[#000] mb-1">
                Social Media Presence
              </p>
              <p className="text-[17px] font-normal text-[#000]">
                150M+ Connections
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
              <p className="text-[17px] font-normal text-[#000]">92%</p>
            </div>
            <div>
              <p className="text-[11px] !font-[600] text-[#000] mb-1">
                Annual Attendance
              </p>
              <p className="text-[17px] font-normal text-[#000]">
                597,800 Attendees
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
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="flex items-center gap-4  border border-[#E5E5EA] bg-[#FAFAFC] rounded-xl"
            >
              <div
                className={` flex items-center justify-center `}
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="!w-[76px] !h-[76px] "
                />
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
          ))}
        </div>
      </div>
    </div>
  );
}

export default PublishedDocumentationSection;
