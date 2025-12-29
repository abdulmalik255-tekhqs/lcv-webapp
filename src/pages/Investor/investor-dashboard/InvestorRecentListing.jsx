import photo1 from "@/assets/investor-assets/img-01.svg";
import photo2 from "@/assets/investor-assets/img-02.svg";
import photo3 from "@/assets/investor-assets/img-03.svg";
import { Button, Card } from "@/components/shared";
import { FaChevronRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const RECENT_LISTINGS = [
  {
    id: 1,
    image: photo1,
    title: "Quantum Logic Systems",
    companyName: "Quantum",
    tag: "Sustainability",
    minInvestment: "$50,000",
    liquidity: "Quarterly",
    term: "15 years",
    annualizedYield: "10.5%",
  },
  {
    id: 2,
    image: photo2,
    title: "SynX BioTech",
    companyName: "SynX",
    tag: "Sustainability",
    revenue: "$48,000,000",
    liquidity: "Quarterly",
    revenueCAGR: "7 years",
    ebita: "8.77%",
  },
  {
    id: 3,
    image: photo3,
    title: "Cloud Aqua",
    companyName: "Cloud Aqua",
    tag: "Sustainability",
    minInvestment: "$50,000",
    liquidity: "Quarterly",
    term: "3 years",
    annualizedYield: "16.8%",
  },
  {
    id: 4,
    image: photo1,
    title: "Solar Energy Farm Project",
    companyName: "Evolta Solar",
    tag: "Sustainability",
    revenue: "$48,000,000",
    liquidity: "Quarterly",
    revenueCAGR: "5 years",
    ebita: "11.4%",
  },
  {
    id: 5,
    image: photo2,
    title: "Global Football Media Rights Platform",
    companyName: "CYBALANCE",
    tag: "Sustainability",
    minInvestment: "$50,000",
    liquidity: "Quarterly",
    term: "6 years",
    annualizedYield: "12.1%",
  },
];

const FinancialDetail = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-[11px] font-semibold text-[#000] tracking-wide">
      {label}
    </p>
    <p className="text-[14px] font-normal text-[#000]">{value}</p>
  </div>
);

const FinancialDetails = ({ listing }) => {
  const hasInvestmentDetails =
    listing.minInvestment && listing.term && listing.annualizedYield;
  const hasRevenueDetails =
    listing.revenue && listing.revenueCAGR && listing.ebita;
  const navigate = useNavigate();
  const id = "f343c5e0-f262-4acc-8bc5-a4e72d721f15";
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 " >
      {hasInvestmentDetails && (
        <>
          <FinancialDetail
            label="Min. Investment"
            value={listing.minInvestment}
          />
          <FinancialDetail label="Liquidity" value={listing.liquidity} />
          <FinancialDetail label="Term" value={listing.term} />
          <FinancialDetail
            label="Annualized Yield"
            value={listing.annualizedYield}
          />
        </>
      )}
      {hasRevenueDetails && (
        <>
          <FinancialDetail label="Revenue" value={listing.revenue} />
          <FinancialDetail label="Revenue CAGR %" value={listing.revenueCAGR} />
          <FinancialDetail label="Liquidity" value={listing.liquidity} />
          <FinancialDetail label="EBITA" value={listing.ebita} />
        </>
      )}
    </div>
  );
};

const ListingCard = ({ listing }) => (
  <Card className="flex flex-col md:flex-row border w-full gap-2 !p-0 border-[#E5E5EA] !bg-[#FAFAFC] rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
    {/* Left - Image and Title */}
    <div className="w-full md:w-[50%] flex flex-row gap-2">
      <div className="relative flex-shrink-0">
        <img
          src={listing.image}
          alt={listing.title}
          className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[110px] md:h-[110px] object-cover"
        />
      </div>
      <div className="p-2 flex-1 min-w-0">
        <h3 className="text-[14px] sm:text-[16px] font-medium mb-2 line-clamp-2">
          {listing.title}
        </h3>
        <span className="inline-block px-3 py-1 bg-white border border-[#E5E5EA] text-[#000] text-[11px] font-semibold rounded-full mb-3">
          {listing.tag}
        </span>
      </div>
    </div>

    {/* Right - Financial Details */}
    <div className="w-full md:w-[50%] p-2">
      <FinancialDetails listing={listing} />
    </div>
  </Card>
);

function InvestorRecentListing() {
  return (
    <div className="bg-white p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
        <p className="text-left !text-[32px] font-normal font-['Atacama'] text-[#000]">
        Recent Listings
          </p>
          <p className="text-left  !text-[#000] font-normal !text-[13px]">
            Newly added tokenized equity opportunities in the marketplace.
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

      {/* Listings Grid */}
      <div className="flex flex-col md:flex-row gap-6 cursor-pointer" onClick={() => navigate(`/investor/dashboard/detail/${id}`)}>
        <div className="flex-1 space-y-4 sm:space-y-6">
          {RECENT_LISTINGS.slice(0, 3).map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
        <div className="flex-1 space-y-4 sm:space-y-6">
          {RECENT_LISTINGS.slice(3).map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default InvestorRecentListing;
