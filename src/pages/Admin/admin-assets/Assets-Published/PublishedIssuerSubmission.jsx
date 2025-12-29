import React from "react";

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function PublishedIssuerSubmission({ asset }) {
  const assetUser = asset?.user || {};
  
  // Generate IDs from asset data
  const generatedAssetId = asset?.id?.substring(0, 8).toUpperCase() || "—";
  const requestId = `REQ-${generatedAssetId}`;
  const assetId = `AST-${generatedAssetId}`;

  // Issuer submission data mapped from API
  const issuerData = {
    companyName: assetUser.first_name && assetUser.last_name
      ? `${assetUser.first_name} ${assetUser.last_name}`
      : asset?.name || "Not Provided",
    email: assetUser.email || "Not Provided",
    contactPhone: assetUser.phone || "Not Provided",
    registrationStatus: asset?.status || "Pending",
    requestId: requestId,
    assetId: assetId,
    submissionDate: formatDate(asset?.created_at),
    approvedDate: formatDate(asset?.updated_at),
    requestStatus: asset?.status || "Pending",
    description: asset?.status === "Published"
      ? "Asset has been published to the marketplace and is available for investment."
      : "Asset details",
  };

  return (
    <div>
      <div className="pt-8">
        <h3 className="text-[20px] font-[500] text-[#000] mb-4 !font-['Atacama']">
          Issuer Submission
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-[#000]">Company Name</p>
            <p className="text-[13px] font-medium text-[#000]">
              {issuerData.companyName}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-[#000]">Email</p>
            <a
              href={`mailto:${issuerData.email}`}
              className="text-[13px] font-medium text-[#0734A9] hover:underline"
            >
              {issuerData.email}
            </a>
          </div>
          {/* <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-[#000]">Contact Phone</p>
            <p className="text-[13px] font-medium text-[#000]">
              {issuerData.contactPhone}
            </p>
          </div> */}
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-[#000]">
              Registration Status
            </p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#3BF69533] text-[#000]">
              {issuerData.registrationStatus}
            </span>
          </div>
        </div>
        <div className="mt-4 p-4 border border-[#E5E5EA] bg-[#FAFAFC] rounded-lg">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium text-[#000]">Request ID</p>
              <p className="text-[13px] font-medium text-[#000]">
                {issuerData.requestId}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium text-[#000]">Asset ID</p>
              <p className="text-[13px] font-medium text-[#000]">
                {issuerData.assetId}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium text-[#000]">
                Submission Date
              </p>
              <p className="text-[13px] font-medium text-[#000]">
                {issuerData.submissionDate}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium text-[#000]">
                Approved Date
              </p>
              <p className="text-[13px] font-medium text-[#000]">
                {issuerData.approvedDate}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-[11px] font-medium text-[#000]">Request Status</p>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#3BF69533] text-[#000]">
            {issuerData.requestStatus}
          </span>
        </div>
        <div className="text-center justify-center items-center mt-4 px-8">
          <p className="text-[11px] font-medium text-[#000]">
            {issuerData.description}
          </p>
        </div>
        <hr className="border-t border-[#E5E5EA] px-8 border-1 !mt-6"></hr>
      </div>
    </div>
  );
}

export default PublishedIssuerSubmission;
