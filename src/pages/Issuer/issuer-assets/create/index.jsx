import { useGetAssetDetails, useGetAssetTypes, useGetCountries } from "@/api";
import infoCircle from "@/assets/issuer-assets/info-circle.svg";
import { TableLoader } from "@/components/shared";
import SubHeading from "@/components/shared/subheading";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BasicInformation from "./sections/BasicInformation";
import BusinessDetails from "./sections/BusinessDetails";
import FinancialInformation from "./sections/FinancialInformation";
import LegalComplianceDocuments from "./sections/LegalComplianceDocuments";
import ReviewSubmit from "./sections/ReviewSubmit";
import TokenizationDetails from "./sections/TokenizationDetails";
import TokenizationRequirementsSidebar from "./TokenizationRequirementsSidebar";

// Map API response to formData structure
const mapApiDataToFormData = (apiData) => {
  if (!apiData) return null;

  const businessDetail = apiData.assetBusinessDetail || {};
  const assetType = apiData.assetType || {};
  const initialOwners = apiData.assetInitialOwners || [];
  const assetFiles = apiData.assetFiles || [];

  return {
    // Basic Information
    assetName: apiData.name || "",
    description: apiData.description || "",
    assetType: assetType.id || "",
    assetTypeTitle: assetType.title || "",
    // Business Details
    // entityName: businessDetail.entity_name || "",
    businessName: apiData.name || "",
    industrySector: businessDetail.industry || "",
    country: businessDetail.country || "",
    city: businessDetail.city || "",
    ownershipStake: businessDetail.ownership_stake || "",
    businessValuation: businessDetail.business_valuation || "",
    annualRevenue: businessDetail.annual_revenue || "",
    keyRevenueStreams: "", // Not in API response
    operationalStatus: businessDetail.operational_status || "",
    yearEstablished: businessDetail.year_established?.toString() || "",
    numberOfEmployees: businessDetail.number_of_employees?.toString() || "",
    minimumInvestment: businessDetail.minimum_investment || "",
    expectedYield: businessDetail.expected_yield || "",
    expectedTerm: businessDetail.expected_term || "",
    minimumAnnualReturn: businessDetail.minimum_annual_return || "",
    targetCloseDate: businessDetail.target_close_date || "",
    // Financial Information
    capitalTarget: businessDetail.minimum_investment || "",
    initialMint: apiData.initial_mint || "",
    totalSupply: apiData.total_supply || "",
    revenueCAGR: businessDetail.revenue_cagr || "",
    ebitda: businessDetail.ebitda || "",
    broadcastingRevenue: businessDetail.broadcasting_revenue || "",
    matchdayRevenue: businessDetail.matchday_revenue || "",
    commercialRevenue: businessDetail.commercial_revenue || "",
    playerAcquisitions: businessDetail.player_acquisitions || "",
    operatingExpenses: businessDetail.operating_expenses || "",
    // Tokenization Details
    tokenName: apiData.name || "",
    tokenSymbol: "", // Not in API response
    tokenPrice: apiData.initial_price?.toString() || "",
    initialOwners:
      initialOwners.length > 0
        ? initialOwners.map((owner) => ({
            name: owner.name || "",
            email: owner.email || "",
            tokenAllocation: owner.token_allocation?.toString() || "",
            id: owner.id || null,
          }))
        : [{ name: "", email: "", tokenAllocation: "", id: null }],
    // Legal & Compliance
    documents:
      assetFiles.length > 0
        ? assetFiles.map((file) => ({
            id: file.id,
            url: file.url,
            slug: file.slug,
            filename: file.url.split("/").pop() || "document",
            title:
              file.url
                .split("/")
                .pop()
                ?.replace(/\.[^/.]+$/, "")
                .replace(/-/g, " ") || "Document",
            size: null, // Size not available from API
            status: "completed",
            updated_at: file.updated_at,
          }))
        : [],
    // Review & Submit
    reviewed: false,
    // Additional fields for edit mode
    assetId: apiData.id || "",
    featuredImage: apiData.featured_image || "",
    marketplaceDescription: apiData.marketplace_description || "",
    marketplaceTeaser: apiData.marketplace_teaser || "",
    createdAt: apiData.created_at || "",
    updatedAt: apiData.updated_at || "",
  };
};

