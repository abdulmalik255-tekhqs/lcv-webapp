import { useState } from "react";
import GenericModal from "@/components/shared/GenericModal";
import { Button } from "@/components/shared";
import { useSubmitKYC } from "@/api/kyc/useSubmitKYC";
import useToast from "@/hooks/useCustomToast";
import {
  DOCUMENTS_OPTIONS,
  ACCREDITATION_OPTIONS,
  ACCREDITATION_TYPE_OPTIONS,
} from "@/constants/kyc";
import { FaTriangleExclamation } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const SubmitKYCModal = ({
  isOpen,
  onClose,
  formData,
  fileUrls,
  verificationType,
  supportingDocuments,
  userEmail,
  countriesData,
  activeDocumentFilter,
}) => {
  const { showBottomRightToast: showSuccessToast, showErrorToast } = useToast();
  const submitKYCMutation = useSubmitKYC();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format date to "Month Day, Year" format
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${
      months[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;
  };

  // Mask SSN/Tax ID (show only last 4 digits)
  const maskTaxId = (taxId) => {
    if (!taxId) return "";
    if (taxId.length <= 4) return taxId;
    const last4 = taxId.slice(-4);
    return `XXX-XX-${last4}`;
  };

  // Get country name from code or name
  const getCountryName = (value) => {
    if (!value) return "";
    if (!countriesData) return value;
    // CountrySelector stores country.name.common, so check both code and name
    const country = countriesData.find(
      (c) => c.cca2 === value || c.name?.common === value
    );
    return country?.name?.common || value;
  };

  // Get document type label
  const getDocumentTypeLabel = () => {
    const docType = DOCUMENTS_OPTIONS.find(
      (doc) => doc.id === activeDocumentFilter
    );
    return docType?.label || "Driver's License";
  };

  // Get accreditation status label
  const getAccreditationStatusLabel = () => {
    if (formData.accredited_investor_status === "yes") {
      const accType = ACCREDITATION_TYPE_OPTIONS.find(
        (type) => type.value === formData.accreditation_type
      );
      return accType?.label || "Accredited Investor";
    }
    return "Not Accredited";
  };

  // Build submission payload
  const buildPayload = () => {
    const accrediationFiles = supportingDocuments
      .filter((doc) => doc.url && doc.fileName)
      .map((doc) => ({
        url: doc.url,
        filename: doc.fileName,
      }));

    return {
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      dob: formData.date_of_birth,
      nationality: formData.nationality,
      phone_number: formData.phone_number.trim(),
      country: formData.country,
      address_line_1: formData.address_line_1.trim(),
      address_line_2: formData.address_line_2.trim() || "",
      postal_code: formData.postal_code.trim(),
      city: formData.city.trim(),
      state: formData.state_province,
      verification_type: verificationType,
      id_number: formData.id_number.trim(),
      expiration_date: formData.expiration_date,
      front_url: fileUrls.front_url,
      back_url: fileUrls.back_url,
      selfie_url: fileUrls.selfie_url,
      accreditation:
        formData.accredited_investor_status === "yes" ? "Yes" : "No",
      accreditation_type:
        formData.accredited_investor_status === "yes"
          ? formData.accreditation_type
          : "Not Accredited",
      ssn_number: formData.tax_id.trim(),
      accrediation_files: accrediationFiles,
    };
  };

  // Handle submit
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = buildPayload();
      await submitKYCMutation.mutateAsync({ payload });
      showSuccessToast("KYC submitted successfully!");
      onClose();
      setTimeout(() => navigate(-1), 2000);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to submit KYC. Please try again.";
      showErrorToast(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit KYC for Review"
      subheader="Please review your information before submitting for verification."
      maxWidth="max-w-2xl"
    >
      <div className="flex flex-col gap-6 h-[500px] min-h-[500px] overflow-y-auto scrollbar-hide">
        {/* Your Information Section */}
        <div className="flex flex-col gap-4 p-4 rounded-lg bg-[#FAFAFC] border border-[#E5E5EA] ">
          <h3 className="font-['Montserrat'] text-[15px] font-medium  text-[#000]">
            Your Information
          </h3>
          <div className="flex flex-col items-start justify-center  gap-2.5 border-t border-[#D1D1D6] pt-3">
            <div className="flex items-center justify-between gap-1 w-full">
              <p className="text-[11px] font-medium font-['Montserrat'] text-[#000]">
                Full Name
              </p>
              <p className="text-[15px] font-normal font-['Montserrat'] text-[#000]">
                {formData.first_name} {formData.last_name}
              </p>
            </div>
            <div className="flex items-center justify-between gap-1 w-full">
              <p className="text-[11px] font-medium font-['Montserrat'] text-[#000]">
                Date of birth
              </p>
              <p className="text-[15px] font-normal font-['Montserrat'] text-[#000]">
                {formatDate(formData.date_of_birth)}
              </p>
            </div>
            <div className="flex items-center justify-between gap-1 w-full">
              <p className="text-[11px] font-medium font-['Montserrat'] text-[#000]">
                Nationality
              </p>
              <p className="text-[15px] font-normal font-['Montserrat'] text-[#000]">
                {getCountryName(formData.nationality)}
              </p>
            </div>
            <div className="flex items-center justify-between gap-1 w-full">
              <p className="text-[11px] font-medium font-['Montserrat'] text-[#000]">
                Email
              </p>
              <p className="text-[15px] font-normal font-['Montserrat'] text-[#000]">
                {userEmail || "N/A"}
              </p>
            </div>
            <div className="flex items-center justify-between gap-1 w-full">
              <p className="text-[11px] font-medium font-['Montserrat'] text-[#000]">
                Phone Number
              </p>
              <p className="text-[15px] font-normal font-['Montserrat'] text-[#000]">
                {formData.phone_number}
              </p>
            </div>
            <div className="flex items-center justify-between gap-1 w-full">
              <p className="text-[11px] font-medium font-['Montserrat'] text-[#000]">
                City
              </p>
              <p className="text-[15px] font-normal font-['Montserrat'] text-[#000]">
                {formData.city}
              </p>
            </div>
            <div className="flex items-center justify-between gap-1 w-full">
              <p className="text-[11px] font-medium font-['Montserrat'] text-[#000]">
                State
              </p>
              <p className="text-[15px] font-normal font-['Montserrat'] text-[#000]">
                {getCountryName(formData.state_province)}
              </p>
            </div>
            <div className="flex items-center justify-between gap-1 w-full">
              <p className="text-[11px] font-medium font-['Montserrat'] text-[#000]">
                Country
              </p>
              <p className="text-[15px] font-normal font-['Montserrat'] text-[#000]">
                {getCountryName(formData.country)}
              </p>
            </div>
            <div className="flex items-center justify-between gap-1 w-full">
              <p className="text-[11px] font-medium font-['Montserrat'] text-[#000]">
                Tax ID (SSN)
              </p>
              <p className="text-[15px] font-normal font-['Montserrat'] text-[#000]">
                {maskTaxId(formData.tax_id)}
              </p>
            </div>
            <div className="flex items-center justify-between gap-1 w-full">
              <p className="text-[11px] font-medium font-['Montserrat'] text-[#000]">
                Identity Document
              </p>
              <p className="text-[15px] font-normal font-['Montserrat'] text-[#000]">
                {getDocumentTypeLabel()}
              </p>
            </div>
            <div className="flex items-center justify-between gap-1 w-full">
              <p className="text-[11px] font-medium font-['Montserrat'] text-[#000]">
                Accreditation Status
              </p>
              <p className="text-[15px] font-normal font-['Montserrat'] text-[#000]">
                {getAccreditationStatusLabel()}
              </p>
            </div>
          </div>
        </div>

        {/* What happens next Section */}
        <div className="flex  flex-col items-start gap-4.5 rounded-xl border border-[#E5E5EA] bg-[#F2F2F7] p-[16px]">
          <div className="flex items-start gap-3">
            <FaTriangleExclamation className="w-5 h-5 text-[#000] flex-shrink-0 mt-0.5" />
            <div className="flex flex-col gap-2">
              <h3 className="text-[13px] font-semibold text-[#000] font-['Montserrat']">
                What happens next?
              </h3>
              <p className="text-[13px] font-normal text-[#000] font-['Montserrat']">
                Your verification will be reviewed by our compliance team within
                2-3 business days. You will receive an email notification once
                your account is approved or if any additional information is
                needed.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-2">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 h-[40px]"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            size="sm"
            className="flex-1 h-[40px]"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit for Review"}
          </Button>
        </div>
      </div>
    </GenericModal>
  );
};

export default SubmitKYCModal;
