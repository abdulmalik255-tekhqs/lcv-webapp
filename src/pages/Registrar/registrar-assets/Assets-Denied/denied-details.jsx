import exclamationIcon from "@/assets/admin-assets/action.svg";
import cantonIcon from "@/assets/admin-assets/canton.svg";
import commericalIcon from "@/assets/admin-assets/commerical.svg";
import pdfIcon from "@/assets/admin-assets/pdf.svg";
import Button from "@/components/shared/button";
import { useParams } from "react-router-dom";
import DeniedTokenizationTimeline from "./DeniedTokenizationTimeline";
import { useGetAssetDetails } from "@/api";
import { TableLoader } from "@/components/shared";



// Format date
const formatDate = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Format file size (approximate)
const formatFileSize = (url) => {
  // Since we don't have file size in API, return a placeholder
  return "—";
};

function AssetsDeniedDetailsPage() {
  const { id } = useParams();
  const assetId = id || null;
  const { data: assetDetails, isLoading, isError } = useGetAssetDetails(assetId);

  // Show loader while fetching asset details
  if (isLoading) {
    return (
      <div className="bg-white border rounded-tr-[24px] min-h-screen flex items-center justify-center">
        <TableLoader message="Loading asset details..." />
      </div>
    );
  }

  // Show error state
  if (isError || !assetDetails) {
    return (
      <div className="bg-white border rounded-tr-[24px] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">
            {id
              ? `Asset with ID: ${id} not found`
              : "Error loading asset details"}
          </p>
        </div>
      </div>
    );
  }

  // Extract data from API response
  const asset = assetDetails || {};
  const businessDetail = asset.assetBusinessDetail || {};
  const assetType = asset.assetType || {};
  const assetFiles = asset.assetFiles || [];
  const initialOwners = asset.assetInitialOwners || [];

  // Generate asset ID from UUID (first 8 characters)
  const generatedAssetId = asset.id?.substring(0, 8).toUpperCase() || "—";
  const requestId = `REQ-${generatedAssetId}`;

  // Calculate total offering (total supply * initial price)
  const totalOffering = asset.initial_price && asset.total_supply
    ? Number(asset.initial_price) * Number(asset.total_supply)
    : "$0";

  // Format property address from city and country
  const propertyAddress = businessDetail.city && businessDetail.country
    ? `${businessDetail.city}, ${businessDetail.country}`
    : businessDetail.city || businessDetail.country || "—";

  // Format expected returns
  const expectedReturns = businessDetail.expected_yield
    ? `${businessDetail.expected_yield}%`
    : businessDetail.expected_term || "—";

  // Map asset files to documents format
  const documents = assetFiles.map((file) => ({
    name: file.file_name || "Document",
    url: file.url,
    size: formatFileSize(file.url),
  }));

  // Parse rejection remarks into array
  const rejectionRemarksList = asset.rejection_remarks
    ? asset.rejection_remarks.split(",").map((remark) => remark.trim()).filter(Boolean)
    : [];

  // Extended asset data mapped from API response
  const extendedAsset = {
    id: asset.id,
    name: asset.name || "—",
    assetId: generatedAssetId,
    category: businessDetail.industry || assetType.title || "—",
    requestId: requestId,
    issuer: asset.user?.first_name && asset.user?.last_name
      ? `${asset.user.first_name} ${asset.user.last_name}`
      : asset.user?.email?.split("@")[0] || "Issuer",
    issuerEmail: asset.user?.email || "—",
    date: formatDate(asset.created_at || asset.updated_at),
    denialDate: formatDate(asset.updated_at),
    totalOffering: totalOffering,
    sharePrice:   asset.initial_price,
    pricePerToken: asset.initial_price,
    totalShares: asset.total_supply,
    minInvestment: businessDetail.minimum_investment,
    propertyAddress: propertyAddress,
    targetCloseDate: businessDetail.target_close_date
      ? formatDate(businessDetail.target_close_date)
      : "—",
    expectedReturns: expectedReturns,
    expectedYield: businessDetail.expected_yield
      ? `${businessDetail.expected_yield}%`
      : "—",
    minimumAnnualReturn: businessDetail.minimum_annual_return
      ? `${businessDetail.minimum_annual_return}%`
      : "—",
    expectedTerm: businessDetail.expected_term || "—",
    description: asset.description || "—",
    documents: documents,
    contactPhone: "—", // Not available in API
    registrationStatus: "Active", // Not available in API, using default
    requestStatus: asset.status || "Denied",
    rejectionRemarks: rejectionRemarksList,
    rejectionReason: asset.rejection_reason || "—",
    assetTypeImage: assetType.image || commericalIcon,
  };




  return (
    <div className="bg-white border rounded-tr-[24px] min-h-screen">
      <div className="p-4 sm:p-6">
        {extendedAsset ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Asset Details */}

            <div className="lg:col-span-2 space-y-6">
              {/* Asset Details Top Section */}
              <div className="text-start pl-5 !pb-0 !py-0 text-[32px] font-normal font-['Atacama'] leading-[120%] tracking-[0.48px] text-[#000] rounded-tr-[24px]">
                {extendedAsset.name}
              </div>
              <span className="text-start !text-[#48484A] font-normal !text-sm !py-0 pl-5">
                {extendedAsset.assetId}
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
                      {extendedAsset.assetTypeImage && (
                        <img
                          src={extendedAsset.assetTypeImage}
                          alt="Asset Type Icon"
                          className="w-7 h-7 border border-[#E5E5EA] rounded-full p-1.5 object-cover"
                          onError={(e) => {
                            e.target.src = commericalIcon;
                          }}
                        />
                      )}
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
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                      Minimum Investment:
                    </p>
                    <p className="text-[15px] font-normal text-[#000] w-[75%]">
                      {extendedAsset.minInvestment}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                      Price per Token:
                    </p>
                    <p className="text-[15px] font-normal text-[#000] w-[75%]">
                      {extendedAsset.pricePerToken}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                      Expected Yield:
                    </p>
                    <p className="text-[15px] font-normal text-[#000] w-[75%]">
                      {extendedAsset.expectedYield}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                      Minimum Annual Return:
                    </p>
                    <p className="text-[15px] font-normal text-[#000] w-[75%]">
                      {extendedAsset.minimumAnnualReturn}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E5EA]">
                    <p className="text-[13px] !font-[400] text-[#000] w-[25%]">
                      Expected Term:
                    </p>
                    <p className="text-[15px] font-normal text-[#000] w-[75%]">
                      {extendedAsset.expectedTerm}
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
                        onClick={() => {
                          if (doc.url) {
                            window.open(doc.url, "_blank");
                          }
                        }}
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
                        Denied Date
                      </p>
                      <p className="text-[13px] font-medium text-[#000]">
                        {extendedAsset.denialDate}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-[11px] font-medium text-[#000]">
                    Request Status
                  </p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FF707333]">
                    {extendedAsset.requestStatus}
                  </span>
                </div>
                <div className="text-center justify-center items-center  mt-4 px-8">
                  <p className="text-[11px] font-medium text-[#000]">
                  The issuer can revise and resubmit or delete this request from their dashboard.
                  </p>
                </div>
                <hr className="border-t border-[#E5E5EA] px-8 border-1 !mt-6"></hr>
              </div>

              {/* Registrar Feedback */}
              <div className="!px-6 pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <img
                    src={exclamationIcon}
                    alt="Exclamation Icon"
                    className="w-5 h-5"
                  />
                  <h3 className="text-[15px] font-medium text-[#000] !font-['Montserrat']">
                    Registrar Feedback
                  </h3>
                </div>
                <div className="space-y-2 mb-4">
                  {extendedAsset.rejectionRemarks.length > 0 ? (
                    extendedAsset.rejectionRemarks.map((remark, index) => (
                      <p
                        key={index}
                        className="text-[13px] font-medium text-[#364153]"
                      >
                        • &nbsp; {remark}
                      </p>
                    ))
                  ) : (
                    <p className="text-[13px] font-medium text-[#364153]">
                      No specific reasons provided
                    </p>
                  )}
                </div>
                {extendedAsset.rejectionReason && extendedAsset.rejectionReason !== "—" && (
                  <div className="p-4 bg-[#FFE5E5] rounded-lg border border-[#FFCCCC]">
                    <h4 className="text-[11px] font-semibold text-[#000] mb-2 !font-['Montserrat']">
                      Additional Comments
                    </h4>
                    <p className="text-[13px] font-normal text-[#000]">
                      {extendedAsset.rejectionReason}
                    </p>
                  </div>
                )}
                <hr className="border-t border-[#E5E5EA] px-8 border-1 !mt-6"></hr>
              </div>


              {/* Tokenization Timeline */}
              <div className="!px-6 pt-6">
                <DeniedTokenizationTimeline currentStep={3} />
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

      
    </div>
  );
}

export default AssetsDeniedDetailsPage;
