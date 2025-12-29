// Constants
export const VERIFICATION_TYPE = {
    DRIVERLICENSE: "DriverLicense",
    PASSPORT: "Passport",
    NATIONALID: "NationalID",
  };

export const KYC_STATUS = {
  INREVIEW: 'In Review',
  REJECTED: 'Rejected',
  APPROVED: 'Approved'
};
  
  export const DOCUMENTS_OPTIONS = [
    { id: "driver_license", label: "Driver's License" },
    { id: "passport", label: "Passport" },
    { id: "national_id", label: "National ID" },
  ];
  
  export const FILE_CONSTANTS = {
    MAX_SIZE: 5 * 1024 * 1024, // 5 MB
    VALID_IMAGE_TYPES: ["image/jpeg", "image/jpg", "image/png"],
    VALID_DOCUMENT_TYPES: ["image/jpeg", "image/jpg", "image/png", "application/pdf"],
    VALID_SUPPORTING_DOC_TYPES: [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  };
  
  export const DOCUMENT_LABELS = {
    driver_license: {
      front: "Driver's License Front",
      back: "Driver's License Back",
      frontDescription: "Upload a photo the front side of your driver's license.",
      backDescription: "Upload a photo the back side of your driver's license.",
    },
    passport: {
      front: "Passport Front",
      back: "Passport Back",
      frontDescription: "Upload a photo the front page of your passport.",
      backDescription: "Upload a photo the back page of your passport.",
    },
    national_id: {
      front: "National ID Front",
      back: "National ID Back",
      frontDescription: "Upload a photo the front side of your national ID.",
      backDescription: "Upload a photo the back side of your national ID.",
    },
  };
  
  export const ACCREDITATION_OPTIONS = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];
  
  export const ACCREDITATION_TYPE_OPTIONS = [
    { value: "income", label: "Income ($200k+ individual, $300k+ joint)" },
    { value: "qualified_purchaser", label: "Qualified Purchaser ($25M+ in Investments)" },
    { value: "qib", label: "Qualified Institutional Buyer (QIB)" },
    { value: "accredited_entity", label: "Accredited Entity ($5M+ in assets)" },
    { value: "bank", label: "Bank or Similar Financial Institution" },
    { value: "broker_dealer", label: "Registered Broker-Dealer" },
    { value: "not_accredited", label: "Not Accredited" },
  ];