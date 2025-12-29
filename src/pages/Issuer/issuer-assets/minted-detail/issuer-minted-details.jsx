import {
  useCreateUpdateSponsor,
  useDeleteSponsor,
  useGetAssetDetails,
  usePublishToMarketplace,
  useUpdateAssetFiles,
  useUpdateFeaturedImage,
  useUpdateMarketplace,
} from "@/api";
import { useUploadKYCFile } from "@/api/kyc/useUploadKYCFile";
import { TableLoader } from "@/components/shared";
import useToast from "@/hooks/useCustomToast";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import AssetTokenizationDetails from "./AssetTokenizationDetails";
import MarketplaceListing from "./MarketplaceListing";
import PublishToMarketLoader from "./PublishToMarketLoader";
import PublishToMarketModal from "./PublishToMarketModal";
import PublishToMarketSuccessModal from "./PublishToMarketSuccessModal";
import RightSidebar from "./RightSidebar";

// Validate URL format - moved outside component to prevent hook order issues
const validateURL = (url) => {
  if (!url || !url.trim()) {
    return true; // Empty URL is allowed (optional field)
  }
  const trimmedUrl = url.trim();
  // Check if it starts with http:// or https://
  if (!trimmedUrl.startsWith("http://") && !trimmedUrl.startsWith("https://")) {
    return false;
  }
  try {
    const urlObj = new URL(trimmedUrl);
    // Check if it's http or https and has a valid hostname
    return (
      (urlObj.protocol === "http:" || urlObj.protocol === "https:") &&
      urlObj.hostname.length > 0
    );
  } catch (e) {
    return false;
  }
};

// Validate sponsor field (min: 1 character, max: configurable) - moved outside component
const validateSponsorField = (
  fieldName,
  value,
  isRequired = true,
  maxLimit = 20
) => {
  if (!isRequired && (!value || value === "")) {
    return ""; // Optional fields that are empty are valid
  }

  const strValue = String(value || "");
  const length = strValue.trim().length;

  if (length < 1) {
    return "This field must be at least 1 character";
  }
  if (length > maxLimit) {
    return ` This field must be at most ${maxLimit} characters`;
  }
  return "";
};

