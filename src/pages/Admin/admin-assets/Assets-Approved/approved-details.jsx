import { useGetAssetDetails, useAssignRegistrar } from "@/api";
import exclamationIcon from "@/assets/admin-assets/action.svg";
import cantonIcon from "@/assets/admin-assets/canton.svg";
import commericalIcon from "@/assets/admin-assets/commerical.svg";
import pdfIcon from "@/assets/admin-assets/pdf.svg";
import { TableLoader } from "@/components/shared";
import Button from "@/components/shared/button";
import { useNavigate, useParams } from "react-router-dom";
import ApprovedTokenizationTimeline from "./ApprovedTokenizationTimeline";
import { useState } from "react";
import AssignRegistrarModal from "../Assets-Pending/AssignRegistrarModal";
import useToast from "@/hooks/useCustomToast";
import WalletAddress from "@/components/shared/WalletAddress";

function AdminAssetsApprovedDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const assetId = id || null;
  const {
    data: assetDetails,
    isLoading,
    isError,
  } = useGetAssetDetails(assetId);
  const [isAssignRegistrarModalOpen, setIsAssignRegistrarModalOpen] =
    useState(false);
  const { showBottomRightToast: showSuccessToast, showErrorToast } = useToast();
  const { mutate: assignRegistrar, isPending: isAssigning } =
    useAssignRegistrar();

  const handleAssignRegistrar = (userId) => {
    if (!assetId) {
      showErrorToast("Asset ID is missing");
      return;
    }

    assignRegistrar(
      { assetTokenizationId: assetId, userId },
      {
        onSuccess: () => {
          showSuccessToast("Registrar assigned successfully");
          setIsAssignRegistrarModalOpen(false);
          // Redirect to admin assets page
          navigate("/admin/assets");
        },
        onError: (error) => {
          showErrorToast(
            error?.response?.data?.message ||
              "Failed to assign registrar. Please try again."
          );
        },
      }
    );
  };

  // Show loader while fetching asset details
  if (isLoading) {
    return (
      <div className="bg-white border rounded-tr-[24px] min-h-screen flex items-center justify-center">
        <TableLoader message="Loading asset details..." />
      </div>
    );
  }

  // Extract data from API response
  const asset = assetDetails || {};
  const businessDetail = asset.assetBusinessDetail || {};
  const assetType = asset.assetType || {};
  const assetFiles = asset.assetFiles || [];
  const assetUser = asset.user || {};
  const assetRegistrar = asset.assetRegistrar || null;
  const registrar = assetRegistrar?.userRegistrar || null;

  // Check if registrar is assigned (either has userRegistrar or assetRegistrar exists)
  const isRegistrarAssigned = !!assetRegistrar;


  // Calculate capital target (total supply * initial price)
  const capitalTarget =
    Number(asset.total_supply || 0) * Number(asset.initial_price || 0);

  // Extended asset data mapped from API response
  const extendedAsset = asset
    ? {
        ...asset,
        name: asset.name || "Not Provided",
        assetId: asset.id
          ? `AST-${new Date(
              asset.created_at || Date.now()
            ).getFullYear()}-${String(asset.id).slice(-3).padStart(3, "0")}`
          : "N/A",
        category: assetType.title || "Not Provided",
        requestId: asset.id
          ? `REQ-${new Date(
              asset.created_at || Date.now()
            ).getFullYear()}-${String(asset.id).slice(-4).padStart(4, "0")}`
          : "N/A",
        issuer:
          assetUser.first_name && assetUser.last_name
            ? `${assetUser.first_name} ${assetUser.last_name}`
            : asset.name || "Not Provided",
        issuerEmail: assetUser.email || "Not Provided",
        date: asset.created_at
          ? new Date(asset.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "N/A",
        totalOffering: capitalTarget,
        sharePrice: asset.initial_price,
        totalShares: asset.total_supply,
        minInvestment: businessDetail.minimum_investment,
        propertyAddress:
          businessDetail.city && businessDetail.country
            ? `${businessDetail.city}, ${businessDetail.country}`
            : businessDetail.country || businessDetail.city || "Not Provided",
        targetCloseDate: businessDetail.target_close_date
          ? new Date(businessDetail.target_close_date).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "short",
                day: "numeric",
              }
            )
          : "Not Provided",
        expectedReturns: businessDetail.expected_yield || "Not Provided",
        description: asset.description || "Not Provided",
        documents: assetFiles.map((file) => ({
          name: file.file_name || "Document",
          size: "N/A", // Size not provided in API
          url: file.url,
        })),
        contactPhone: assetUser.phone || "Not Provided",
        registrationStatus: asset.status || "Pending",
        tokenPrice: String(asset.initial_price || "0"),
        approvalDate: asset.updated_at
          ? new Date(asset.updated_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "N/A",
        requestStatus: asset.status || "Pending",
      }
    : null;

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
                      <img
                        src={assetType.image || commericalIcon}
                        alt="Asset Type Icon"
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
                        onClick={() => {
                          if (doc.url) {
                            window.open(doc.url, "_blank");
                          }
                        }}
                        className="flex items-center gap-2"
                      >
                        View
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

                {isRegistrarAssigned ? (
                  <>
                    <p className="text-[13px] font-normal text-[#364153] mb-4">
                      Registrar has been assigned to this asset.
                    </p>
                    <div className="space-y-3">
                      {registrar ? (
                        <>
                          <div className="flex items-center justify-between">
                            <p className="text-[11px] font-medium text-[#000]">
                              Registrar Name
                            </p>
                            <p className="text-[13px] font-medium text-[#000]">
                              {registrar.first_name && registrar.last_name
                                ? `${registrar.first_name} ${registrar.last_name}`
                                : registrar.email?.split("@")[0] ||
                                  "Not Provided"}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-[11px] font-medium text-[#000]">
                              Registrar Email
                            </p>
                            <a
                              href={`mailto:${registrar.email || ""}`}
                              className="text-[13px] font-medium text-[#0734A9] hover:underline"
                            >
                              {registrar.email || "Not Provided"}
                            </a>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] font-medium text-[#000]">
                            Registrar Name
                          </p>
                          <p className="text-[13px] font-medium text-[#000]">
                            Not Provided
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-[13px] font-normal text-[#364153]">
                      Review all asset details and supporting documentation,
                      then assign a Registrar to review the asset.
                    </p>
                    <div className="flex flex-col gap-3 mt-4">
                      <Button
                        variant="gradient"
                        onClick={() => setIsAssignRegistrarModalOpen(true)}
                        className="w-full h-[40px]"
                      >
                        Assign Registrar
                      </Button>
                    </div>
                  </>
                )}
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
                  {/* <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-[#000]">
                      Transaction Hash
                    </p>
                    <p className="text-[13px] font-medium text-[#000]">TBD</p>
                  </div> */}
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-[#000]">
                      Initial Mint
                    </p>
                    <p className="text-[13px] font-medium text-[#000]">
                      {asset.initial_mint ?? "Not Provided"} Tokens
                      Tokens
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-[#000]">
                      Total Supply
                    </p>
                    <p className="text-[13px] font-medium text-[#000]">
                      {asset.total_supply ?? "Not Provided"} Tokens
                      Tokens
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
                    <WalletAddress
                      value={asset.asset_contract_id??"TBD"}
                    />
                  </div>
                  {/* <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-[#000]">
                      Block Number
                    </p>
                    <p className="text-[13px] font-medium text-[#000]">TBD</p>
                  </div> */}
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

      {/* Assign Registrar Modal */}
      <AssignRegistrarModal
        isOpen={isAssignRegistrarModalOpen}
        onClose={() => setIsAssignRegistrarModalOpen(false)}
        onAssign={handleAssignRegistrar}
        assetId={assetId}
      />
    </div>
  );
}

export default AdminAssetsApprovedDetailsPage;
