import { Logo } from "@/assets";
import LoginFooterComponent from "../layout/LoginFooter";
import { Button, Card, Dropdown, InputField } from "@/components/shared";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import DatePicker from "@/components/shared/DatePicker";
import driverIcon from "@/assets/kyc-assets/driverIcon.svg";
import driverLicenseBack from "@/assets/kyc-assets/driverLicenseBack.svg";
import cameraIcon from "@/assets/kyc-assets/cameraIcon.svg";
import { FaArrowUpFromBracket, FaPlus, FaCheck } from "react-icons/fa6";
import { LuMoveLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useGetCountries } from "@/api/assets/useGetCountries";
import CountrySelector from "../Issuer/issuer-assets/create/fields/CountrySelector";
import { useUploadKYCFile } from "@/api/kyc/useUploadKYCFile";
import useToast from "@/hooks/useCustomToast";
import { useProfile } from "@/api/auth/useProfile";
import SubmitKYCModal from "./SubmitKYCModal";
import {
  VERIFICATION_TYPE,
  DOCUMENTS_OPTIONS,
  FILE_CONSTANTS,
  DOCUMENT_LABELS,
  ACCREDITATION_OPTIONS,
  ACCREDITATION_TYPE_OPTIONS,
} from "@/constants/kyc";
import TextField from "@/components/shared/TextField";

// Utility functions
const formatFileSize = (bytes) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatFileName = (fileName) => {
  const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
  return nameWithoutExt
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("-");
};

const extractErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "An error occurred. Please try again."
  );
};

const validateFile = (file, allowedTypes, maxSize, showErrorToast) => {
  if (file.size > maxSize) {
    showErrorToast(
      `File size exceeds ${
        maxSize / (1024 * 1024)
      } MB limit. Please choose a smaller file.`
    );
    return false;
  }
  if (!allowedTypes.includes(file.type)) {
    showErrorToast("Invalid file type. Please upload a valid file format.");
    return false;
  }
  return true;
};

// Validation schema
const createValidationSchema = () => ({
  basicInfo: {
    first_name: (value) => (!value?.trim() ? "First Name is required" : null),
    last_name: (value) => (!value?.trim() ? "Last Name is required" : null),
    date_of_birth: (value) => (!value ? "Date of Birth is required" : null),
    nationality: (value) => (!value ? "Nationality is required" : null),
    phone_number: (value) =>
      !value?.trim() ? "Phone Number is required" : null,
  },
  address: {
    country: (value) => (!value ? "Country is required" : null),
    address_line_1: (value) =>
      !value?.trim() ? "Address Line 1 is required" : null,
    postal_code: (value) => (!value?.trim() ? "Postal Code is required" : null),
    city: (value) => (!value?.trim() ? "City is required" : null),
    state_province: (value) =>
      !value ? "State/Province/Region is required" : null,
  },
  identity: {
    id_number: (value) => (!value?.trim() ? "ID Number is required" : null),
    expiration_date: (value) => (!value ? "Expiration Date is required" : null),
  },
  accreditation: {
    accredited_investor_status: (value) =>
      !value ? "Accredited Investor Status is required" : null,
    accreditation_type: (value, formData) => {
      if (formData.accredited_investor_status === "yes" && !value) {
        return "Accreditation Type is required";
      }
      return null;
    },
  },
  tax: {
    tax_id: (value) =>
      !value?.trim() ? "Tax ID (SSN / TIN) is required" : null,
  },
});

