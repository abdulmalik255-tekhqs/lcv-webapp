import exclamationIcon from "@/assets/admin-assets/action.svg";
import cantonIcon from "@/assets/admin-assets/canton.svg";
import commericalIcon from "@/assets/admin-assets/commerical.svg";
import pdfIcon from "@/assets/admin-assets/pdf.svg";
import Button from "@/components/shared/button";
import GenericLoader from "@/components/shared/GenericLoader";
import { TOKENIZATION_REQUESTS_DATA } from "@/constants/registrar";
import { useState } from "react";
import { useParams } from "react-router-dom";
import ApprovedTokenizationTimeline from "./ApprovedTokenizationTimeline";
import MintModal from "./MintModal";
import MintSuccessModal from "./MintSuccessModal";

function RegistrarTokenizationApprovedDetailsPage() {
  const { id } = useParams();
  const asset = TOKENIZATION_REQUESTS_DATA.find(
    (item) => item.id === Number(id)
  );
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [isLoaderOpen, setIsLoaderOpen] = useState(false);
  const [isMintSuccessOpen, setIsMintSuccessOpen] = useState(false);

  // Extended asset data with additional fields from the image
  const extendedAsset = asset
    ? {
        ...asset,
        name: "Premium Downtown Office Tower",
        assetId: "AST-2025-001",
        category: "Commercial Real Estate",
        requestId: "REQ-2024-1159",
        issuer: "TechCorp Inc.",
        issuerEmail: "contact@techcorp.com",
        date: "Nov 15, 2024",
        totalOffering: "$5,000,000",
        sharePrice: "$100",
        totalShares: "50,000",
        minInvestment: "$10,000",
        propertyAddress: "123 Main St, San Francisco, CA 94105",
        targetCloseDate: "Dec 31, 2024",
        expectedReturns: "8-12% annually",
        description:
          "Prime commercial office building in downtown San Francisco with long-term tenants. Class A property with modern amenities, underground parking, and excellent public transportation access. Current occupancy rate of 95% with stable cash flows.",
        documents: [
          { name: "Property-Appraisal-Report.pdf", size: "2.3 MB" },
          { name: "Title-Deed.pdf", size: "2.3 MB" },
          { name: "Financial-Statement.pdf", size: "2.3 MB" },
          { name: "Operating-Agreement.pdf", size: "2.3 MB" },
        ],
        contactPhone: "(415) 555-0123",
        registrationStatus: "Active",
        tokenPrice: "100",
        approvalDate: "Nov 15, 2024",
        requestStatus: "Approved",
      }
    : null;

  const handleApprove = () => {
    setIsMintModalOpen(true);
  };

  const handleMint = () => {
    // Close mint modal and open loader
    setIsMintModalOpen(false);
    setIsLoaderOpen(true);
  };

  const handleLoaderComplete = () => {
    // Close loader and open success modal
    setIsLoaderOpen(false);
    setIsMintSuccessOpen(true);
  };

  const handleMintSuccessClose = () => {
    // Close success modal and all modals
    setIsMintSuccessOpen(false);
    setIsMintModalOpen(false);
    setIsLoaderOpen(false);
  };

  const handleCancelMint = () => {
    setIsMintModalOpen(false);
  };

  const handleDeny = () => {
    // Handle deny logic here
    console.log("Asset denied:", extendedAsset);
    // You can add navigation or toast notification here
  };

  return (
    <div className="bg-white border rounded-tr-[24px] min-h-screen">
      <div className="p-4 sm:p-6">
        {extendedAsset ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Asset Details */}

            <div className="lg:col-span-2 space-y-6">
              {/* Asset Details Top Section */}
              <div className="text-start pl-5 !pb-0 !py-0 text-[24px] font-normal font-['Atacama'] leading-[120%] tracking-[0.48px] text-[#000] rounded-tr-[24px]">
              Purchase Request Details
              </div>
              <span className="text-start !text-[#48484A] font-normal !text-sm !py-0 pl-5">
              Review, approve, and issue tokens.
              </span>
              <div className=" rounded-lg  p-6">
                <h3 className="text-[13px] font-semibold text-[#000] mb-4 !font-['Montserrat']">
                  Asset Details
                </h3>
                <hr className="border-t border-[#000] my-4 border-1"></hr>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-[11px] !font-[600] text-[#000] mb-1">
                      Total Offering
                    </p>
                    <p className="text-[17px] font-normal text-[#000]">
                      {extendedAsset.totalOffering}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] !font-[600] text-[#000] mb-1">
                      Share Price
                    </p>
                    <p className="text-[17px] font-normal text-[#000]">
                      {extendedAsset.sharePrice}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] !font-[600] text-[#000] mb-1">
                      Total Shares
                    </p>
                    <p className="text-[17px] font-normal text-[#000]">
                      {extendedAsset.totalShares}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] !font-[600] text-[#000] mb-1">
                      Min. Investment
                    </p>
                    <p className="text-[17px] font-normal text-[#000]">
                      {extendedAsset.minInvestment}
                    </p>
                  </div>
                </div>

                {/* Asset Type and Details */}
                <div className="space-y-0">
                  <h3 className="text-[13px] font-semibold text-[#000] mb-4 !font-['Montserrat']">
                    Asset Details
                  </h3>
                  <hr className="border-t border-[#000] my-4 border-1"></hr>
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                      Asset Type
                    </p>
                    <div className="flex items-center gap-2 w-[75%]">
                      <img
                        src={commericalIcon}
                        alt="Commercial Icon"
                        className="w-7 h-7 border border-[#E5E5EA] rounded-full p-1.5 "
                      />
                      <p className="text-[15px] font-normal text-[#000] ">
                        {extendedAsset.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                      Property Address:
                    </p>
                    <p className="text-[15px] font-normal text-[#000] w-[75%]">
                      {extendedAsset.propertyAddress}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                      Target Close Date:
                    </p>
                    <p className="text-[15px] font-normal text-[#000] w-[75%]">
                      {extendedAsset.targetCloseDate}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                      Expected Returns:
                    </p>
                    <p className="text-[15px] font-normal text-[#000] w-[75%]">
                      {extendedAsset.expectedReturns}
                    </p>
                  </div>
                  <div className="flex items-start justify-between py-3">
                    <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                      Description:
                    </p>
                    <p className="text-[15px] font-normal text-[#000] leading-relaxed w-[75%]">
                      {extendedAsset.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Supporting Documents */}
              <div className=" rounded-lg  p-6">
                <h3 className="text-[13px] font-semibold text-[#000] mb-4 !font-['Montserrat']">
                  Supporting Documents
                </h3>
                <hr className="border-t border-[#000] my-4 border-1"></hr>

                <div className="space-y-3">
                  {extendedAsset.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-[#E5E5EA] !bg-[#FAFAFC] rounded-[15px] hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <img
                          src={pdfIcon}
                          alt="PDF Icon"
                          className="w-10 h-10 border border-[#E5E5EA] rounded-full p-2 !bg-white"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#000]">
                            {doc.name}
                          </p>
                          <p className="text-xs text-[#000]">{doc.size}</p>
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => console.log("Download:", doc.name)}
                        className="flex items-center gap-2"
                      >
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Action Required, Submission, Blockchain, Timeline */}
            <div className="">
              {/* Action Required */}
              <div className=" rounded-lg  p-6">
                <div className="flex items-start gap-3 mb-4">
                  <img
                    src={exclamationIcon}
                    alt="Exclamation Icon"
                    className="w-5 h-5"
                  />
                  <h3 className="text-[15px] font-medium text-[#000] ">
                    Action Required
                  </h3>
                </div>

                <p className="text-[13px] font-normal text-[#364153]">
                  Review all asset details and supporting documentation, then
                  approve or deny this request.
                </p>
                <div className="flex flex-col gap-3 mt-4">
                  <Button
                    variant="gradient"
                    onClick={handleApprove}
                    className="w-full h-[40px]"
                  >
                    Mint Tokens
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleDeny}
                    className="w-full h-[40px]"
                  >
                    Revoke Approval
                  </Button>
                </div>
                <hr className="border-t border-[#E5E5EA] px-8 border-1 !mt-6"></hr>
              </div>
              {/* Issuer Submission */}
              <div className=" rounded-lg  !px-6">
                <h3 className="text-[15px] font-medium text-[#000] mb-4 !font-['Montserrat']">
                  Issuer Submission
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-[#000]">
                      Company Name
                    </p>
                    <p className="text-[13px] font-medium text-[#000]">
                      {extendedAsset.issuer}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-[#000]">Email</p>
                    <a
                      href={`mailto:${extendedAsset.issuerEmail}`}
                      className="text-[13px] font-medium text-[#0734A9] hover:underline"
                    >
                      {extendedAsset.issuerEmail}
                    </a>
                  </div>
                  {/* <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-[#000]">
                      Contact Phone
                    </p>
                    <p className="text-[13px] font-medium text-[#000]">
                      {extendedAsset.contactPhone}
                    </p>
                  </div> */}
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-[#000]">
                      Registration Status
                    </p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 ">
                      {extendedAsset.registrationStatus}
                    </span>
                  </div>
                </div>
                <div className="mt-4 p-4 border border-[#E5E5EA] bg-gray-100 rounded-lg">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-medium text-[#000]">
                        Request ID
                      </p>
                      <p className="text-[13px] font-medium text-[#000]">
                        {extendedAsset.requestId}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-medium text-[#000]">
                        Submission Date
                      </p>
                      <p className="text-[13px] font-medium text-[#000]">
                        {extendedAsset.date}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-medium text-[#000]">
                        Approved Date
                      </p>
                      <p className="text-[13px] font-medium text-[#000]">
                        {extendedAsset.approvalDate}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-[11px] font-medium text-[#000]">
                    Request Status
                  </p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 ">
                    {extendedAsset.requestStatus}
                  </span>
                </div>
                <div className="text-center justify-center items-center  mt-4">
                  <p className="text-[11px] font-medium text-[#000]">
                    Asset approved and ready to be minted.
                  </p>
                </div>
                <hr className="border-t border-[#E5E5EA] px-8 border-1 !mt-6"></hr>
              </div>

              {/* Blockchain Transaction */}
              <div className=" rounded-lg  !px-6 pt-6">
                <h3 className="text-[15px] font-medium text-[#000]  !font-['Montserrat']">
                  Blockchain Transaction
                </h3>
                <p className="text-[11px] font-[500] text-[#48484A] mb-6">
                  Blockchain details will be available after minting.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-[#000]">
                      Transaction Hash
                    </p>
                    <p className="text-[13px] font-medium text-[#000]">TBD</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-[#000]">
                      Tokens
                    </p>
                    <p className="text-[13px] font-medium text-[#000]">
                      500,000
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-[#000]">
                      Timestamp
                    </p>
                    <p className="text-[13px] font-medium text-[#000]">TBD</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-[#000]">
                      Contract Address
                    </p>
                    <p className="text-[13px] font-medium text-[#000]">TBD</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-[#000]">
                      Block Number
                    </p>
                    <p className="text-[13px] font-medium text-[#000]">TBD</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-[#000]">
                      Network
                    </p>
                    <div className="flex items-center gap-1">
                      <p className="text-[13px] font-medium text-[#000]">
                        Canton
                      </p>
                      <img
                        src={cantonIcon}
                        alt="Canton Icon"
                        className="w-6 h-6"
                      />
                    </div>
                  </div>
                </div>
                <hr className="border-t border-[#E5E5EA] px-8 border-1 !mt-6"></hr>
              </div>

              {/* Tokenization Timeline */}
              <div className="!px-6 pt-6">
                <ApprovedTokenizationTimeline currentStep={3} />
              </div>
            </div>
          </div>
        ) : (
          <div className=" rounded-lg border border-[#E5E5EA] p-6">
            <p className="text-gray-500 text-center">
              {id
                ? `Tokenization request with ID: ${id} not found`
                : "Pending review content will be implemented here"}
            </p>
          </div>
        )}
      </div>

      {/* Mint Modal */}
      <MintModal
        isOpen={isMintModalOpen && !isLoaderOpen && !isMintSuccessOpen}
        onClose={handleMintSuccessClose}
        onMint={handleMint}
        onCancel={handleCancelMint}
        asset={extendedAsset}
      />

      {/* Generic Loader */}
      <GenericLoader
        isOpen={isLoaderOpen}
        onClose={handleMintSuccessClose}
        onComplete={handleLoaderComplete}
      />

      {/* Mint Success Modal */}
      <MintSuccessModal
        isOpen={isMintSuccessOpen}
        onClose={handleMintSuccessClose}
        asset={extendedAsset}
      />
    </div>
  );
}

export default RegistrarTokenizationApprovedDetailsPage;
