import photo1 from "@/assets/investor-assets/img-01.svg";
import photo2 from "@/assets/investor-assets/img-02.svg";
import photo3 from "@/assets/investor-assets/img-03.svg";
import { Button } from "@/components/shared";
import { FaChevronRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const TECHNOLOGY_COMPANIES = [
  {
    id: 1,
    image: photo1,
    name: "Quantum Logic Systems",
    category: "AI & Technology",
    revenue: "$48,000,000",
    revenueCAGR: "7.72%",
    expectedTerm: "5 Years",
    ebita: "$1,536,000",
  },
  {
    id: 2,
    image: photo2,
    name: "Nexora AI Experience",
    category: "AI & Technology",
    minInvestment: "$50,000",
    assetType: "Equity",
    expectedTerm: "5 Years",
    expectedYield: "11.2%",
  },
  {
    id: 3,
    image: photo3,
    name: "SynX AI",
    category: "AI & Technology",
    minInvestment: "$50,000",
    assetType: "Equity",
    expectedTerm: "5 Years",
    expectedYield: "11.2%",
  },
  {
    id: 4,
    image: photo1,
    name: "Aoai Technologies",
    category: "AI & Technology",
    revenue: "$48,000,000",
    revenueCAGR: "7.72%",
    expectedTerm: "5 Years",
    ebita: "$1,536,000",
  },
  {
    id: 5,
    image: photo2,
    name: "Zelva",
    category: "AI & Technology",
    minInvestment: "$50,000",
    assetType: "Equity",
    expectedTerm: "5 Years",
    expectedYield: "11.2%",
  },
];

function InvestorTechnology() {
  const navigate = useNavigate();
  const id = "f343c5e0-f262-4acc-8bc5-a4e72d721f15";
  return (
    <div className="bg-white p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <p className="text-left !text-[32px] font-normal font-['Atacama'] text-[#000]">
            Technology
          </p>
          <p className="text-left  !text-[#000] font-normal !text-[13px]">
            Explore AI and technology opportunities driving digital
            transformation across industries.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="!rounded-full border !border-black mt-3 md:mt-0"
          icon={<FaChevronRight className="!h-3 !w-3" />}
          iconPosition="right"
        >
          View All
        </Button>
      </div>

      {/* Technology Companies Table */}
      <div className="bg-white border border-[#E5E5EA] rounded-md overflow-hidden">
        <div className="divide-y divide-[#E5E5EA]">
          {TECHNOLOGY_COMPANIES.map((company) => {
            const hasInvestmentDetails =
              company.minInvestment && company.assetType && company.expectedYield;
            const hasRevenueDetails =
              company.revenue && company.revenueCAGR && company.ebita;

            return (
              <div
                key={company.id}
                className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-4 lg:gap-6 p-2 hover:bg-[#FAFAFC] transition-colors cursor-pointer"
                onClick={() => navigate(`/investor/dashboard/detail/${id}`)}
              >
                {/* Company Info Section */}
                <div className="flex items-center gap-3 lg:min-w-[280px]">
                  <img
                    src={company.image}
                    alt={company.name}
                    className="w-[70px] h-[70px] object-cover rounded flex-shrink-0"
                  />
                  <div className="min-w-0">
                  <h3 className="text-[11px] font-semibold font-['Montserrat'] text-[#000]">
                      {company.name}
                    </h3>
                    <span className="inline-block text-[#000] text-[15px] font-[400] font-['Montserrat'] rounded-full mb-2">
                      {company.category}
                    </span>
                   
                  </div>
                </div>

                {/* Financial Metrics Section */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 items-center">
                  {hasInvestmentDetails ? (
                    <>
                      <div>
                        <p className="text-[11px] font-[600] font-['Montserrat'] text-[#000] tracking-wide mb-1">
                          Min. Investment
                        </p>
                        <p className="text-[14px] font-normal text-[#000]">
                          {company.minInvestment}
                        </p>
                      </div>
                      <div>
                      <p className="text-[11px] font-[600] font-['Montserrat'] text-[#000] tracking-wide mb-1">
                      Asset Type
                        </p>
                        <p className="text-[14px] font-normal text-[#000]">
                          {company.assetType}
                        </p>
                      </div>
                      <div>
                      <p className="text-[11px] font-[600] font-['Montserrat'] text-[#000] tracking-wide mb-1">
                      Expected Term
                        </p>
                        <p className="text-[14px] font-normal text-[#000]">
                          {company.expectedTerm}
                        </p>
                      </div>
                      <div>
                      <p className="text-[11px] font-[600] font-['Montserrat'] text-[#000] tracking-wide mb-1">
                      Expected Yield
                        </p>
                        <p className="text-[14px] font-normal text-[#000]">
                          {company.expectedYield}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                      <p className="text-[11px] font-[600] font-['Montserrat'] text-[#000] tracking-wide mb-1">
                      Revenue
                        </p>
                        <p className="text-[14px] font-normal text-[#000]">
                          {company.revenue}
                        </p>
                      </div>
                      <div>
                      <p className="text-[11px] font-[600] font-['Montserrat'] text-[#000] tracking-wide mb-1">
                      Revenue CAGR %
                        </p>
                        <p className="text-[14px] font-normal text-[#000]">
                          {company.revenueCAGR}
                        </p>
                      </div>
                      <div>
                      <p className="text-[11px] font-[600] font-['Montserrat'] text-[#000] tracking-wide mb-1">
                      Expected Term
                        </p>
                        <p className="text-[14px] font-normal text-[#000]">
                          {company.expectedTerm}
                        </p>
                      </div>
                      <div>
                      <p className="text-[11px] font-[600] font-['Montserrat'] text-[#000] tracking-wide mb-1">
                      EBITA
                        </p>
                        <p className="text-[14px] font-normal text-[#000]">
                          {company.ebita}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Arrow Icon */}
                <div className="flex items-center justify-end lg:justify-center lg:min-w-[40px]">
                  <FaChevronRight className="w-3 h-3 text-gray-500" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default InvestorTechnology;
