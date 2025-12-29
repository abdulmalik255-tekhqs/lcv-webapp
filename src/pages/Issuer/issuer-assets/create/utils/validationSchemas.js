/**
 * Yup validation schemas for asset creation form
 * Using Formik + Yup for form validation
 */
import * as Yup from "yup";

// Basic Information validation schema
export const basicInformationSchema = Yup.object({
  assetName: Yup.string()
    .min(1, "Asset Name must be at least 1 character")
    .max(30, "Asset Name must be at most 30 characters")
    .required("Asset Name is required"),
  description: Yup.string()
    .min(1, "Description must be at least 1 character")
    .max(500, "Description must be at most 500 characters")
    .required("Description is required"),
  assetType: Yup.string().required("Asset Type is required"),
});

// Business Details validation schema
export const businessDetailsSchema = Yup.object({
  industrySector: Yup.string().required("Industry/Sector is required"),
  country: Yup.string().required("Country is required"),
  city: Yup.string()
    .min(1, "City must be at least 1 character")
    .max(20, "City must be at most 20 characters")
    .required("City is required"),
  yearEstablished: Yup.string().required("Year Established is required"),
  numberOfEmployees: Yup.string().required("Number of Employees is required"),
  ownershipStake: Yup.string()
    .min(1, "Ownership Stake must be at least 1 character")
    .max(20, "Ownership Stake must be at most 20 characters")
    .required("Ownership Stake is required"),
  businessValuation: Yup.string()
    .min(1, "Business Valuation must be at least 1 character")
    .max(30, "Business Valuation must be at most 30 characters")
    .required("Business Valuation is required"),
  operationalStatus: Yup.string()
    .min(1, "Operational Status must be at least 1 character")
    .max(30, "Operational Status must be at most 30 characters")
    .required("Operational Status is required"),
  minimumInvestment: Yup.string()
    .min(1, "Minimum Investment must be at least 1 character")
    .max(20, "Minimum Investment must be at most 20 characters")
    .required("Minimum Investment is required"),
  expectedYield: Yup.string()
    .min(1, "Expected Yield must be at least 1 character")
    .max(20, "Expected Yield must be at most 20 characters")
    .required("Expected Yield is required"),
  minimumAnnualReturn: Yup.string()
    .min(1, "Minimum Annual Return must be at least 1 character")
    .max(20, "Minimum Annual Return must be at most 20 characters")
    .required("Minimum Annual Return is required"),
  expectedTerm: Yup.string()
    .min(1, "Expected Term must be at least 1 character")
    .max(20, "Expected Term must be at most 20 characters")
    .required("Expected Term is required"),
  targetCloseDate: Yup.string().required("Target Close Date is required"),
});

// Financial Information validation schema
export const financialInformationSchema = Yup.object({
  annualRevenue: Yup.string()
    .min(1, "Annual Revenue must be at least 1 character")
    .max(20, "Annual Revenue must be at most 20 characters")
    .required("Annual Revenue is required"),
  revenueCAGR: Yup.string()
    .min(1, "Revenue CAGR must be at least 1 character")
    .max(20, "Revenue CAGR must be at most 20 characters")
    .required("Revenue CAGR is required"),
  ebitda: Yup.string()
    .min(1, "EBITDA must be at least 1 character")
    .max(20, "EBITDA must be at most 20 characters")
    .required("EBITDA is required"),
  broadcastingRevenue: Yup.string()
    .min(1, "Broadcasting Revenue must be at least 1 character")
    .max(20, "Broadcasting Revenue must be at most 20 characters")
    .required("Broadcasting Revenue is required"),
  matchdayRevenue: Yup.string()
    .min(1, "Matchday Revenue must be at least 1 character")
    .max(20, "Matchday Revenue must be at most 20 characters")
    .required("Matchday Revenue is required"),
  commercialRevenue: Yup.string()
    .min(1, "Commercial Revenue must be at least 1 character")
    .max(20, "Commercial Revenue must be at most 20 characters")
    .required("Commercial Revenue is required"),
  playerAcquisitions: Yup.string()
    .min(1, "Player Acquisitions must be at least 1 character")
    .max(20, "Player Acquisitions must be at most 20 characters")
    .required("Player Acquisitions is required"),
  operatingExpenses: Yup.string()
    .min(1, "Operating Expenses must be at least 1 character")
    .max(20, "Operating Expenses must be at most 20 characters")
    .required("Operating Expenses is required"),
});

// Tokenization Details validation schema
export const tokenizationDetailsSchema = Yup.object({
  totalSupply: Yup.string()
    .min(1, "Total Supply must be at least 1 character")
    .max(30, "Total Supply must be at most 30 characters")
    .required("Total Supply is required"),
  initialMint: Yup.string()
    .min(1, "Initial Mint must be at least 1 character")
    .max(20, "Initial Mint must be at most 20 characters")
    .required("Initial Mint is required"),
  tokenPrice: Yup.string()
    .min(1, "Price per Token must be at least 1 character")
    .max(20, "Price per Token must be at most 20 characters")
    .required("Price per Token is required"),
  initialOwners: Yup.array().of(
    Yup.object({
      name: Yup.string()
        .min(1, "Owner Name must be at least 1 character")
        .max(100, "Owner Name must be at most 100 characters"),
      email: Yup.string().email("Owner Email must be a valid email address"),
      tokenAllocation: Yup.string()
        .min(1, "Token Allocation must be at least 1 character")
        .max(30, "Token Allocation must be at most 30 characters"),
    })
  ),
});

// Legal & Compliance validation schema
export const legalComplianceSchema = Yup.object({
  documents: Yup.array()
    .min(1, "At least one document is required")
    .required("At least one document is required"),
});
