import { useState, useEffect } from "react";
import { FaPlus, FaMinus, FaCheck } from "react-icons/fa6";
import { Button } from "@/components/shared";
import privateIcon from "@/assets/issuer-assets/private.svg";
import { usePublishAsset } from "@/api";
import useToast from "@/hooks/useCustomToast";
import SubmitAssetModal from "./modals/SubmitAssetModal";
import DeleteAssetModal from "./modals/DeleteAssetModal";

function ReviewSubmit({
  formData,
  updateFormData,
  isExpanded,
  isFilled,
  onToggle,
  onSaveDraft,
  onSubmit,
  onClearAll,
  assetId,
  filledSections = {},
}) {
  const [localData, setLocalData] = useState({
    reviewed: formData.reviewed || false,
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const { mutate: publishAsset, isPending: isPublishing } = usePublishAsset();
  const { showBottomRightToast: showSuccessToast, showErrorToast } = useToast();

  // Sync localData with formData when it changes
  useEffect(() => {
    setLocalData({
      reviewed: formData.reviewed || false,
    });
  }, [formData.reviewed]);

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Check if all sections are filled
  const checkAllSectionsFilled = () => {
    const sectionNames = {
      basicInformation: "Basic Information",
      businessDetails: "Business Details",
      financialInformation: "Financial Information",
      tokenizationDetails: "Tokenization Details",
      legalCompliance: "Legal & Compliance Documents",
    };

    const missingSections = [];

    // Check each section (excluding reviewSubmit as that's the current section)
    Object.keys(sectionNames).forEach((sectionKey) => {
      if (!filledSections[sectionKey]) {
        missingSections.push(sectionNames[sectionKey]);
      }
    });

    return missingSections;
  };

  // Validation function to check all required fields
  const validateAllFields = () => {
    const errors = [];
    const isEmpty = (value) =>
      !value || value === "" || value === null || value === undefined;

    // Basic Information validation
    if (isEmpty(formData.assetName)) {
      errors.push("Asset Name");
    }
    if (isEmpty(formData.description)) {
      errors.push("Description");
    }
    if (isEmpty(formData.assetType)) {
      errors.push("Asset Type");
    }

    // Business Details validation
    if (isEmpty(formData.industrySector)) {
      errors.push("Industry/Sector");
    }
    if (isEmpty(formData.country)) {
      errors.push("Country");
    }
    if (isEmpty(formData.city)) {
      errors.push("City");
    }
    if (isEmpty(formData.yearEstablished)) {
      errors.push("Year Established");
    }
    if (isEmpty(formData.numberOfEmployees)) {
      errors.push("Number of Employees");
    }
    if (isEmpty(formData.businessValuation)) {
      errors.push("Business Valuation");
    }
    if (isEmpty(formData.operationalStatus)) {
      errors.push("Operational Status");
    }
    if (isEmpty(formData.minimumInvestment)) {
      errors.push("Minimum Investment");
    }

    // Financial Information validation (at least one required)
    if (
      isEmpty(formData.annualRevenue) &&
      isEmpty(formData.revenueCAGR) &&
      isEmpty(formData.ebitda)
    ) {
      errors.push(
        "At least one financial metric (Annual Revenue, Revenue CAGR, or EBITDA)"
      );
    }

    // Tokenization Details validation
    if (isEmpty(formData.totalSupply)) {
      errors.push("Total Supply");
    }
    if (isEmpty(formData.initialMint)) {
      errors.push("Initial Mint");
    }
    if (isEmpty(formData.tokenPrice)) {
      errors.push("Price per Token");
    }

    // Legal & Compliance Documents validation
    if (!formData.documents || formData.documents.length === 0) {
      errors.push("At least one legal/compliance document");
    }

    return errors;
  };

  const handleSubmit = () => {
    // Check if assetId is available
    if (!assetId) {
      showErrorToast(
        "Asset ID is missing. Please save the basic information first."
      );
      return;
    }

    // Check if all sections are filled (Formik handles validation per section)
    const missingSections = checkAllSectionsFilled();
    if (missingSections.length > 0) {
      const errorMessage =
        missingSections.length === 1
          ? `Please complete the following section: ${missingSections[0]}`
          : `Please complete the following sections: ${missingSections.join(
              ", "
            )}`;
      showErrorToast(errorMessage);
      return;
    }

    // Validate all required fields
    const validationErrors = validateAllFields();
    if (validationErrors.length > 0) {
      const errorMessage =
        validationErrors.length === 1
          ? `Please fill in the required field: ${validationErrors[0]}`
          : `Please fill in all required fields: ${validationErrors.join(
              ", "
            )}`;
      showErrorToast(errorMessage);
      return;
    }

    updateFormData("reviewSubmit", localData);

    // Open submit modal instead of calling API directly
    setIsSubmitModalOpen(true);
  };

  const handleSubmitRequest = () => {
    // Call the publish API
    publishAsset(assetId, {
      onSuccess: (data) => {
        setIsSubmitModalOpen(false);
        showSuccessToast("Asset submitted for approval successfully!");
        if (onSubmit) {
          onSubmit();
        }
      },
      onError: (error) => {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to submit asset for approval. Please try again.";
        showErrorToast(errorMessage);
      },
    });
  };

  const handleSubmitModalClose = () => {
    if (!isPublishing) {
      setIsSubmitModalOpen(false);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (onClearAll) {
      onClearAll();
    }
    setIsDeleteModalOpen(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  // Extract data from formData
  const basicInfo = {
    assetName: formData.assetName || "Not provided",
    description: formData.description || "Not provided",
    assetType: formData.assetType || "Not provided",
    assetTypeTitle: formData.assetTypeTitle || "Special Purpose Vehicle (SPV)",
  };

  const businessDetails = {
    industrySector: formData.industrySector || "Not provided",
    country: formData.country || "Not provided",
    city: formData.city || "Not provided",
    yearEstablished: formData.yearEstablished || "Not provided",
    numberOfEmployees: formData.numberOfEmployees || "Not provided",
    ownershipStake: formData.ownershipStake || "Not provided",
    businessValuation: formData.businessValuation || "Not provided",
    operationalStatus: formData.operationalStatus || "Not provided",
    minimumInvestment: formData.minimumInvestment || "Not provided",
    expectedYield: formData.expectedYield || "Not provided",
    expectedTerm: formData.expectedTerm || "Not provided",
    pricePerToken:
      formData.pricePerToken || formData.tokenPrice || "Not provided",
    minimumAnnualReturn: formData.minimumAnnualReturn || "Not provided",
    targetCloseDate: formData.targetCloseDate || "Not provided",
  };

  const financialInfo = {
    annualRevenue: formData.annualRevenue || "Not provided",
    revenueCAGR: formData.revenueCAGR || "Not provided",
    ebitda: formData.ebitda || "Not provided",
    broadcastingRevenue: formData.broadcastingRevenue || "Not provided",
    matchdayRevenue: formData.matchdayRevenue || "Not provided",
    commercialRevenue: formData.commercialRevenue || "Not provided",
    playerAcquisitions: formData.playerAcquisitions || "Not provided",
    operatingExpenses: formData.operatingExpenses || "Not provided",
  };

  const tokenizationDetails = {
    totalSupply: formData.totalSupply || "Not provided",
    initialMint: formData.initialMint || "Not provided",
    tokenPrice: formData.tokenPrice || "Not provided",
    initialOwners: formData.initialOwners || [],
  };

  const legalDocuments = formData.documents || [];

  return (
    <>
      <div className="bg-white overflow-hidden">
        {/* Section Header */}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between p-2 hover:bg-gray-50 transition-colors"
        >
          <h3 className="text-[17px] font-semibold text-[#000] font-['Montserrat']">
            Review & Submit
          </h3>
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <FaMinus className="w-4 h-4 text-[#000] cursor-pointer" />
            ) : isFilled ? (
              <FaCheck className="w-4 h-4 text-green-500 cursor-pointer" />
            ) : (
              <FaPlus className="w-4 h-4 text-[#000] cursor-pointer" />
            )}
          </div>
        </button>

        {/* Section Content */}
        {isExpanded && (
          <div className="space-y-6 mt-4 px-2">
            {/* Introductory Text */}
            <p className="text-sm text-[#48484A]">
              Please review all information below before submitting. Your
              tokenization request will be sent to the Registrar for compliance
              review and approval.
            </p>

            {/* Basic Information Section */}
            <div className="bg-[#FAFAFC] border border-[#E5E5EA] rounded-[10px] p-4">
              <h4 className="text-sm font-semibold text-[#000] mb-3 py-[18px] border-b border-[#000]">
                Basic Information
              </h4>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-start self-stretch gap-[2px] p-[24px_30px_24px_0]">
                    <span className="text-[#000000] text-[11px] font-[600] leading-[150%] mb-1">
                      Asset Name
                    </span>
                    <span className="text-[#000000]  text-[17px] font-[400] leading-[150%]">
                      {basicInfo.assetName}
                    </span>
                  </div>
                  <div className="flex flex-col items-start self-stretch gap-[2px] p-[24px_30px_24px_0]">
                    <span className="text-[#000000] text-[11px] font-[600] leading-[150%] mb-1">
                      Asset Type
                    </span>
                    <span className="text-[#000000]  text-[17px] font-[400] leading-[150%]">
                      {basicInfo.assetTypeTitle ??
                        "Special Purpose Vehicle (SPV)"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col pb-3 py-[24px] border-t-[0.5px] border-[#C7C7CC]">
                  <span className="text-[#000000] text-[11px] font-[600] leading-[150%] mb-1">
                    Description:
                  </span>
                  <span className="text-[#000000]  text-[17px] font-[400] leading-[150%]">
                    {basicInfo.description}
                  </span>
                </div>
              </div>
            </div>

            {/* Business Details Section */}
            <div className="bg-[#FAFAFC] border border-[#E5E5EA] rounded-[10px] p-4">
              <h4 className="text-sm font-semibold text-[#000] mb-3 py-[18px] border-b border-[#000]">
                Business Details
              </h4>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-start self-stretch gap-[2px] p-[24px_30px_24px_0]">
                    <span className="text-[#000000] text-[11px] font-[600] leading-[150%] mb-1">
                      Entity Name:
                    </span>
                    <span className="text-[#000000]  text-[17px] font-[400] leading-[150%]">
                      {basicInfo.assetName}
                    </span>
                  </div>

                  <div className="flex flex-col items-start self-stretch gap-[2px] p-[24px_30px_24px_0]">
                    <span className="text-[#000000] text-[11px] font-[600] leading-[150%] mb-1">
                      Industry / Sector:
                    </span>
                    <span className="text-[#000000]  text-[17px] font-[400] leading-[150%]">
                      {businessDetails.industrySector}
                    </span>
                  </div>
                  <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                    <span className="text-[#000000] text-[11px] font-[600] leading-[150%] mb-1">
                      Country:
                    </span>
                    <span className="text-[#000000]  text-[17px] font-[400] leading-[150%]">
                      {businessDetails.country}
                    </span>
                  </div>
                  <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                    <span className="text-[#000000] text-[11px] font-[600] leading-[150%] mb-1">
                      City:
                    </span>
                    <span className="text-[#000000]  text-[17px] font-[400] leading-[150%]">
                      {businessDetails.city}
                    </span>
                  </div>
                  <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                    <span className="text-[#000000] text-[11px] font-[600] leading-[150%] mb-1">
                      Year Established:
                    </span>
                    <span className="text-[#000000]  text-[17px] font-[400] leading-[150%]">
                      {businessDetails.yearEstablished}
                    </span>
                  </div>
                  <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                    <span className="text-[#000000] text-[11px] font-[600] leading-[150%] mb-1">
                      Number of Employees:
                    </span>
                    <span className="text-[#000000]  text-[17px] font-[400] leading-[150%]">
                      {businessDetails.numberOfEmployees}
                    </span>
                  </div>
                  <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                    <span className="text-[#000000] text-[11px] font-[600] leading-[150%] mb-1">
                      Business Valuation:
                    </span>
                    <span className="text-[#000000]  text-[17px] font-[400] leading-[150%]">
                      {businessDetails.businessValuation}
                    </span>
                  </div>
                  <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                    <span className="text-[#000000] text-[11px] font-[600] leading-[150%] mb-1">
                      Operational Status:
                    </span>
                    <span className="text-[#000000]  text-[17px] font-[400] leading-[150%]">
                      {businessDetails.operationalStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Investment Terms Section */}
            <div className="bg-[#FAFAFC] border border-[#E5E5EA] rounded-[10px] p-4">
              <h4 className="text-sm font-semibold text-[#000] mb-3 pb-2 border-b border-[#E5E5EA]">
                Investment Terms
              </h4>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  {businessDetails.ownershipStake !== "Not provided" && (
                    <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                      <span className="text-xs font-medium text-[#000] mb-1">
                        Ownership Stake:
                      </span>
                      <span className="text-xs text-[#000]">
                        {businessDetails.ownershipStake}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                    <span className="text-xs font-medium text-[#000] mb-1">
                      Minimum Investment:
                    </span>
                    <span className="text-xs text-[#000]">
                      {businessDetails.minimumInvestment}
                    </span>
                  </div>
                  {businessDetails.expectedYield !== "Not provided" && (
                    <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                      <span className="text-xs font-medium text-[#000] mb-1">
                        Expected Yield:
                      </span>
                      <span className="text-xs text-[#000]">
                        {businessDetails.expectedYield}
                      </span>
                    </div>
                  )}
                  {businessDetails.minimumAnnualReturn !== "Not provided" && (
                    <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                      <span className="text-xs font-medium text-[#000] mb-1">
                        Minimum Annual Return:
                      </span>
                      <span className="text-xs text-[#000]">
                        {businessDetails.minimumAnnualReturn}
                      </span>
                    </div>
                  )}
                  {businessDetails.expectedTerm !== "Not provided" && (
                    <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                      <span className="text-xs font-medium text-[#000] mb-1">
                        Expected Term:
                      </span>
                      <span className="text-xs text-[#000]">
                        {businessDetails.expectedTerm}
                      </span>
                    </div>
                  )}
                  {businessDetails.targetCloseDate !== "Not provided" && (
                    <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                      <span className="text-xs font-medium text-[#000] mb-1">
                        Target Close Date:
                      </span>
                      <span className="text-xs text-[#000]">
                        {businessDetails.targetCloseDate}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Financial Information Section */}
            <div className="bg-[#FAFAFC] border border-[#E5E5EA] rounded-[10px] p-4">
              <h4 className="text-sm font-semibold text-[#000] mb-3 py-[18px] border-b border-[#000]">
                Financial Information
              </h4>
              <div className="space-y-4">
                {/* Core Financials */}
                <div>
                  <h5 className="text-xs font-semibold text-[#000] mb-2">
                    Core Financials
                  </h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                      <span className="text-xs font-medium text-[#000] mb-1">
                        Annual Revenue:
                      </span>
                      <span className="text-xs text-[#000]">
                        {financialInfo.annualRevenue}
                      </span>
                    </div>
                    {financialInfo.revenueCAGR !== "Not provided" && (
                      <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                        <span className="text-xs font-medium text-[#000] mb-1">
                          Revenue CAGR:
                        </span>
                        <span className="text-xs text-[#000]">
                          {financialInfo.revenueCAGR}
                        </span>
                      </div>
                    )}
                    {financialInfo.ebitda !== "Not provided" && (
                      <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                        <span className="text-xs font-medium text-[#000] mb-1">
                          EBITDA:
                        </span>
                        <span className="text-xs text-[#000]">
                          {financialInfo.ebitda}
                        </span>
                      </div>
                    )}
                    {financialInfo.broadcastingRevenue !== "Not provided" && (
                      <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                        <span className="text-xs font-medium text-[#000] mb-1">
                          Broadcasting Revenue:
                        </span>
                        <span className="text-xs text-[#000]">
                          {financialInfo.broadcastingRevenue}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Industry Financials */}
                {(financialInfo.broadcastingRevenue !== "Not provided" ||
                  financialInfo.matchdayRevenue !== "Not provided" ||
                  financialInfo.commercialRevenue !== "Not provided" ||
                  financialInfo.playerAcquisitions !== "Not provided") && (
                  <div>
                    <hr className="border-t border-[#E5E5EA] my-3" />
                    <h5 className="text-xs font-semibold text-[#000] mb-2">
                      Industry Financials
                    </h5>
                    <div className="grid grid-cols-2 gap-4">
                      {financialInfo.broadcastingRevenue !== "Not provided" && (
                        <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                          <span className="text-xs font-medium text-[#000] mb-1">
                            Broadcasting Revenue:
                          </span>
                          <span className="text-xs text-[#000]">
                            {financialInfo.broadcastingRevenue}
                          </span>
                        </div>
                      )}
                      {financialInfo.matchdayRevenue !== "Not provided" && (
                        <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                          <span className="text-xs font-medium text-[#000] mb-1">
                            Matchday Revenue:
                          </span>
                          <span className="text-xs text-[#000]">
                            {financialInfo.matchdayRevenue}
                          </span>
                        </div>
                      )}
                      {financialInfo.commercialRevenue !== "Not provided" && (
                        <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                          <span className="text-xs font-medium text-[#000] mb-1">
                            Commercial Revenue:
                          </span>
                          <span className="text-xs text-[#000]">
                            {financialInfo.commercialRevenue}
                          </span>
                        </div>
                      )}
                      {financialInfo.playerAcquisitions !== "Not provided" && (
                        <div className="flex flex-col pb-3 border-b border-[#E5E5EA]">
                          <span className="text-xs font-medium text-[#000] mb-1">
                            Player Acquisitions:
                          </span>
                          <span className="text-xs text-[#000]">
                            {financialInfo.playerAcquisitions}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tokenization Details Section */}
            <div className="bg-[#FAFAFC] border border-[#E5E5EA] rounded-[10px] p-4">
              <h4 className="text-sm font-semibold text-[#000] mb-3 py-[18px] border-b border-[#000]">
                Tokenization Details
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="relative flex flex-col pb-3 border-b border-[#E5E5EA]">
                    <div className="absolute top-[-16px] right-0 flex items-center justify-end">
                      <img
                        src={privateIcon}
                        alt="Private"
                        className="w-16 h-16"
                      />
                    </div>
                    <span className="text-xs font-medium text-[#000] mb-1">
                      Total Supply:
                    </span>
                    <span className="text-xs text-[#000]">
                      {formData.totalSupply || 0} Tokens
                    </span>
                  </div>
                  <div className="relative flex flex-col pb-3 border-b border-[#E5E5EA]">
                    <div className="absolute top-[-16px] right-0 flex items-center justify-end">
                      <img
                        src={privateIcon}
                        alt="Private"
                        className="w-16 h-16"
                      />
                    </div>
                    <span className="text-xs font-medium text-[#000] mb-1">
                      Price per Token:
                    </span>
                    <span className="text-xs text-[#000]">
                      {formData.tokenPrice || 0}
                    </span>
                  </div>
                  <div className="relative flex flex-col">
                    <div className="absolute top-[-16px] right-0 flex items-center justify-end">
                      <img
                        src={privateIcon}
                        alt="Private"
                        className="w-16 h-16"
                      />
                    </div>
                    <span className="text-xs font-medium text-[#000] mb-2">
                      Initial Owners:
                    </span>
                    <div className="space-y-2">
                      {formData.initialOwners.length > 0 ? (
                        formData.initialOwners.map((owner, index) => (
                          <div
                            key={owner.id || index}
                            className="flex flex-col justify-start items-start"
                          >
                            <span className="text-xs font-bold text-[#000]">
                              {owner.name || "Not Provided"}
                            </span>
                            <span className="text-xs text-[#000]">
                              {owner.tokenAllocation} Tokens .{" "}
                              {owner.email || "Not Provided"}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-[#000]">
                            Not Provided
                          </span>
                          <span className="text-xs font-bold text-[#000]">
                            Not Provided
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="relative flex flex-col pb-3 border-b border-[#E5E5EA]">
                    <div className="absolute top-[-16px] right-0 flex items-center justify-end">
                      <img
                        src={privateIcon}
                        alt="Private"
                        className="w-16 h-16"
                      />
                    </div>
                    <span className="text-xs font-medium text-[#000] mb-1">
                      Initial Mint:
                    </span>
                    <span className="text-xs text-[#000]">
                      {formData.initialMint || "Not Provided"} Tokens
                    </span>
                  </div>
                  <div className="relative flex flex-col pb-3 border-b border-[#E5E5EA]">
                    <div className="absolute top-[-16px] right-0 flex items-center justify-end">
                      <img
                        src={privateIcon}
                        alt="Private"
                        className="w-16 h-16"
                      />
                    </div>
                    <span className="text-xs font-medium text-[#000] mb-1">
                      Capital Target:
                    </span>
                    <span className="text-xs text-[#000]">
                      {formData.totalSupply * formData.tokenPrice
                        ? formData.totalSupply * formData.tokenPrice
                        : "Not Provided"}
                    </span>
                  </div>
                  <div className="relative flex flex-col">
                    <div className="absolute top-[-16px] right-0 flex items-center justify-end">
                      <img
                        src={privateIcon}
                        alt="Private"
                        className="w-16 h-16"
                      />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-[#000]">
                        Issuer Treasury:
                      </span>
                    </div>
                    <span className="text-xs text-[#000]">
                      {formData.totalSupply - formData.initialMint || "0"}
                      Tokens
                    </span>
                    <p className="text-xs text-[#48484A] mt-1">
                      Available for investment at mint. Unminted tokens will be
                      minted on demand by the Registrar as needed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Legal & Compliance Documents Section */}
            <div className="bg-[#FAFAFC] border border-[#E5E5EA] rounded-[10px] p-4">
              <h4 className="text-sm font-semibold text-[#000] mb-3 py-[18px] border-b border-[#000]">
                Legal & Compliance Documents
              </h4>
              <div className="space-y-3">
                {legalDocuments.length > 0 ? (
                  <div className="space-y-3">
                    {legalDocuments.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <input
                            type="checkbox"
                            checked={true}
                            readOnly
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-[#000] truncate">
                              {doc.title ||
                                doc.filename ||
                                doc.name ||
                                `Document ${index + 1}`}
                            </p>
                            <p className="text-xs text-[#48484A] truncate">
                              {doc.filename || doc.title || doc.name} ·{" "}
                              {formatFileSize(doc.size)}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            if (doc.url) {
                              window.open(doc.url, "_blank");
                            } else if (doc.file) {
                              const url = URL.createObjectURL(doc.file);
                              window.open(url, "_blank");
                            }
                          }}
                          className="!rounded-full flex-shrink-0"
                        >
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#48484A]">
                    No documents added yet
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex w-full gap-4">
              <Button
                type="button"
                variant="secondary"
                // onClick={handleSubmit}
                className="!rounded-full w-full"
                disabled={isPublishing}
              >
                Save Draft
              </Button>
              <Button
                type="button"
                variant="gradient"
                onClick={handleSubmit}
                className="!rounded-full w-full !hover:bg-red-700"
                disabled={isPublishing || checkAllSectionsFilled().length > 0}
              >
                {isPublishing ? "Submitting..." : "Submit for Approval"}
              </Button>
            </div>

            {/* Delete Link */}
            <div className="flex justify-center !my-12">
              <button
                onClick={handleDeleteClick}
                className="text-[13px] font-semibold text-[#D70015] hover:text-red-700 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Submit Confirmation Modal */}
      <SubmitAssetModal
        isOpen={isSubmitModalOpen}
        onClose={handleSubmitModalClose}
        onSubmit={handleSubmitRequest}
        isPublishing={isPublishing}
        basicInfo={basicInfo}
        businessDetails={businessDetails}
        tokenizationDetails={tokenizationDetails}
      />

      {/* Delete Confirmation Modal */}
      <DeleteAssetModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        assetName={basicInfo.assetName}
        createdDate={formData.createdAt}
        lastModifiedDate={formData.updatedAt}
      />
    </>
  );
}

export default ReviewSubmit;