const KYCComponent = () => {
  const [activeDocumentFilter, setActiveDocumentFilter] = useState(
    DOCUMENTS_OPTIONS[0].id
  );
  const navigate = useNavigate();
  const { showBottomRightToast: showSuccessToast, showErrorToast } = useToast();

  // Fetch countries
  const { data: countriesData } = useGetCountries();

  // Fetch user profile for email
  const { data: profileData } = useProfile();
  const userEmail = profileData?.user?.email || "";

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // API hooks
  const uploadKYCFileMutation = useUploadKYCFile();

  // File input refs
  const frontDocumentRef = useRef(null);
  const backDocumentRef = useRef(null);
  const selfieRef = useRef(null);
  const supportingDocsRef = useRef(null);

  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState({
    front: null,
    back: null,
    selfie: null,
  });

  // File URLs state (after API upload)
  const [fileUrls, setFileUrls] = useState({
    front_url: "",
    back_url: "",
    selfie_url: "",
  });

  // Supporting documents state
  const [supportingDocuments, setSupportingDocuments] = useState([]);

  // Loading states
  const [uploadingFiles, setUploadingFiles] = useState({
    front: false,
    back: false,
    selfie: false,
  });

  // Checkbox state
  const [isAgreed, setIsAgreed] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    nationality: "",
    phone_number: "",
    country: "",
    address_line_1: "",
    address_line_2: "",
    postal_code: "",
    city: "",
    state_province: "",
    id_number: "",
    expiration_date: "",
    accredited_investor_status: "",
    accreditation_type: "",
    tax_id: "",
  });

  // Memoized document labels
  const documentLabels = useMemo(
    () =>
      DOCUMENT_LABELS[activeDocumentFilter] || DOCUMENT_LABELS.driver_license,
    [activeDocumentFilter]
  );

  // Memoized verification type
  const verificationType = useMemo(() => {
    const typeMap = {
      driver_license: VERIFICATION_TYPE.DRIVERLICENSE,
      passport: VERIFICATION_TYPE.PASSPORT,
      national_id: VERIFICATION_TYPE.NATIONALID,
    };
    return typeMap[activeDocumentFilter] || VERIFICATION_TYPE.DRIVERLICENSE;
  }, [activeDocumentFilter]);

  // Memoized validation schema
  const validationSchema = useMemo(() => createValidationSchema(), []);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(uploadedFiles).forEach((fileData) => {
        if (fileData?.preview) {
          URL.revokeObjectURL(fileData.preview);
        }
      });
    };
  }, [uploadedFiles]);

  // File type to URL field mapping
  const FILE_TYPE_TO_URL_FIELD = {
    front: "front_url",
    back: "back_url",
    selfie: "selfie_url",
  };

  // Handle file upload with optimized validation
  const handleFileUpload = useCallback(
    async (type, e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file
      const isValid = validateFile(
        file,
        FILE_CONSTANTS.VALID_DOCUMENT_TYPES,
        FILE_CONSTANTS.MAX_SIZE,
        showErrorToast
      );
      if (!isValid) {
        e.target.value = "";
        return;
      }

      // Cleanup previous preview URL
      setUploadedFiles((prev) => {
        if (prev[type]?.preview) {
          URL.revokeObjectURL(prev[type].preview);
        }
        return prev;
      });

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setUploadedFiles((prev) => ({
        ...prev,
        [type]: { file, preview: previewUrl },
      }));

      // Upload file to API
      setUploadingFiles((prev) => ({ ...prev, [type]: true }));
      try {
        const response = await uploadKYCFileMutation.mutateAsync(file);
        const fileUrl = response?.url || "";

        if (!fileUrl) {
          throw new Error("No URL returned from upload");
        }

        const urlFieldName = FILE_TYPE_TO_URL_FIELD[type];
        setFileUrls((prev) => ({
          ...prev,
          [urlFieldName]: fileUrl,
        }));

        const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
        showSuccessToast(`${typeLabel} uploaded successfully`);
      } catch (error) {
        showErrorToast(
          `Failed to upload ${type}. ${extractErrorMessage(error)}`
        );
        setUploadedFiles((prev) => {
          const updated = { ...prev };
          delete updated[type];
          return updated;
        });
      } finally {
        setUploadingFiles((prev) => ({ ...prev, [type]: false }));
      }
    },
    [showErrorToast, showSuccessToast, uploadKYCFileMutation]
  );

  // Generic file input trigger
  const triggerFileInput = useCallback((ref) => {
    if (ref?.current) {
      ref.current.value = "";
      ref.current.click();
    }
  }, []);

  // Memoized file input handlers
  const handleSelfieClick = useCallback(
    () => triggerFileInput(selfieRef),
    [triggerFileInput]
  );
  const handleFrontClick = useCallback(
    () => triggerFileInput(frontDocumentRef),
    [triggerFileInput]
  );
  const handleBackClick = useCallback(
    () => triggerFileInput(backDocumentRef),
    [triggerFileInput]
  );
  const handleSupportingDocsClick = useCallback(
    () => triggerFileInput(supportingDocsRef),
    [triggerFileInput]
  );

  // Handle input changes
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Handle dropdown changes
  const handleDropdownChange = useCallback((field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Reset accreditation type when status changes
      if (field === "accredited_investor_status" && value !== "yes") {
        updated.accreditation_type = "";
      }
      return updated;
    });
  }, []);

  // Handle supporting documents upload
  const handleSupportingDocsUpload = useCallback(
    async (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      // Validate and filter files
      const validFiles = files.filter((file) =>
        validateFile(
          file,
          FILE_CONSTANTS.VALID_SUPPORTING_DOC_TYPES,
          FILE_CONSTANTS.MAX_SIZE,
          showErrorToast
        )
      );

      if (validFiles.length === 0) {
        e.target.value = "";
        return;
      }

      // Upload each file
      const uploadPromises = validFiles.map(async (file) => {
        const tempId = Date.now() + Math.random();
        const fileName = file.name;
        const displayName = formatFileName(fileName);

        // Add to state with uploading status
        const newDoc = {
          id: tempId,
          file,
          displayName,
          fileName,
          size: file.size,
          url: "",
          isUploading: true,
        };

        setSupportingDocuments((prev) => [...prev, newDoc]);

        try {
          const response = await uploadKYCFileMutation.mutateAsync(file);
          const fileUrl = response?.url || "";

          if (!fileUrl) {
            throw new Error("No URL returned from upload");
          }

          setSupportingDocuments((prev) =>
            prev.map((doc) =>
              doc.id === tempId
                ? {
                    ...doc,
                    url: fileUrl,
                    isUploading: false,
                  }
                : doc
            )
          );
          showSuccessToast(`${displayName} uploaded successfully`);
        } catch (error) {
          showErrorToast(
            `Failed to upload ${displayName}: ${extractErrorMessage(error)}`
          );
          setSupportingDocuments((prev) =>
            prev.filter((doc) => doc.id !== tempId)
          );
        }
      });

      await Promise.all(uploadPromises);
      e.target.value = "";
    },
    [showErrorToast, showSuccessToast, uploadKYCFileMutation]
  );

  // Handle remove supporting document
  const handleRemoveSupportingDoc = useCallback((id) => {
    setSupportingDocuments((prev) => prev.filter((d) => d.id !== id));
  }, []);

  // Optimized validation function
  const validateForm = useCallback(() => {
    const errors = [];

    // Validate using schema
    Object.entries(validationSchema.basicInfo).forEach(([field, validator]) => {
      const error = validator(formData[field]);
      if (error) errors.push(error);
    });

    Object.entries(validationSchema.address).forEach(([field, validator]) => {
      const error = validator(formData[field]);
      if (error) errors.push(error);
    });

    Object.entries(validationSchema.identity).forEach(([field, validator]) => {
      const error = validator(formData[field]);
      if (error) errors.push(error);
    });

    Object.entries(validationSchema.accreditation).forEach(
      ([field, validator]) => {
        const error = validator(formData[field], formData);
        if (error) errors.push(error);
      }
    );

    Object.entries(validationSchema.tax).forEach(([field, validator]) => {
      const error = validator(formData[field]);
      if (error) errors.push(error);
    });

    // File validations
    if (!uploadedFiles.front?.file) errors.push("Front document is required");
    if (!uploadedFiles.back?.file) errors.push("Back document is required");
    if (!uploadedFiles.selfie?.file) errors.push("Selfie is required");
    if (!fileUrls.front_url) errors.push("Front document must be uploaded");
    if (!fileUrls.back_url) errors.push("Back document must be uploaded");
    if (!fileUrls.selfie_url) errors.push("Selfie must be uploaded");

    // Agreement
    if (!isAgreed) {
      errors.push("You must agree to the terms and conditions");
    }

    return errors;
  }, [formData, validationSchema, uploadedFiles, fileUrls, isAgreed]);

  // Handle form submission - opens modal instead of submitting directly
  const handleSubmit = useCallback(() => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      showErrorToast(validationErrors[0]);
      return;
    }

    // Open the modal for review
    setIsModalOpen(true);
  }, [validateForm, showErrorToast]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Handle document type change
  const handleDocumentTypeChange = useCallback(
    (documentType) => {
      // Cleanup preview URLs
      if (uploadedFiles.front?.preview) {
        URL.revokeObjectURL(uploadedFiles.front.preview);
      }
      if (uploadedFiles.back?.preview) {
        URL.revokeObjectURL(uploadedFiles.back.preview);
      }
      setActiveDocumentFilter(documentType);
      setUploadedFiles({
        front: null,
        back: null,
        selfie: uploadedFiles.selfie,
      });
      setFileUrls({
        front_url: "",
        back_url: "",
        selfie_url: fileUrls.selfie_url,
      });
    },
    [uploadedFiles, fileUrls]
  );

  return (
    <main className="flex min-h-screen flex-col bg-[#f4f5fa] !w-full !p-0">
      <header className="relative h-40 sm:h-48 md:h-60 w-full bg-gradient-to-b from-black via-[#16003a] to-[#5c00c7]">
        <div className="flex mt-8 sm:mt-12 items-center justify-center">
          <Logo className="!h-12 w-auto text-white sm:h-8" />
        </div>
      </header>

      <section className="relative z-10 flex flex-1 justify-center px-4 sm:px-6">
        <div className="-mt-16 sm:-mt-20 md:-mt-24 w-full max-w-4xl py-4">
          <Card className="w-full rounded-[20px] border-none bg-white px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[200px] py-6 sm:py-[24px]">
            <div className=" !-ms-[10px] sm:!-ms-[20px] md:!-ms-[30px]  lg:!-ms-20 xl:!-ms-44 ">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  navigate(-1);
                }}
                icon={<LuMoveLeft />}
                iconPosition="left"
                className="text-black text-[10px] font-semibold "
              >
                Back to Account Settings
              </Button>
            </div>
            <div className="mb-4 sm:mb-6 py-4 sm:py-6 md:py-6 text-center">
              <h2
                className="text-center font-['Atacama_Trial_VAR'] text-[32px] font-medium 
            text-[var(--Dark-Black,#000)] "
              >
                Verify Your Account
              </h2>
              <p className="text-center  text-[15px] font-normal  text-[var(--Dark-Black,#000)]">
                Complete your identity verification to access all platform
                features.
              </p>

              <div className="flex flex-col items-start mt-[15px] md:mt-[48px] gap-[18px] p-[18px_18px_24px] rounded-[12px] border border-[var(--light-gray-5,#E5E5EA)] bg-[var(--light-gray-7,#FAFAFC)]">
                <p className="text-[15px] font-medium  text-[var(--Dark-Black,#000)]">
                  {" "}
                  Asset Details
                </p>
                <div className="flex flex-col items-start self-stretch justify-center gap-[10px] pt-[12px] border-t border-t-[var(--light-gray-4,#D1D1D6)]">
                  <div className="flex justify-between w-full">
                    <p className="text-[11px] font-medium text-[var(--Dark-Black,#000)]">
                      Email Address
                    </p>
                    <p className="text-[15px] font-normal  text-[var(--Dark-Black,#000)]">
                      investor@example.com
                    </p>
                  </div>

                  <div className="flex justify-between w-full">
                    <p className="text-[11px] font-medium text-[var(--Dark-Black,#000)]">
                      Account Type
                    </p>
                    <p className="text-[15px] font-normal  text-[var(--Dark-Black,#000)]">
                      Investor (Basic)
                    </p>
                  </div>
                  <div className="flex justify-between w-full">
                    <p className="text-[11px] font-medium text-[var(--Dark-Black,#000)]">
                      Date Joined
                    </p>
                    <p className="text-[15px] font-normal  text-[var(--Dark-Black,#000)]">
                      November 15, 2024
                    </p>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="flex flex-col items-start  gap-[5px] bg-[var(--Light-White,#FFF)] mt-[24px]">
                <p className="text-[15px] font-medium  text-[var(--Dark-Black,#000)] py-[18px]">
                  Basic Information
                </p>
                <div className="w-full">
                  <InputField
                    label="First Name"
                    hideLabel
                    name="first_name"
                    type="text"
                    autoComplete="first_name"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="w-full mt-[18px]">
                  <InputField
                    label="Last Name"
                    hideLabel
                    name="last_name"
                    type="text"
                    autoComplete="last_name"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="w-full mt-[18px]">
                  <DatePicker
                    label="Date of Birth"
                    value={formData.date_of_birth}
                    onChange={(value) =>
                      handleDropdownChange("date_of_birth", value)
                    }
                    required={true}
                    hideLabel={true}
                    placeholder="Date of Birth"
                    className="!w-full"
                  />
                </div>
                <div className="w-full mt-[18px]">
                  <CountrySelector
                    value={formData.nationality || ""}
                    onChange={(e) =>
                      handleDropdownChange("nationality", e.target.value)
                    }
                    label="Nationality"
                    countries={countriesData}
                    required
                  />
                </div>
                <div className="w-full mt-[18px]">
                  <InputField
                    label="Phone Number"
                    hideLabel
                    name="phone_number"
                    type="text"
                    autoComplete="phone_number"
                    placeholder="Phone Number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              {/* Residential Address */}

              <div className="flex flex-col items-start  gap-[5px] bg-[var(--Light-White,#FFF)] mt-[24px]">
                <p className="text-[15px] font-medium  text-[var(--Dark-Black,#000)] py-[18px]">
                  Residential Address
                </p>
                <div className="w-full">
                  <CountrySelector
                    value={formData.country || ""}
                    onChange={(e) =>
                      handleDropdownChange("country", e.target.value)
                    }
                    label="Country"
                    countries={countriesData}
                    required
                  />
                </div>
                <div className="w-full mt-[18px]">
                  <InputField
                    label="Address Line 1"
                    hideLabel
                    name="address_line_1"
                    type="text"
                    autoComplete="address_line_1"
                    placeholder="Enter Address Line 1"
                    value={formData.address_line_1}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="w-full mt-[18px]">
                  <InputField
                    label="Address Line 2"
                    hideLabel
                    name="address_line_2"
                    type="text"
                    autoComplete="address_line_2"
                    placeholder="Enter Address Line 2"
                    value={formData.address_line_2}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="w-full mt-[18px]">
                  <InputField
                    label="Postal Code"
                    hideLabel
                    name="postal_code"
                    type="text"
                    autoComplete="postal_code"
                    placeholder="Postal Code"
                    value={formData.postal_code}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="w-full mt-[18px]">
                  <InputField
                    label="City"
                    hideLabel
                    name="city"
                    type="text"
                    autoComplete="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="w-full mt-[18px]">
                  <CountrySelector
                    value={formData.state_province || ""}
                    onChange={(e) =>
                      handleDropdownChange("state_province", e.target.value)
                    }
                    label="State / Province / Region"
                    countries={countriesData}
                    required
                  />
                </div>
              </div>

              {/* identity verification */}
              <div className="flex flex-col items-start justify-normal  gap-[18px] py-[18px]">
                <p className="text-[#000]  text-[15px] font-medium">
                  Identity Verification
                </p>
                <p className="text-[#48484A] text-[13px] font-normal text-left">
                  Please ensure all photos are well-lit, in focus, and all text
                  is clearly legible. Avoid glare and shadows.
                </p>
              </div>

              {/* Select document type */}

              <div className="flex flex-col items-start gap-6 ">
                {/* Documents Tabs */}
                <div className="flex flex-col items-start gap-[10px]">
                  <p className="text-[#0A0A0A] font-montserrat text-[13px] font-medium ">
                    Select Document Type:
                  </p>
                  <div className="flex flex-wrap items-center gap-2 justify-center p-1 rounded-full border border-[var(--light-gray-5,#E5E5EA)] ">
                    {DOCUMENTS_OPTIONS.map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => handleDocumentTypeChange(filter.id)}
                        className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] transition ${
                          activeDocumentFilter === filter.id
                            ? "bg-gradient-to-tr from-[#0734A9] via-[#0E1696] to-[#4B0792] font-semibold text-white"
                            : "bg-white text-[#000] font-semibold hover:bg-slate-200"
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-start gap-[10px] w-full">
                  <div className="w-full">
                    <InputField
                      label="ID Number"
                      hideLabel
                      name="id_number"
                      type="text"
                      autoComplete="id_number"
                      placeholder="ID Number"
                      value={formData.id_number}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="w-full mt-[18px]">
                    <DatePicker
                      label="Expiration Date"
                      value={formData.expiration_date}
                      onChange={(value) =>
                        handleDropdownChange("expiration_date", value)
                      }
                      required={true}
                      hideLabel={true}
                      placeholder="Expiration Date"
                      className="!w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col items-start gap-6 self-stretch pt-6">
                  {/* Hidden file inputs - always in DOM */}
                  <input
                    ref={frontDocumentRef}
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => handleFileUpload("front", e)}
                    className="hidden"
                  />
                  <input
                    ref={backDocumentRef}
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => handleFileUpload("back", e)}
                    className="hidden"
                  />
                  <input
                    ref={selfieRef}
                    type="file"
                    accept="image/*"
                    capture="user"
                    onChange={(e) => handleFileUpload("selfie", e)}
                    className="hidden"
                  />

                  {/* Document Upload Section */}
                  <div className="flex justify-between items-start gap-6 w-full">
                    {/* Document Front */}
                    <div className="flex flex-col min-h-[336px] items-center justify-center gap-3 flex-1 rounded-[15px] p-4 bg-gradient-to-br from-[rgba(155,60,255,0.07)] to-[rgba(45,103,255,0.07)]">
                      {uploadedFiles.front?.preview ? (
                        <div className="flex flex-col items-center gap-3 w-full h-full">
                          <div className="relative w-full h-full flex items-center justify-center mb-2">
                            <img
                              src={uploadedFiles.front.preview}
                              alt="Front document preview"
                              className="max-h-[280px] max-w-full w-auto overflow-y-auto scrollbar-hide rounded-lg object-contain"
                            />
                          </div>
                          <button
                            onClick={handleFrontClick}
                            disabled={uploadingFiles.front}
                            className="flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] transition bg-gradient-to-tr from-[#0734A9] via-[#0E1696] to-[#4B0792] font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaArrowUpFromBracket />
                            {uploadingFiles.front
                              ? "Uploading..."
                              : "Replace Photo"}
                          </button>
                          <p className="text-[#000] text-center  text-[11px] font-normal ">
                            Recommended: vector or high-quality image. Accepted
                            formats: PDF, PNG. Max 5 MB
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col justify-center items-center gap-2.5 w-[50px] h-[50px] flex-shrink-0 rounded-full border border-white bg-white/50 ">
                            <img
                              src={driverIcon}
                              alt=""
                              width={"27px"}
                              height={"24px"}
                            />
                          </div>
                          <p className="text-[#000] text-[17px] font-semibold ">
                            {documentLabels.front}
                          </p>
                          <p className="text-[#000] text-center text-[13px] font-normal">
                            {documentLabels.frontDescription}
                          </p>
                          <button
                            onClick={handleFrontClick}
                            disabled={uploadingFiles.front}
                            className="flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] transition bg-gradient-to-tr from-[#0734A9] via-[#0E1696] to-[#4B0792] font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaArrowUpFromBracket />
                            {uploadingFiles.front
                              ? "Uploading..."
                              : "Upload photo"}
                          </button>
                          <p className="text-[#000] text-center  text-[11px] font-normal ">
                            Recommended: vector or high-quality image. Accepted
                            formats: PDF, PNG. Max 5 MB
                          </p>
                        </>
                      )}
                    </div>

                    {/* Document Back */}
                    <div className="flex flex-col min-h-[336px] items-center justify-center gap-3 flex-1 rounded-[15px] p-4 bg-gradient-to-br from-[rgba(155,60,255,0.07)] to-[rgba(45,103,255,0.07)]">
                      {uploadedFiles.back?.preview ? (
                        <div className="flex flex-col items-center gap-3 w-full h-full">
                          <div className="relative w-full h-full flex items-center justify-center mb-2">
                            <img
                              src={uploadedFiles.back.preview}
                              alt="Back document preview"
                              className="max-h-[280px] max-w-full w-auto rounded-lg object-contain"
                            />
                          </div>
                          <button
                            onClick={handleBackClick}
                            disabled={uploadingFiles.back}
                            className="flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] transition bg-gradient-to-tr from-[#0734A9] via-[#0E1696] to-[#4B0792] font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaArrowUpFromBracket />
                            {uploadingFiles.back
                              ? "Uploading..."
                              : "Replace Photo"}
                          </button>
                          <p className="text-[#000] text-center  text-[11px] font-normal pb-[18px]">
                            Recommended: high-quality image. Accepted formats:
                            JPG, PNG. Max 5 MB each.
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col justify-center items-center gap-2.5 w-[50px] h-[50px] flex-shrink-0 rounded-full border border-white bg-white/50 ">
                            <img
                              src={driverLicenseBack}
                              alt=""
                              width={"27px"}
                              height={"24px"}
                            />
                          </div>
                          <p className="text-[#000] text-[17px] font-semibold ">
                            {documentLabels.back}
                          </p>
                          <p className="text-[#000] text-center text-[13px] font-normal">
                            {documentLabels.backDescription}
                          </p>
                          <button
                            onClick={handleBackClick}
                            disabled={uploadingFiles.back}
                            className="flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] transition bg-gradient-to-tr from-[#0734A9] via-[#0E1696] to-[#4B0792] font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaArrowUpFromBracket />
                            {uploadingFiles.back
                              ? "Uploading..."
                              : "Upload photo"}
                          </button>
                          <p className="text-[#000] text-center  text-[11px] font-normal pb-[18px]">
                            Recommended: high-quality image. Accepted formats:
                            JPG, PNG. Max 5 MB each.
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Take a selfie */}
                  <div className="flex flex-row items-center justify-between gap-6 w-full rounded-[15px] p-4 bg-gradient-to-br from-[rgba(155,60,255,0.07)] to-[rgba(45,103,255,0.07)]">
                    {uploadedFiles.selfie?.preview ? (
                      <>
                        {/* Selfie Image on Left */}
                        <div className="flex-1 flex items-center justify-center">
                          <img
                            src={uploadedFiles.selfie.preview}
                            alt="Selfie preview"
                            className="max-h-[280px] max-w-full w-auto rounded-lg object-contain"
                          />
                        </div>
                        {/* Content on Right */}
                        <div className="flex-1 flex flex-col items-start justify-center gap-3">
                          <div className="flex flex-col justify-center items-center gap-2.5 w-[50px] h-[50px] flex-shrink-0 rounded-full border border-white bg-white/50">
                            <img
                              src={cameraIcon}
                              alt=""
                              width={"27px"}
                              height={"24px"}
                            />
                          </div>
                          <p className="text-[#000] text-[17px] font-semibold ">
                            Take a Selfie
                          </p>
                          <p className="text-[#000] text-left text-[13px] font-normal">
                            Take well-lit selfie against a light background.{" "}
                            <br />
                            Ensure your full face is visible with no hats or
                            sunglasses.
                          </p>
                          <button
                            onClick={handleSelfieClick}
                            disabled={uploadingFiles.selfie}
                            className="flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] transition bg-gradient-to-tr from-[#0734A9] via-[#0E1696] to-[#4B0792] font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaArrowUpFromBracket />
                            {uploadingFiles.selfie
                              ? "Uploading..."
                              : "Retake Selfie"}
                          </button>
                          <p className="text-[#000] text-left  text-[11px] font-normal">
                            Recommended: high-quality image. Accepted formats:
                            JPG, PNG. Max 5 MB each.
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-3 w-full">
                        <img
                          src={cameraIcon}
                          alt=""
                          width={"27px"}
                          height={"24px"}
                        />
                        <p className="text-[#000] text-[17px] font-semibold ">
                          Take a Selfie{" "}
                        </p>
                        <p className="text-[#000] text-center text-[13px] font-normal">
                          Take well-lit selfie against a light background.{" "}
                          <br /> Ensure your full face is visible with no hats
                          or sunglasses.
                        </p>
                        <button
                          onClick={handleSelfieClick}
                          disabled={uploadingFiles.selfie}
                          className="flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] transition bg-gradient-to-tr from-[#0734A9] via-[#0E1696] to-[#4B0792] font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FaArrowUpFromBracket />
                          {uploadingFiles.selfie
                            ? "Uploading..."
                            : "Upload Selfie Photo"}
                        </button>
                        <p className="text-[#000] text-center  text-[11px] font-normal pb-[18px]">
                          Recommended: high-quality image. Accepted formats:
                          JPG, PNG. Max 5 MB each.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Accreditation */}

                <div className="flex flex-col items-start gap-6 w-full">
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex flex-col items-start justify-center gap-2.5 py-[18px]">
                      <p className="text-[15px] font-medium text-[#000]">
                        Accreditation
                      </p>
                    </div>
                    <div className="w-full ">
                      <Dropdown
                        hideLabel
                        placeholder="Accredited Investor Status"
                        label="Accredited Investor Status"
                        options={ACCREDITATION_OPTIONS}
                        selectedValue={formData.accredited_investor_status}
                        onChange={(value) =>
                          handleDropdownChange(
                            "accredited_investor_status",
                            value
                          )
                        }
                        required
                      />
                    </div>
                    {formData.accredited_investor_status === "yes" && (
                      <div className="w-full mt-[18px]">
                        <Dropdown
                          hideLabel
                          placeholder="Accreditation Type"
                          label="Accreditation Type"
                          options={ACCREDITATION_TYPE_OPTIONS}
                          selectedValue={formData.accreditation_type}
                          onChange={(value) =>
                            handleDropdownChange("accreditation_type", value)
                          }
                          required
                        />
                      </div>
                    )}
                  </div>

                  {/* Supporting Documentation */}
                  <div className="flex flex-col gap-4 w-full">
                    <div className="flex justify-between items-start gap-6 w-full">
                      <div className="flex flex-col gap-[2px]">
                        <p className="text-[13px] font-semibold text-[var(--Dark-Black,#000)] text-start">
                          Supporting Documentation
                        </p>
                        <p className="text-[13px] font-normal text-[var(--Dark-Black,#000)] text-start">
                          Upload proof of accreditation (tax returns, financial
                          statements, license certificates, etc.)
                        </p>
                      </div>
                      {/* upload button */}
                      <input
                        ref={supportingDocsRef}
                        type="file"
                        accept=".pdf,.doc,.docx,image/*"
                        multiple
                        onChange={handleSupportingDocsUpload}
                        className="hidden"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<FaPlus />}
                        iconPosition="left"
                        onClick={handleSupportingDocsClick}
                        className="text-black text-[10px] font-semibold h-[40px] px-4"
                      >
                        Upload
                      </Button>
                    </div>

                    {/* Uploaded Files List */}
                    {supportingDocuments.length > 0 && (
                      <div className="flex flex-col gap-3 mt-2">
                        {supportingDocuments.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between gap-4 p-4 rounded-lg bg-[#FAFAFC] border border-[#E5E5EA]"
                          >
                            <div className="flex flex-col gap-2">
                              {/* Checkmark Icon */}
                              <div className="flex items-center gap-2 w-full">
                                <div className=" w-7 h-6 rounded-full bg-white flex items-center justify-center border border-[#E5E5EA]">
                                  {doc.isUploading ? (
                                    <div className="w-3 h-3 border-2 border-[#0734A9] border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <FaCheck className="w-3 h-3 text-green-500" />
                                  )}
                                </div>
                                <p className="text-[13px] font-semibold text-[#000] truncate w-full">
                                  {doc.displayName}
                                  {doc.isUploading && (
                                    <span className="text-[11px] text-[#48484A] ml-2">
                                      (Uploading...)
                                    </span>
                                  )}
                                </p>
                              </div>
                              <p className="text-[11px] font-normal w-full  text-[#48484A] truncate">
                                {doc.fileName}, {formatFileSize(doc.size)}
                              </p>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => handleRemoveSupportingDoc(doc.id)}
                              disabled={doc.isUploading}
                              className="flex-shrink-0 text-[13px] font-medium text-[#D70015] hover:text-[#D70015] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <p className="flex flex-col items-start justify-center gap-[10px] py-[18px] text-[15px] font-medium  text-[var(--Dark-Black,#000)]">
                      Tax Information
                    </p>
                    <div className="w-full">
                      <TextField
                        label="Tax ID (SSN / TIN)"
                        hideLabel
                        name="tax_id"
                        autoComplete="tax_id"
                        placeholder="Tax ID (SSN / TIN)"
                        value={formData.tax_id}
                        onChange={handleInputChange}
                        required
                        type="password"
                        showPasswordToggle="true"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 ">
                    <input
                      type="checkbox"
                      checked={isAgreed}
                      onChange={(e) => setIsAgreed(e.target.checked)}
                      className="flex flex-col items-center justify-center gap-2.5 w-5 h-5 p-2.5 rounded-[5px] border border-[#AEAEB2] bg-white"
                    />
                    <p className="text-[13px] font-normal  text-[var(--dark-gray-2,#636366)] text-start">
                      <span className="text-[13px] font-bold  text-[var(--Dark-Black,#000)]">
                        I confirm{" "}
                      </span>
                      that all information provided is accurate and complete. I
                      agree to the Terms of Use and Privacy Policy. I understand
                      that investing involves risk, including the potential loss
                      of principal, and that past performance does not guarantee
                      future results.
                    </p>
                  </div>

                  <div className="flex items-start gap-[18px]  w-full pt-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full h-[40px]"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="gradient"
                      size="sm"
                      className="w-full h-[40px]"
                      onClick={handleSubmit}
                      disabled={
                        uploadingFiles.front ||
                        uploadingFiles.back ||
                        uploadingFiles.selfie
                      }
                    >
                      Submit for Review
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <LoginFooterComponent />

      {/* Submit KYC Modal */}
      <SubmitKYCModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        fileUrls={fileUrls}
        verificationType={verificationType}
        supportingDocuments={supportingDocuments}
        userEmail={userEmail}
        countriesData={countriesData}
        activeDocumentFilter={activeDocumentFilter}
      />
    </main>
  );
};

export default KYCComponent;