function IssuerAssetsMintedDetailsPage() {
  const { id } = useParams();
  const assetId = id || null;

  // State for expand/collapse sections
  const [isTokenizationExpanded, setIsTokenizationExpanded] = useState(false);
  const [isMarketplaceExpanded, setIsMarketplaceExpanded] = useState(true);

  // State for publish to market modals
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isPublishLoaderOpen, setIsPublishLoaderOpen] = useState(false);
  const [isPublishSuccessOpen, setIsPublishSuccessOpen] = useState(false);
  const [publishResponseData, setPublishResponseData] = useState(null);
  const [isPublishApiComplete, setIsPublishApiComplete] = useState(false);
  const [loaderAnimationComplete, setLoaderAnimationComplete] = useState(false);

  const { data: assetDetails, isLoading: isLoadingAsset } =
    useGetAssetDetails(assetId);

  // Extract data from API response
  const asset = assetDetails || {};
  const businessDetail = asset.assetBusinessDetail || {};

  // State for marketplace description
  const [marketplaceListingDescription, setMarketplaceListingDescription] =
    useState("");
  const [marketplaceListingTeaser, setMarketplaceListingTeaser] = useState("");

  // File input refs for media uploads
  const logoRef = useRef(null);
  const featureImageRef = useRef(null);
  const additionalPhotosRef = useRef(null);

  // State for media uploads
  const [logoFile, setLogoFile] = useState(null);
  const [featureImageFile, setFeatureImageFile] = useState(null);
  const [additionalPhotos, setAdditionalPhotos] = useState([]);

  // State for additional documents (max 4)
  const additionalDocumentsRef = useRef(null);
  const [additionalDocuments, setAdditionalDocuments] = useState([]);

  // State for Scale section
  const [globalAudienceSize, setGlobalAudienceSize] = useState("");
  const [socialMediaPresence, setSocialMediaPresence] = useState("");

  // State for Stadium Utilization section
  const [occupancyRate, setOccupancyRate] = useState("");
  const [annualAttendance, setAnnualAttendance] = useState("");

  // Validation errors state
  const [marketplaceValidationErrors, setMarketplaceValidationErrors] =
    useState({});
  const [marketplaceValidationTriggered, setMarketplaceValidationTriggered] =
    useState(false);
  const [sponsorValidationErrors, setSponsorValidationErrors] = useState({});
  const [sponsorValidationTriggered, setSponsorValidationTriggered] = useState(
    new Set()
  ); // Track which sponsors have had validation triggered

  // State for Key Sponsors and Partners - Initialize with default first sponsor
  const [sponsors, setSponsors] = useState([
    {
      id: "default-sponsor-1",
      logo: null,
      name: "",
      value: "",
      contract: "",
      url: "",
    },
  ]);
  const sponsorLogoRefs = useRef({});
  const [savingSponsorId, setSavingSponsorId] = useState(null);
  const [uploadingLogoId, setUploadingLogoId] = useState(null);
  const [sponsorsLoaded, setSponsorsLoaded] = useState(false);
  const [isSubmittingMarketplace, setIsSubmittingMarketplace] = useState(false);
  const [deletingSponsorId, setDeletingSponsorId] = useState(null);
  const [marketplaceSubmittedSuccessfully, setMarketplaceSubmittedSuccessfully] =
    useState(false);
  const [marketplaceFieldsModified, setMarketplaceFieldsModified] =
    useState(false);
  const [sponsorsSavedSuccessfully, setSponsorsSavedSuccessfully] = useState(
    {}
  ); // Track which sponsors have been saved successfully {sponsorId: true/false}
  const [sponsorsFieldsModified, setSponsorsFieldsModified] = useState({}); // Track which sponsors have been modified {sponsorId: true/false}
  const { showBottomRightToast: showSuccessToast, showErrorToast } = useToast();
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFeatureImage, setUploadingFeatureImage] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [photosLoaded, setPhotosLoaded] = useState(false);
  const [documentsLoaded, setDocumentsLoaded] = useState(false);
  const { mutate: createUpdateSponsor } = useCreateUpdateSponsor();
  const { mutate: uploadFile } = useUploadKYCFile();
  const { mutate: updateMarketplace } = useUpdateMarketplace();
  const { mutate: updateFeaturedImage } = useUpdateFeaturedImage();
  const { mutate: deleteSponsor } = useDeleteSponsor();
  const { mutate: updateAssetFiles } = useUpdateAssetFiles();
  const { mutate: publishToMarketplace } = usePublishToMarketplace();

  // Load sponsors from API if available
  useEffect(() => {
    if (!sponsorsLoaded && asset?.assetSponser) {
      if (Array.isArray(asset.assetSponser) && asset.assetSponser.length > 0) {
        const mappedSponsors = asset.assetSponser.map((sponsor) => ({
          id: sponsor.id,
          logo: sponsor.url ? { url: sponsor.url, preview: sponsor.url } : null,
          name: sponsor.title || "",
          value: sponsor.value || "",
          contract: sponsor.contract_year || "",
          url: sponsor.website_url || "",
          urlError: null,
        }));
        setSponsors(mappedSponsors);
      }
      setSponsorsLoaded(true);
    }
  }, [asset?.assetSponser, sponsorsLoaded]);

  // Load logo and featured image from API if available
  useEffect(() => {
    if (!imagesLoaded && asset) {
      // Load logo - check both direct property and assetFiles
      let logoUrl = asset.logo;
      if (!logoUrl && asset?.assetFiles) {
        const logoFile = asset.assetFiles.find((file) => file.slug === "logo");
        if (logoFile) {
          logoUrl = logoFile.url;
        }
      }
      if (logoUrl) {
        setLogoFile({ preview: logoUrl, url: logoUrl });
      }

      // Load featured image - check both direct property and assetFiles
      let featuredImageUrl = asset.featured_image;
      if (!featuredImageUrl && asset?.assetFiles) {
        const featuredImageFile = asset.assetFiles.find(
          (file) =>
            file.slug === "featured_image" || file.slug === "featured-image"
        );
        if (featuredImageFile) {
          featuredImageUrl = featuredImageFile.url;
        }
      }
      if (featuredImageUrl) {
        setFeatureImageFile({
          preview: featuredImageUrl,
          url: featuredImageUrl,
        });
      }
      setImagesLoaded(true);
    }
  }, [asset, imagesLoaded]);

  // Load additional photos from API if available
  useEffect(() => {
    if (!photosLoaded && asset?.assetFiles) {
      const imageFiles = asset.assetFiles.filter(
        (file) => file.slug === "images"
      );
      if (imageFiles.length > 0) {
        const mappedPhotos = imageFiles.map((file) => ({
          id: file.id,
          preview: file.url,
          url: file.url,
          file_name: file.file_name,
        }));
        setAdditionalPhotos(mappedPhotos);
      }
      setPhotosLoaded(true);
    }
  }, [asset?.assetFiles, photosLoaded]);

  // Load additional documents from API if available
  useEffect(() => {
    if (!documentsLoaded && asset?.assetFiles) {
      const documentFiles = asset.assetFiles.filter(
        (file) => file.slug === "documents"
      );
      if (documentFiles.length > 0) {
        const mappedDocuments = documentFiles.map((file) => ({
          id: file.id,
          displayName: file.file_name,
          fileName: file.file_name,
          url: file.url,
          size: 0, // Size not provided in API response
        }));
      }
      setDocumentsLoaded(true);
    }
  }, [asset?.assetFiles, documentsLoaded]);

  // Load marketplace data from API if available
  useEffect(() => {
    if (asset) {
      if (asset.marketplace_description !== undefined) {
        setMarketplaceListingDescription(asset.marketplace_description || "");
      }
      if (asset.marketplace_teaser !== undefined) {
        setMarketplaceListingTeaser(asset.marketplace_teaser || "");
      }
      const bd = asset.assetBusinessDetail || {};
      if (bd.global_audience_size !== undefined) {
        setGlobalAudienceSize(bd.global_audience_size || "");
      }
      if (bd.special_media_presence !== undefined) {
        setSocialMediaPresence(bd.special_media_presence || "");
      }
      if (bd.stadium_occupancy_rate !== undefined) {
        setOccupancyRate(bd.stadium_occupancy_rate || "");
      }
      if (bd.stadium_annual_attendence !== undefined) {
        setAnnualAttendance(bd.stadium_annual_attendence || "");
      }
    }
  }, [asset]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (logoFile?.preview) URL.revokeObjectURL(logoFile.preview);
      if (featureImageFile?.preview)
        URL.revokeObjectURL(featureImageFile.preview);
      additionalPhotos.forEach((photo) => {
        if (photo?.preview) URL.revokeObjectURL(photo.preview);
      });
      additionalDocuments.forEach((doc) => {
        if (doc?.preview) URL.revokeObjectURL(doc.preview);
      });
      sponsors.forEach((sponsor) => {
        if (sponsor.logo?.preview) URL.revokeObjectURL(sponsor.logo.preview);
      });
    };
  }, [
    logoFile,
    featureImageFile,
    additionalPhotos,
    additionalDocuments,
    sponsors,
  ]);

  // Effect to show success modal when both API and loader animation are complete
  useEffect(() => {
    if (
      isPublishApiComplete &&
      loaderAnimationComplete &&
      isPublishLoaderOpen
    ) {
      setIsPublishLoaderOpen(false);
      setIsPublishSuccessOpen(true);
      setLoaderAnimationComplete(false);
      setIsPublishApiComplete(false);
    }
  }, [isPublishApiComplete, loaderAnimationComplete, isPublishLoaderOpen]);

  // Extract data from asset (before early return to ensure hooks are called consistently)
  const assetType = asset.assetType || {};
  const initialOwners = asset.assetInitialOwners || [];
  const assetFiles = asset.assetFiles || [];

  // Function to validate all sponsors (used for publish validation)
  const validateAllSponsors = () => {
    const errors = {};
    let hasErrors = false;

    sponsors.forEach((sponsor) => {
      const prefix = `sponsor_${sponsor.id}_`;

      // Validate name (required, max 100)
      errors[`${prefix}name`] = validateSponsorField(
        "Name",
        sponsor.name,
        true,
        100
      );
      if (errors[`${prefix}name`]) hasErrors = true;

      // Validate value (required, max 20)
      errors[`${prefix}value`] = validateSponsorField(
        "Value",
        sponsor.value,
        true,
        20
      );
      if (errors[`${prefix}value`]) hasErrors = true;

      // Validate contract (required, max 20)
      errors[`${prefix}contract`] = validateSponsorField(
        "Contract",
        sponsor.contract,
        true,
        20
      );
      if (errors[`${prefix}contract`]) hasErrors = true;

      // Validate URL (required, must be valid format)
      if (!sponsor.url || !sponsor.url.trim()) {
        errors[`${prefix}url`] = "URL is required (min 1 character)";
        hasErrors = true;
      } else if (!validateURL(sponsor.url)) {
        errors[`${prefix}url`] =
          "Please enter a valid URL (must start with http:// or https://)";
        hasErrors = true;
      }

      // Validate logo (required - must have url)
      if (!sponsor.logo || !sponsor.logo.url) {
        errors[`${prefix}logo`] = "Logo is required";
        hasErrors = true;
      }
    });

    return { errors, hasErrors };
  };

  // Validate individual sponsor
  const validateSponsor = (sponsor) => {
    const errors = {};
    const prefix = `sponsor_${sponsor.id}_`;

    // Validate name (required, max 100)
    errors[`${prefix}name`] = validateSponsorField(
      "Name",
      sponsor.name,
      true,
      100
    );

    // Validate value (required, max 20)
    errors[`${prefix}value`] = validateSponsorField(
      "Value",
      sponsor.value,
      true,
      20
    );

    // Validate contract (required, max 20)
    errors[`${prefix}contract`] = validateSponsorField(
      "Contract",
      sponsor.contract,
      true,
      20
    );

    // Validate URL (required, must be valid format)
    if (!sponsor.url || !sponsor.url.trim()) {
      errors[`${prefix}url`] = "URL is required (min 1 character)";
    } else if (!validateURL(sponsor.url)) {
      errors[`${prefix}url`] =
        "Please enter a valid URL (must start with http:// or https://)";
    }

    // Validate logo (required - must have url)
    if (!sponsor.logo || !sponsor.logo.url) {
      errors[`${prefix}logo`] = "Logo is required";
    }

    return errors;
  };

  // Validation function to check required fields before publishing
  // Defined before useMemo that uses it
  const validatePublishFields = () => {
    const errors = [];

    // Check marketplace description
    if (
      !marketplaceListingDescription ||
      marketplaceListingDescription.trim() === ""
    ) {
      errors.push("Marketplace Description");
    }

    // Check marketplace teaser
    if (!marketplaceListingTeaser || marketplaceListingTeaser.trim() === "") {
      errors.push("Marketplace Teaser");
    }

    // Check logo file
    if (!logoFile || (!logoFile.preview && !logoFile.url)) {
      errors.push("Logo");
    }

    // Check featured image
    if (
      !featureImageFile ||
      (!featureImageFile.preview && !featureImageFile.url)
    ) {
      errors.push("Featured Image");
    }

    // Check additional documents - at least one document required
    if (!additionalDocuments || additionalDocuments.length === 0) {
      errors.push("Additional Documents (at least one document required)");
    }

    // Check sponsors - all sponsors must be valid
    const sponsorValidation = validateAllSponsors();
    if (sponsorValidation.hasErrors || sponsors.length === 0) {
      errors.push(
        "Key Sponsors and Partners (all sponsor fields must be filled and valid)"
      );
    }

    return errors;
  };

  const canPublishToMarketplace = useMemo(() => {
    const missingFields = validatePublishFields();
    return missingFields.length === 0;
  }, [
    marketplaceListingDescription,
    marketplaceListingTeaser,
    logoFile,
    featureImageFile,
    additionalDocuments,
    sponsors,
  ]);

  // Validate marketplace fields
  const validateMarketplaceFields = () => {
    const errors = {};
    let hasErrors = false;

    // Validate field (min: 1 character, max: configurable)
    const validateField = (
      fieldName,
      value,
      isRequired = true,
      minLimit = 1,
      maxLimit = 20
    ) => {
      const strValue = String(value || "");
      const length = strValue.trim().length;

      if (isRequired && length < minLimit) {
        return `${fieldName} is required (min ${minLimit} character${minLimit > 1 ? 's' : ''})`;
      }

      if (!isRequired && length === 0) {
        return ""; // Optional fields that are empty are valid
      }

      if (length > 0 && length < minLimit) {
        return `${fieldName} must be at least ${minLimit} character${minLimit > 1 ? 's' : ''}`;
      }

      if (length > maxLimit) {
        return `${fieldName} must be at most ${maxLimit} characters`;
      }

      return "";
    };

    // Validate Description (required, min 1, max 500)
    errors.description = validateField(
      "Description",
      marketplaceListingDescription,
      true,
      1,
      500
    );
    if (errors.description) hasErrors = true;

    // Validate Marketplace Teaser (required, min 1, max 220)
    errors.marketplaceTeaser = validateField(
      "Marketplace Teaser",
      marketplaceListingTeaser,
      true,
      1,
      220
    );
    if (errors.marketplaceTeaser) hasErrors = true;

    // Validate Global Audience Size (required, min 1, max 20)
    errors.globalAudienceSize = validateField(
      "Global Audience Size",
      globalAudienceSize,
      true,
      1,
      20
    );
    if (errors.globalAudienceSize) hasErrors = true;

    // Validate Social Media Presence (required, min 1, max 20)
    errors.socialMediaPresence = validateField(
      "Social Media Presence",
      socialMediaPresence,
      true,
      1,
      20
    );
    if (errors.socialMediaPresence) hasErrors = true;

    // Validate Occupancy Rate (required, min 1, max 20)
    errors.occupancyRate = validateField(
      "Occupancy Rate",
      occupancyRate,
      true,
      1,
      20
    );
    if (errors.occupancyRate) hasErrors = true;

    // Validate Annual Attendance (required, min 1, max 20)
    errors.annualAttendance = validateField(
      "Annual Attendance",
      annualAttendance,
      true,
      1,
      20
    );
    if (errors.annualAttendance) hasErrors = true;

    return { errors, hasErrors };
  };

  // Re-validate fields on change only after validation has been triggered once
  useEffect(() => {
    // Mark fields as modified if any field changes after successful submission
    if (marketplaceSubmittedSuccessfully) {
      setMarketplaceFieldsModified(true);
    }

    // Only validate if user has clicked submit at least once
    if (marketplaceValidationTriggered) {
      const errors = {};
      let hasErrors = false;

      // Inline validation function to avoid stale closure
      const validateField = (
        fieldName,
        value,
        isRequired = true,
        minLimit = 1,
        maxLimit = 20
      ) => {
        const strValue = String(value || "");
        const length = strValue.trim().length;

        if (isRequired && length < minLimit) {
          return `${fieldName} is required (min ${minLimit} character${minLimit > 1 ? 's' : ''})`;
        }

        if (!isRequired && length === 0) {
          return ""; // Optional fields that are empty are valid
        }

        if (length > 0 && length < minLimit) {
          return `${fieldName} must be at least ${minLimit} character${minLimit > 1 ? 's' : ''}`;
        }

        if (length > maxLimit) {
          return `${fieldName} must be at most ${maxLimit} characters`;
        }

        return "";
      };

      // Validate all fields
      errors.description = validateField("Description", marketplaceListingDescription, true, 1, 500);
      if (errors.description) hasErrors = true;

      errors.marketplaceTeaser = validateField("Marketplace Teaser", marketplaceListingTeaser, true, 1, 220);
      if (errors.marketplaceTeaser) hasErrors = true;

      errors.globalAudienceSize = validateField("Global Audience Size", globalAudienceSize, true, 1, 20);
      if (errors.globalAudienceSize) hasErrors = true;

      errors.socialMediaPresence = validateField("Social Media Presence", socialMediaPresence, true, 1, 20);
      if (errors.socialMediaPresence) hasErrors = true;

      errors.occupancyRate = validateField("Occupancy Rate", occupancyRate, true, 1, 20);
      if (errors.occupancyRate) hasErrors = true;

      errors.annualAttendance = validateField("Annual Attendance", annualAttendance, true, 1, 20);
      if (errors.annualAttendance) hasErrors = true;

      setMarketplaceValidationErrors(errors);
    }
  }, [
    marketplaceListingDescription,
    marketplaceListingTeaser,
    globalAudienceSize,
    socialMediaPresence,
    occupancyRate,
    annualAttendance,
    marketplaceValidationTriggered,
    marketplaceSubmittedSuccessfully,
  ]);

  // Re-validate sponsors on change only after validation has been triggered for each sponsor
  useEffect(() => {
    // Only validate sponsors that have been triggered
    if (sponsorValidationTriggered.size > 0) {
      const allErrors = {};
      
      sponsors.forEach((sponsor) => {
        // Only validate if this sponsor has been triggered
        if (sponsorValidationTriggered.has(sponsor.id)) {
          const sponsorErrors = validateSponsor(sponsor);
          Object.assign(allErrors, sponsorErrors);
        }
      });
      
      setSponsorValidationErrors(allErrors);
    }
  }, [sponsors, sponsorValidationTriggered]);

  // Show loader while fetching asset details
  // This early return MUST come after all hooks
  if (isLoadingAsset) {
    return (
      <div className="bg-white border rounded-tr-[24px] min-h-screen flex items-center justify-center">
        <TableLoader message="Loading asset details..." />
      </div>
    );
  }


  // Validate file
  const validateFile = (file, allowedTypes, maxSizeMB = 5) => {
    const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
    if (file.size > maxSize) {
      alert(
        `File size exceeds ${maxSizeMB} MB limit. Please choose a smaller file.`
      );
      return false;
    }
    if (!allowedTypes.includes(file.type)) {
      alert(
        `Invalid file type. Please upload ${allowedTypes.join(
          ", "
        )} files only.`
      );
      return false;
    }
    return true;
  };

  // Handle logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/png", "application/pdf"];
    if (!validateFile(file, allowedTypes)) {
      e.target.value = "";
      return;
    }

    if (!assetId) {
      showErrorToast("Asset ID is missing");
      e.target.value = "";
      return;
    }

    // Cleanup previous preview
    if (logoFile?.preview) {
      URL.revokeObjectURL(logoFile.preview);
    }

    const previewUrl = URL.createObjectURL(file);
    setLogoFile({ file, preview: previewUrl });

    // Upload to API
    setUploadingLogo(true);
    updateFeaturedImage(
      {
        assetTokenizationId: assetId,
        type: "logo",
        file,
      },
      {
        onSuccess: (response) => {
          setUploadingLogo(false);
          showSuccessToast("Logo uploaded successfully");
          // Optionally update the preview with the uploaded URL if provided
          if (response?.url) {
            setLogoFile({ file, preview: response.url, url: response.url });
          }
        },
        onError: (error) => {
          setUploadingLogo(false);
          showErrorToast(
            error?.response?.data?.message || "Failed to upload logo"
          );
          // Remove preview on error
          URL.revokeObjectURL(previewUrl);
          setLogoFile(null);
        },
      }
    );

    e.target.value = "";
  };

  // Handle feature image upload
  const handleFeatureImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validateFile(file, allowedTypes)) {
      e.target.value = "";
      return;
    }

    if (!assetId) {
      showErrorToast("Asset ID is missing");
      e.target.value = "";
      return;
    }

    // Cleanup previous preview
    if (featureImageFile?.preview) {
      URL.revokeObjectURL(featureImageFile.preview);
    }

    const previewUrl = URL.createObjectURL(file);
    setFeatureImageFile({ file, preview: previewUrl });

    // Upload to API
    setUploadingFeatureImage(true);
    updateFeaturedImage(
      {
        assetTokenizationId: assetId,
        type: "featured_image",
        file,
      },
      {
        onSuccess: (response) => {
          setUploadingFeatureImage(false);
          showSuccessToast("Feature image uploaded successfully");
          // Optionally update the preview with the uploaded URL if provided
          if (response?.url) {
            setFeatureImageFile({
              file,
              preview: response.url,
              url: response.url,
            });
          }
        },
        onError: (error) => {
          setUploadingFeatureImage(false);
          showErrorToast(
            error?.response?.data?.message || "Failed to upload feature image"
          );
          // Remove preview on error
          URL.revokeObjectURL(previewUrl);
          setFeatureImageFile(null);
        },
      }
    );

    e.target.value = "";
  };

  // Handle additional photos upload
  const handleAdditionalPhotosUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validateFile(file, allowedTypes)) {
      e.target.value = "";
      return;
    }

    if (!assetId) {
      showErrorToast("Asset ID is missing");
      e.target.value = "";
      return;
    }

    // Check if adding this file would exceed max of 9
    if (additionalPhotos.length >= 9) {
      showErrorToast(
        "Maximum 9 images allowed. Please remove some images first."
      );
      e.target.value = "";
      return;
    }

    // Create preview immediately
    const previewUrl = URL.createObjectURL(file);

    // Upload to API
    setUploadingPhoto(true);
    updateAssetFiles(
      {
        assetId: assetId,
        slug: "images",
        type: "multiple",
        file: file,
      },
      {
        onSuccess: (response) => {
          setUploadingPhoto(false);
          showSuccessToast("Photo uploaded successfully");

          // Add the response to additionalPhotos
          const newPhoto = {
            id: response.id || Date.now() + Math.random(),
            file: file,
            preview: response.url || previewUrl,
            url: response.url,
            file_name: response.file_name,
          };

          setAdditionalPhotos((prev) => [...prev, newPhoto]);
        },
        onError: (error) => {
          setUploadingPhoto(false);
          showErrorToast(
            error?.response?.data?.message || "Failed to upload photo"
          );
          // Cleanup preview on error
          URL.revokeObjectURL(previewUrl);
        },
      }
    );

    e.target.value = "";
  };

  // Handle remove additional photo
  const handleRemovePhoto = (id) => {
    setAdditionalPhotos((prev) => {
      const photoToRemove = prev.find((p) => p.id === id);
      if (photoToRemove?.preview) {
        URL.revokeObjectURL(photoToRemove.preview);
      }
      return prev.filter((p) => p.id !== id);
    });
  };

  // Handle logo button click
  const handleLogoClick = () => {
    if (logoRef.current) {
      logoRef.current.value = "";
      logoRef.current.click();
    }
  };

  // Handle feature image button click
  const handleFeatureImageClick = () => {
    if (featureImageRef.current) {
      featureImageRef.current.value = "";
      featureImageRef.current.click();
    }
  };

  // Handle additional photos button click
  const handleAdditionalPhotosClick = () => {
    if (additionalPhotosRef.current) {
      additionalPhotosRef.current.value = "";
      additionalPhotosRef.current.click();
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Handle additional documents upload
  const handleAdditionalDocumentsUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validateFile(file, allowedTypes, 10)) {
      e.target.value = "";
      return;
    }

    if (!assetId) {
      showErrorToast("Asset ID is missing");
      e.target.value = "";
      return;
    }

    // Check if adding this file would exceed max of 4
    if (additionalDocuments.length >= 4) {
      showErrorToast(
        "Maximum 4 documents allowed. Please remove some documents first."
      );
      e.target.value = "";
      return;
    }

    // Upload to API
    setUploadingDocument(true);
    updateAssetFiles(
      {
        assetId: assetId,
        slug: "documents",
        type: "multiple",
        file: file,
      },
      {
        onSuccess: (response) => {
          setUploadingDocument(false);
          showSuccessToast("Document uploaded successfully");

          // Format display name from file name
          const fileName = response.file_name || file.name;
          const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
          const displayName = nameWithoutExt
            .split(/[-_\s]+/)
            .map(
              (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join("-");

          // Add the response to additionalDocuments
          const newDocument = {
            id: response.id || Date.now() + Math.random(),
            file: file,
            displayName: displayName,
            fileName: response.file_name || file.name,
            size: file.size,
            url: response.url,
          };

          setAdditionalDocuments((prev) => [...prev, newDocument]);
        },
        onError: (error) => {
          setUploadingDocument(false);
          showErrorToast(
            error?.response?.data?.message || "Failed to upload document"
          );
        },
      }
    );

    e.target.value = "";
  };

  // Handle remove additional document
  const handleRemoveDocument = (id) => {
    setAdditionalDocuments((prev) => {
      const docToRemove = prev.find((d) => d.id === id);
      if (docToRemove?.preview) {
        URL.revokeObjectURL(docToRemove.preview);
      }
      return prev.filter((d) => d.id !== id);
    });
  };

  // Handle additional documents button click
  const handleAdditionalDocumentsClick = () => {
    if (additionalDocumentsRef.current) {
      additionalDocumentsRef.current.value = "";
      additionalDocumentsRef.current.click();
    }
  };

  // Handle add sponsor
  const handleAddSponsor = () => {
    const newSponsor = {
      id: Date.now() + Math.random(),
      logo: null,
      name: "",
      value: "",
      contract: "",
      url: "",
      urlError: null,
    };
    setSponsors((prev) => [...prev, newSponsor]);
  };

  // Handle remove sponsor
  const handleRemoveSponsor = (id) => {
    if (!assetId) {
      showErrorToast("Asset ID is missing");
      return;
    }

    const sponsorToRemove = sponsors.find((s) => s.id === id);
    if (!sponsorToRemove) {
      return;
    }

    // If sponsor has a UUID (from API), call delete API
    const sponsorIdStr = id?.toString() || "";
    const isApiSponsor =
      sponsorIdStr &&
      sponsorIdStr !== "default-sponsor-1" &&
      sponsorIdStr.includes("-");

    if (isApiSponsor) {
      // Call delete API
      setDeletingSponsorId(id);
      deleteSponsor(
        {
          assetTokenizationId: assetId,
          sponsorId: id,
        },
        {
          onSuccess: () => {
            setDeletingSponsorId(null);
            showSuccessToast("Sponsor deleted successfully");
            // Remove from state
            setSponsors((prev) => {
              const sponsorToRemove = prev.find((s) => s.id === id);
              if (
                sponsorToRemove?.logo?.preview &&
                !sponsorToRemove?.logo?.url
              ) {
                URL.revokeObjectURL(sponsorToRemove.logo.preview);
              }
              return prev.filter((s) => s.id !== id);
            });
          },
          onError: (error) => {
            setDeletingSponsorId(null);
            showErrorToast(
              error?.response?.data?.message || "Failed to delete sponsor"
            );
          },
        }
      );
    } else {
      // Just remove from local state (not saved to API yet)
      setSponsors((prev) => {
        const sponsorToRemove = prev.find((s) => s.id === id);
        if (sponsorToRemove?.logo?.preview) {
          URL.revokeObjectURL(sponsorToRemove.logo.preview);
        }
        return prev.filter((s) => s.id !== id);
      });
    }
  };

  // Handle sponsor logo upload
  const handleSponsorLogoUpload = (sponsorId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validateFile(file, allowedTypes)) {
      e.target.value = "";
      return;
    }

    // Create preview immediately
    const previewUrl = URL.createObjectURL(file);
    setSponsors((prev) => {
      return prev.map((sponsor) => {
        if (sponsor.id === sponsorId) {
          // Cleanup previous preview
          if (sponsor.logo?.preview && !sponsor.logo?.url) {
            URL.revokeObjectURL(sponsor.logo.preview);
          }
          return {
            ...sponsor,
            logo: { file, preview: previewUrl, url: null },
          };
        }
        return sponsor;
      });
    });

    // Upload file to API
    setUploadingLogoId(sponsorId);
    uploadFile(file, {
      onSuccess: (response) => {
        setUploadingLogoId(null);
        const uploadedUrl = response?.url || "";
        if (uploadedUrl) {
          setSponsors((prev) => {
            return prev.map((sponsor) => {
              if (sponsor.id === sponsorId) {
                return {
                  ...sponsor,
                  logo: {
                    file,
                    preview: previewUrl,
                    url: uploadedUrl,
                  },
                };
              }
              return sponsor;
            });
          });
          showSuccessToast("Logo uploaded successfully");
        } else {
          showErrorToast("Failed to get upload URL");
        }
      },
      onError: (error) => {
        setUploadingLogoId(null);
        showErrorToast(
          error?.response?.data?.message || "Failed to upload logo"
        );
        // Remove the preview on error
        URL.revokeObjectURL(previewUrl);
        setSponsors((prev) => {
          return prev.map((sponsor) => {
            if (sponsor.id === sponsorId) {
              return {
                ...sponsor,
                logo: null,
              };
            }
            return sponsor;
          });
        });
      },
    });

    e.target.value = "";
  };

  // Handle sponsor logo button click
  const handleSponsorLogoClick = (sponsorId) => {
    if (sponsorLogoRefs.current[sponsorId]) {
      sponsorLogoRefs.current[sponsorId].value = "";
      sponsorLogoRefs.current[sponsorId].click();
    }
  };

  // Handle sponsor field update
  const handleSponsorFieldUpdate = (sponsorId, field, value) => {
    // Mark this sponsor as modified if it has been saved before
    if (sponsorsSavedSuccessfully[sponsorId]) {
      setSponsorsFieldsModified((prev) => ({
        ...prev,
        [sponsorId]: true,
      }));
    }

    setSponsors((prev) => {
      return prev.map((sponsor) => {
        if (sponsor.id === sponsorId) {
          const updatedSponsor = { ...sponsor, [field]: value };

          // Validate URL if it's the url field
          if (field === "url") {
            if (value && value.trim() && !validateURL(value)) {
              updatedSponsor.urlError =
                "Please enter a valid URL (must start with http:// or https://)";
            } else {
              updatedSponsor.urlError = null;
            }
          }

          return updatedSponsor;
        }
        return sponsor;
      });
    });
  };

  // Handle save sponsor
  const handleSaveSponsor = (sponsor) => {
    if (!assetId) {
      showErrorToast("Asset ID is missing");
      return;
    }

    // Mark this sponsor's validation as triggered
    setSponsorValidationTriggered((prev) => new Set([...prev, sponsor.id]));

    // Check if logo is being uploaded
    if (uploadingLogoId === sponsor.id) {
      showErrorToast("Please wait for logo upload to complete");
      return;
    }

    // If logo file exists but no URL, upload it first
    if (sponsor.logo?.file && !sponsor.logo?.url) {
      showErrorToast("Please wait for logo to finish uploading");
      return;
    }

    // Validate sponsor fields
    const sponsorErrors = validateSponsor(sponsor);
    const prefix = `sponsor_${sponsor.id}_`;
    const hasErrors = Object.keys(sponsorErrors).some(
      (key) => key.startsWith(prefix) && sponsorErrors[key]
    );

    // Update validation errors for this sponsor
    setSponsorValidationErrors((prev) => ({
      ...prev,
      ...sponsorErrors,
    }));

    if (hasErrors) {
      // Errors are shown below each field, no need for toast
      return;
    }

    setSavingSponsorId(sponsor.id);

    // Prepare payload - use uploaded URL only, not preview
    const payload = {
      title: sponsor.name.trim(),
      value: sponsor.value || "",
      contract_year: sponsor.contract || "",
      website_url: sponsor.url || "",
      url: sponsor.logo?.url || "",
    };

    // If sponsor has an ID that looks like a UUID (not a timestamp-based ID), it's an update
    // UUIDs typically contain hyphens (e.g., "bc64ae76-55f3-4601-866b-cda1f7dc32c6")
    // Timestamp-based IDs from Date.now() + Math.random() are numeric with decimal point
    const sponsorIdStr = sponsor.id?.toString() || "";
    const isUpdate =
      sponsorIdStr &&
      sponsorIdStr !== "default-sponsor-1" &&
      sponsorIdStr.includes("-");

    if (isUpdate) {
      payload.id = sponsor.id;
    }

    createUpdateSponsor(
      {
        assetTokenizationId: assetId,
        payload,
      },
      {
        onSuccess: (response) => {
          setSavingSponsorId(null);

          // Get the sponsor ID (use response ID if it's a create operation)
          const savedSponsorId = !isUpdate && response?.id ? response.id : sponsor.id;

          // Mark this sponsor as saved successfully
          setSponsorsSavedSuccessfully((prev) => ({
            ...prev,
            [savedSponsorId]: true,
          }));

          // Reset modified flag for this sponsor
          setSponsorsFieldsModified((prev) => ({
            ...prev,
            [savedSponsorId]: false,
          }));

          showSuccessToast(
            isUpdate
              ? "Sponsor updated successfully"
              : "Sponsor created successfully"
          );

          // Update sponsor with the ID from response if it was a create
          if (!isUpdate && response?.id) {
            setSponsors((prev) => {
              return prev.map((s) => {
                if (s.id === sponsor.id) {
                  return { ...s, id: response.id };
                }
                return s;
              });
            });

            // Also update the saved flag with the new ID
            setSponsorsSavedSuccessfully((prev) => {
              const newState = { ...prev };
              // Remove old ID flag if it exists
              delete newState[sponsor.id];
              // Set new ID flag
              newState[response.id] = true;
              return newState;
            });

            // Clear modified flag for old ID
            setSponsorsFieldsModified((prev) => {
              const newState = { ...prev };
              delete newState[sponsor.id];
              newState[response.id] = false;
              return newState;
            });
          }
        },
        onError: (error) => {
          setSavingSponsorId(null);
          showErrorToast(
            error?.response?.data?.message ||
              (isUpdate
                ? "Failed to update sponsor"
                : "Failed to create sponsor")
          );
        },
      }
    );
  };

  // Calculate issuer treasury (total supply - sum of initial owners allocations)
  const totalInitialOwnerAllocations = initialOwners.reduce(
    (sum, owner) => sum + (Number(owner.token_allocation) || 0),
    0
  );
  const issuerTreasury =
    Number(asset.total_supply || 0) - totalInitialOwnerAllocations;

  // Calculate capital target (total supply * initial price)
  const capitalTarget =
    Number(asset.total_supply || 0) * Number(asset.initial_price || 0);

  // Transform asset for modals (matching registrar format)
  const transformedAsset = {
    ...asset,
    name: asset.name || "N/A",
    totalSupply: asset.total_supply,
    totalShares: asset.total_supply,
    tokenPrice: asset.initial_price ? String(asset.initial_price) : "100",
    sharePrice: asset.initial_price ? `$${asset.initial_price}` : "$100",
    category: assetType?.title || "N/A",
    issuer: "TechCorp Inc.", // You may want to get this from user profile or asset data
    totalOffering: capitalTarget,
  };

  // Handle submit marketplace listing
  const handleSubmitMarketplaceListing = () => {
    if (!assetId) {
      showErrorToast("Asset ID is missing");
      return;
    }

    // Mark validation as triggered so errors will show
    setMarketplaceValidationTriggered(true);

    // Validate fields before submitting
    const { errors, hasErrors } = validateMarketplaceFields();
    setMarketplaceValidationErrors(errors);

    if (hasErrors) {
      // Errors are shown below each field, no need for toast
      return;
    }

    setIsSubmittingMarketplace(true);

    const payload = {
      marketplace_description: marketplaceListingDescription || "",
      marketplace_teaser: marketplaceListingTeaser || "",
      global_audience_size: globalAudienceSize || "",
      special_media_presence: socialMediaPresence || "",
      stadium_occupancy_rate: occupancyRate || "",
      stadium_annual_attendence: annualAttendance || "",
    };

    updateMarketplace(
      {
        assetTokenizationId: assetId,
        payload,
      },
      {
        onSuccess: () => {
          setIsSubmittingMarketplace(false);
          setMarketplaceSubmittedSuccessfully(true);
          setMarketplaceFieldsModified(false);
          showSuccessToast("Marketplace listing updated successfully");
          // Don't clear fields - keep the values as requested
        },
        onError: (error) => {
          setIsSubmittingMarketplace(false);
          showErrorToast(
            error?.response?.data?.message ||
              "Failed to update marketplace listing"
          );
        },
      }
    );
  };

  // Handler functions for publish to market flow
  const handlePublishToMarketplace = () => {
    const missingFields = validatePublishFields();

    if (missingFields.length > 0) {
      const fieldsList = missingFields.join(", ");
      showErrorToast(
        `Please fill in the following required fields before publishing: ${fieldsList}`
      );
      return;
    }

    setIsPublishModalOpen(true);
  };

  const handlePublishConfirm = () => {
    if (!assetId) {
      showErrorToast("Asset ID is missing");
      return;
    }

    // Reset API completion state
    setIsPublishApiComplete(false);
    setPublishResponseData(null);

    // Close publish modal and open loader
    setIsPublishModalOpen(false);
    setIsPublishLoaderOpen(true);

    // Call the publish API
    publishToMarketplace(assetId, {
      onSuccess: (response) => {
        // Store response data for success modal
        setPublishResponseData(response?.data || response);
        setIsPublishApiComplete(true);
      },
      onError: (error) => {
        // Close loader on error
        setIsPublishLoaderOpen(false);
        setIsPublishApiComplete(false);
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to publish asset to marketplace. Please try again.";
        showErrorToast(errorMessage);
      },
    });
  };

  const handlePublishLoaderComplete = () => {
    setLoaderAnimationComplete(true);
  };

  const handlePublishSuccessClose = () => {
    // Close success modal and reset all modals
    setIsPublishSuccessOpen(false);
    setIsPublishModalOpen(false);
    setIsPublishLoaderOpen(false);
    setPublishResponseData(null);
    setIsPublishApiComplete(false);
    setLoaderAnimationComplete(false);
  };

  const handlePublishCancel = () => {
    setIsPublishModalOpen(false);
  };

  return (
    <div className="bg-white border rounded-tr-[24px] min-h-screen">
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
          {/* Left Column - Asset Details */}

          <div className="lg:col-span-2 space-y-6 p-4 sm:p-6">
            <div className="my-4">
              <div className="text-start pl-5 !pb-0 !py-0 text-[32px] font-normal font-['Atacama'] leading-[120%] tracking-[0.48px] text-[#000] rounded-tr-[24px]">
                {asset.name || "Not Provided"}
              </div>
              <span className="text-start !text-[#48484A] font-normal !text-sm !py-0 pl-5">
                {asset.asset_type_id || "Not Provided"}
              </span>
            </div>
            {/* First section - Asset Tokenization Details */}
            <AssetTokenizationDetails
              asset={asset}
              businessDetail={businessDetail}
              assetType={assetType}
              initialOwners={initialOwners}
              assetFiles={assetFiles}
              issuerTreasury={issuerTreasury}
              capitalTarget={capitalTarget}
              isExpanded={isTokenizationExpanded}
              onToggle={() =>
                setIsTokenizationExpanded(!isTokenizationExpanded)
              }
            />

            {/* Second section - Marketplace Listing */}
            <MarketplaceListing
              assetId={assetId}
              marketplaceListingDescription={marketplaceListingDescription}
              setMarketplaceListingDescription={
                setMarketplaceListingDescription
              }
              marketplaceListingTeaser={marketplaceListingTeaser}
              setMarketplaceListingTeaser={setMarketplaceListingTeaser}
              globalAudienceSize={globalAudienceSize}
              setGlobalAudienceSize={setGlobalAudienceSize}
              socialMediaPresence={socialMediaPresence}
              setSocialMediaPresence={setSocialMediaPresence}
              occupancyRate={occupancyRate}
              setOccupancyRate={setOccupancyRate}
              annualAttendance={annualAttendance}
              setAnnualAttendance={setAnnualAttendance}
              marketplaceValidationErrors={marketplaceValidationErrors}
              sponsorValidationErrors={sponsorValidationErrors}
              handleSubmitMarketplaceListing={handleSubmitMarketplaceListing}
              isSubmittingMarketplace={isSubmittingMarketplace}
              marketplaceSubmittedSuccessfully={marketplaceSubmittedSuccessfully}
              marketplaceFieldsModified={marketplaceFieldsModified}
              logoRef={logoRef}
              featureImageRef={featureImageRef}
              additionalPhotosRef={additionalPhotosRef}
              additionalDocumentsRef={additionalDocumentsRef}
              logoFile={logoFile}
              setLogoFile={setLogoFile}
              featureImageFile={featureImageFile}
              setFeatureImageFile={setFeatureImageFile}
              additionalPhotos={additionalPhotos}
              setAdditionalPhotos={setAdditionalPhotos}
              additionalDocuments={additionalDocuments}
              setAdditionalDocuments={setAdditionalDocuments}
              uploadingLogo={uploadingLogo}
              setUploadingLogo={setUploadingLogo}
              uploadingFeatureImage={uploadingFeatureImage}
              setUploadingFeatureImage={setUploadingFeatureImage}
              uploadingPhoto={uploadingPhoto}
              setUploadingPhoto={setUploadingPhoto}
              uploadingDocument={uploadingDocument}
              setUploadingDocument={setUploadingDocument}
              handleLogoUpload={handleLogoUpload}
              handleFeatureImageUpload={handleFeatureImageUpload}
              handleAdditionalPhotosUpload={handleAdditionalPhotosUpload}
              handleAdditionalDocumentsUpload={handleAdditionalDocumentsUpload}
              handleRemovePhoto={handleRemovePhoto}
              handleRemoveDocument={handleRemoveDocument}
              handleLogoClick={handleLogoClick}
              handleFeatureImageClick={handleFeatureImageClick}
              handleAdditionalPhotosClick={handleAdditionalPhotosClick}
              handleAdditionalDocumentsClick={handleAdditionalDocumentsClick}
              sponsors={sponsors}
              setSponsors={setSponsors}
              sponsorLogoRefs={sponsorLogoRefs}
              savingSponsorId={savingSponsorId}
              setSavingSponsorId={setSavingSponsorId}
              sponsorsSavedSuccessfully={sponsorsSavedSuccessfully}
              sponsorsFieldsModified={sponsorsFieldsModified}
              uploadingLogoId={uploadingLogoId}
              setUploadingLogoId={setUploadingLogoId}
              deletingSponsorId={deletingSponsorId}
              handleAddSponsor={handleAddSponsor}
              handleRemoveSponsor={handleRemoveSponsor}
              handleSponsorLogoUpload={handleSponsorLogoUpload}
              handleSponsorLogoClick={handleSponsorLogoClick}
              handleSponsorFieldUpdate={handleSponsorFieldUpdate}
              handleSaveSponsor={handleSaveSponsor}
              formatFileSize={formatFileSize}
              showErrorToast={showErrorToast}
              showSuccessToast={showSuccessToast}
              validateFile={validateFile}
              validateURL={validateURL}
              validateSponsorField={validateSponsorField}
              handlePublishToMarketplace={handlePublishToMarketplace}
              canPublishToMarketplace={canPublishToMarketplace}
              isMarketplaceExpanded={isMarketplaceExpanded}
              setIsMarketplaceExpanded={setIsMarketplaceExpanded}
            />
          </div>

          {/* Right Column - Action Required, Submission, Blockchain, Timeline */}
          <RightSidebar
            asset={asset}
            canPublishToMarketplace={canPublishToMarketplace}
            onPublishClick={handlePublishToMarketplace}
          />
        </div>
      </div>

      {/* Publish to Market Modal */}
      <PublishToMarketModal
        isOpen={
          isPublishModalOpen && !isPublishLoaderOpen && !isPublishSuccessOpen
        }
        onClose={handlePublishSuccessClose}
        onConfirm={handlePublishConfirm}
        onCancel={handlePublishCancel}
        asset={transformedAsset}
      />

      {/* Publish to Market Loader */}
      <PublishToMarketLoader
        isOpen={isPublishLoaderOpen}
        onClose={handlePublishSuccessClose}
        onComplete={handlePublishLoaderComplete}
      />

      {/* Publish to Market Success Modal */}
      <PublishToMarketSuccessModal
        isOpen={isPublishSuccessOpen}
        onClose={handlePublishSuccessClose}
        asset={transformedAsset}
        transactionData={publishResponseData}
      />
    </div>
  );
}

export default IssuerAssetsMintedDetailsPage;