function CreateNewAsset() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const assetId = searchParams.get("id") || null;

  // Fetch asset details if editing
  const { data: assetDetails, isLoading: isLoadingAsset } =
    useGetAssetDetails(assetId);

  // Fetch asset types
  const { data: assetTypesData } = useGetAssetTypes();

  // Fetch countries (cached for better performance)
  const { data: countriesData } = useGetCountries();

  // Form data state
  const [formData, setFormData] = useState({
    // Basic Information
    assetName: "",
    description: "",
    assetType: "",
    // Business Details
    businessName: "",
    industrySector: "",
    country: "",
    city: "",
    ownershipStake: "",
    businessValuation: "",
    annualRevenue: "",
    keyRevenueStreams: "",
    operationalStatus: "",
    yearEstablished: "",
    numberOfEmployees: "",
    minimumInvestment: "",
    expectedYield: "",
    expectedTerm: "",
    pricePerToken: "",
    minimumAnnualReturn: "",
    targetCloseDate: "",
    // Financial Information
    capitalTarget: "",
    initialMint: "",
    totalSupply: "",
    revenueCAGR: "",
    ebitda: "",
    broadcastingRevenue: "",
    matchdayRevenue: "",
    commercialRevenue: "",
    playerAcquisitions: "",
    operatingExpenses: "",
    // Tokenization Details
    tokenName: "",
    tokenSymbol: "",
    tokenPrice: "",
    initialOwners: [],
    // Legal & Compliance
    documents: [],
    // Review & Submit
    reviewed: false,
  });

  // Section expanded/collapsed state
  const [expandedSections, setExpandedSections] = useState({
    basicInformation: true,
    businessDetails: false,
    financialInformation: false,
    tokenizationDetails: false,
    legalCompliance: false,
    reviewSubmit: false,
  });

  // Track which sections are filled
  const [filledSections, setFilledSections] = useState({
    basicInformation: false,
    businessDetails: false,
    financialInformation: false,
    tokenizationDetails: false,
    legalCompliance: false,
    reviewSubmit: false,
  });

  // Formik will handle validation, errors, and touched fields internally per section

  // Current active section
  const [activeSection, setActiveSection] = useState("basicInformation");

  // Store asset ID (from URL or from basic info creation)
  const [currentAssetId, setCurrentAssetId] = useState(assetId || null);

  // Set default asset type from API response (first item)
  useEffect(() => {
    if (
      assetTypesData &&
      Array.isArray(assetTypesData) &&
      assetTypesData.length > 0 &&
      !formData.assetType
    ) {
      const firstAssetType = assetTypesData[0];
      setFormData((prev) => ({
        ...prev,
        assetType: firstAssetType.id,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetTypesData]);

  // Formik handles validation internally - no need for manual section data extraction

  // Load asset data when editing
  useEffect(() => {
    if (assetDetails && assetId) {
      const mappedData = mapApiDataToFormData(assetDetails);
      if (mappedData) {
        setFormData(mappedData);
        setCurrentAssetId(assetId); // Set the asset ID from URL

        // Update filled sections based on loaded data
        const updatedFilledSections = {
          basicInformation: !!(mappedData.assetName && mappedData.description),
          businessDetails: !!(
            mappedData.industrySector &&
            mappedData.ownershipStake &&
            mappedData.businessValuation &&
            mappedData.operationalStatus &&
            mappedData.yearEstablished &&
            mappedData.numberOfEmployees
          ),
          financialInformation: !!(
            mappedData.annualRevenue ||
            mappedData.revenueCAGR ||
            mappedData.ebitda
          ),
          tokenizationDetails: !!(
            mappedData.totalSupply &&
            mappedData.initialMint &&
            mappedData.tokenPrice
          ),
          legalCompliance:
            mappedData.documents && mappedData.documents.length > 0,
          reviewSubmit: false,
        };
        setFilledSections(updatedFilledSections);

        // Find the first unfilled section and open it
        const sectionOrder = [
          "basicInformation",
          "businessDetails",
          "financialInformation",
          "tokenizationDetails",
          "legalCompliance",
          "reviewSubmit",
        ];

        const firstUnfilledSection =
          sectionOrder.find((section) => !updatedFilledSections[section]) ||
          "basicInformation";

        // Update expanded sections to show the first unfilled section
        const updatedExpandedSections = {
          basicInformation: firstUnfilledSection === "basicInformation",
          businessDetails: firstUnfilledSection === "businessDetails",
          financialInformation: firstUnfilledSection === "financialInformation",
          tokenizationDetails: firstUnfilledSection === "tokenizationDetails",
          legalCompliance: firstUnfilledSection === "legalCompliance",
          reviewSubmit: firstUnfilledSection === "reviewSubmit",
        };
        setExpandedSections(updatedExpandedSections);
        setActiveSection(firstUnfilledSection)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetDetails, assetId]);

  const toggleSection = (sectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
    if (!expandedSections[sectionKey]) {
      setActiveSection(sectionKey);
    }
  };

  // Formik handles touched fields and validation errors internally

  const updateFormData = (sectionKey, data) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        ...data,
      };

      // Check if section is filled using the merged formData
      const isFilled = checkSectionFilled(sectionKey, updated);
      setFilledSections((prevFilled) => ({
        ...prevFilled,
        [sectionKey]: isFilled,
      }));

      return updated;
    });
  };

  const checkSectionFilled = (sectionKey, formData) => {
    switch (sectionKey) {
      case "basicInformation":
        return !!(formData.assetName && formData.description);
      case "businessDetails":
        return !!(
          formData.industrySector &&
          formData.ownershipStake &&
          formData.businessValuation &&
          formData.operationalStatus &&
          formData.yearEstablished &&
          formData.numberOfEmployees
        );
      case "financialInformation":
        return !!(
          formData.annualRevenue ||
          formData.revenueCAGR ||
          formData.ebitda
        );
      case "tokenizationDetails":
        return !!(
          formData.totalSupply &&
          formData.initialMint &&
          formData.tokenPrice
        );
      case "legalCompliance":
        return formData.documents && formData.documents.length > 0;
      default:
        return false;
    }
  };

  const handleSaveDraft = (sectionKey) => {
    // Save draft logic - you can implement API call here
    console.log("Saving draft for section:", sectionKey, formData);
    // TODO: Implement API call to save draft
  };

  const handleNext = (currentSection) => {
    // Move to next section - Formik handles validation per section
    const sectionOrder = [
      "basicInformation",
      "businessDetails",
      "financialInformation",
      "tokenizationDetails",
      "legalCompliance",
      "reviewSubmit",
    ];

    const currentIndex = sectionOrder.indexOf(currentSection);
    if (currentIndex < sectionOrder.length - 1) {
      const nextSection = sectionOrder[currentIndex + 1];
      setExpandedSections((prev) => ({
        ...prev,
        [currentSection]: false,
        [nextSection]: true,
      }));
      setActiveSection(nextSection);
    }
  };

  const handleBack = () => {
    navigate("/issuer/assets");
  };

  const handleSectionClick = (sectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: true,
    }));
    setActiveSection(sectionKey);
  };

  const handleClearAll = () => {
    // Reset all form data to initial state
    setFormData({
      // Basic Information
      assetName: "",
      description: "",
      assetType: "",
      // Business Details
      businessName: "",
      industrySector: "",
      country: "",
      city: "",
      ownershipStake: "",
      businessValuation: "",
      annualRevenue: "",
      keyRevenueStreams: "",
      operationalStatus: "",
      yearEstablished: "",
      numberOfEmployees: "",
      minimumInvestment: "",
      expectedYield: "",
      expectedTerm: "",
      minimumAnnualReturn: "",
      targetCloseDate: "",
      // Financial Information
      capitalTarget: "",
      initialMint: "",
      totalSupply: "",
      revenueCAGR: "",
      ebitda: "",
      broadcastingRevenue: "",
      matchdayRevenue: "",
      commercialRevenue: "",
      playerAcquisitions: "",
      operatingExpenses: "",
      // Tokenization Details
      tokenName: "",
      tokenSymbol: "",
      tokenPrice: "",
      initialOwners: [],
      // Legal & Compliance
      documents: [],
      // Review & Submit
      reviewed: false,
    });

    // Reset all sections to initial state
    setExpandedSections({
      basicInformation: true,
      businessDetails: false,
      financialInformation: false,
      tokenizationDetails: false,
      legalCompliance: false,
      reviewSubmit: false,
    });

    // Reset filled sections
    setFilledSections({
      basicInformation: false,
      businessDetails: false,
      financialInformation: false,
      tokenizationDetails: false,
      legalCompliance: false,
      reviewSubmit: false,
    });

    // Reset active section
    setActiveSection("basicInformation");
  };

  // Show loader while fetching asset details
  if (assetId && isLoadingAsset) {
    return (
      <div className="border rounded-tr-[24px] min-h-screen flex items-center justify-center">
        <TableLoader message="Loading asset details..." />
      </div>
    );
  }

  return (
    <div className=" border rounded-tr-[24px] min-h-screen ">
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* Left Column - 70% (7/10 columns) */}
          <div className="lg:col-span-7 space-y-4 pr-6 pl-10 ">
            <div className="bg-[#FFFFFF] rounded-tr-[24px]  pt-3 pb-2">
              {/* <Button
                variant="secondary"
                size="sm"
                className="rounded-full bg-white text-black border border-black  h-[28px] w-[80px] text-sm font-medium"
                icon={<FaArrowLeft className="!h-3 !w-3" />}
                iconPosition="left"
                onClick={handleBack}
              >
                Back
              </Button> */}
              <div className="text-start text-[24px] mt-6 font-normal font-['Atacama'] leading-[120%] tracking-[0.48px] text-[#000]">
                {assetId
                  ? "Edit RWA Tokenization Request"
                  : "Asset Tokenization Request"}
              </div>
              <SubHeading className="!text-start !font-normal !text-[13px] !py-0 !mt-1  !text-[#000]">
                {assetId
                  ? "Edit the sections below to update your business entity tokenization request."
                  : "Create a request to send to the Registrar for tokenization."}
              </SubHeading>
              <div className="mt-6 flex items-center justify-between">
                <p className="!text-[#000] font-medium hover:underline flex items-center gap-1 ">
                  <img
                    src={infoCircle}
                    alt="arrow-right"
                    className="!h-3 !w-3  text-black mb-1"
                  />
                  <p className="text-[11px] font-[400] text-[#000]">
                    <span className="font-semibold">
                      All fields are required.&nbsp;
                    </span>
                    Please complete all sections before submitting your
                    tokenization request.
                  </p>
                </p>

                <a href="#" className="font-medium text-[13px] text-[#073BC3]">
                  Expand All
                </a>
              </div>
              <hr className="border-t border-[#E5E5EA] text-[#000] my-4"></hr>
            </div>
            <BasicInformation
              key={assetId ? `basic-${assetId}` : "basic-new"}
              formData={formData}
              updateFormData={updateFormData}
              isExpanded={expandedSections.basicInformation}
              isFilled={filledSections.basicInformation}
              onToggle={() => toggleSection("basicInformation")}
              onSaveDraft={() => handleSaveDraft("basicInformation")}
              onNext={() => handleNext("basicInformation")}
              currentAssetId={currentAssetId}
              onAssetIdCreated={(id) => setCurrentAssetId(id)}
              assetTypes={assetTypesData || []}
            />
            <hr className="border-t border-[#E5E5EA]" />
            <BusinessDetails
              key={assetId ? `business-${assetId}` : "business-new"}
              formData={formData}
              updateFormData={updateFormData}
              isExpanded={expandedSections.businessDetails}
              isFilled={filledSections.businessDetails}
              onToggle={() => toggleSection("businessDetails")}
              onSaveDraft={() => handleSaveDraft("businessDetails")}
              onNext={() => handleNext("businessDetails")}
              currentAssetId={currentAssetId}
              countries={countriesData || []}
            />
            <hr className="border-t border-[#E5E5EA]" />

            <FinancialInformation
              key={assetId ? `financial-${assetId}` : "financial-new"}
              formData={formData}
              updateFormData={updateFormData}
              isExpanded={expandedSections.financialInformation}
              isFilled={filledSections.financialInformation}
              onToggle={() => toggleSection("financialInformation")}
              onSaveDraft={() => handleSaveDraft("financialInformation")}
              onNext={() => handleNext("financialInformation")}
              currentAssetId={currentAssetId}
            />
            <hr className="border-t border-[#E5E5EA]" />
            <TokenizationDetails
              key={assetId ? `tokenization-${assetId}` : "tokenization-new"}
              formData={formData}
              updateFormData={updateFormData}
              isExpanded={expandedSections.tokenizationDetails}
              isFilled={filledSections.tokenizationDetails}
              onToggle={() => toggleSection("tokenizationDetails")}
              onSaveDraft={() => handleSaveDraft("tokenizationDetails")}
              onNext={() => handleNext("tokenizationDetails")}
              currentAssetId={currentAssetId}
            />
            <hr className="border-t border-[#E5E5EA]" />
            <LegalComplianceDocuments
              key={assetId ? `legal-${assetId}` : "legal-new"}
              formData={formData}
              updateFormData={updateFormData}
              isExpanded={expandedSections.legalCompliance}
              isFilled={filledSections.legalCompliance}
              onToggle={() => toggleSection("legalCompliance")}
              onSaveDraft={() => handleSaveDraft("legalCompliance")}
              onNext={() => handleNext("legalCompliance")}
              currentAssetId={currentAssetId}
            />
            <hr className="border-t border-[#E5E5EA]" />
            <ReviewSubmit
              formData={formData}
              updateFormData={updateFormData}
              isExpanded={expandedSections.reviewSubmit}
              isFilled={filledSections.reviewSubmit}
              onToggle={() => toggleSection("reviewSubmit")}
              onSaveDraft={() => handleSaveDraft("reviewSubmit")}
              onSubmit={() => {
                console.log("Final submission:", formData);
                navigate("/issuer/assets");
              }}
              onClearAll={handleClearAll}
              assetId={currentAssetId}
              filledSections={filledSections}
            />
          </div>

          {/* Right Column - 30% (3/10 columns) */}
          <div className="lg:col-span-3 border-l border-[#E5E5EA] px-4">
            <div>
              <TokenizationRequirementsSidebar
                filledSections={filledSections}
                activeSection={activeSection}
                onSectionClick={handleSectionClick}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateNewAsset;
