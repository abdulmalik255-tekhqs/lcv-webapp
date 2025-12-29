import { Formik, Form } from "formik";
import { FaPlus, FaMinus, FaCheck } from "react-icons/fa6";
import { Button } from "@/components/shared";
import AssetsInput from "../fields/AssetsInput";
import AssetDropdown from "../fields/AssetDropdown";
import CountrySelector from "../fields/CountrySelector";
import { useUpdateBusinessDetails } from "@/api";
import useToast from "@/hooks/useCustomToast";
import DatePicker from "@/components/shared/DatePicker";
import { businessDetailsSchema } from "../utils/validationSchemas";

function BusinessDetails({
  formData,
  updateFormData,
  isExpanded,
  isFilled,
  onToggle,
  onSaveDraft,
  onNext,
  currentAssetId,
  countries = [],
}) {
  const { showBottomRightToast: showSuccessToast, showErrorToast } = useToast();
  const { mutate: updateBusinessDetails, isPending: isUpdating } =
    useUpdateBusinessDetails();

  const preparePayload = (values) => {
    return {
      industry: values.industrySector || "",
      country: values.country || "",
      city: values.city || "",
      year_established: values.yearEstablished
        ? parseInt(values.yearEstablished)
        : null,
      number_of_employees: values.numberOfEmployees
        ? parseInt(values.numberOfEmployees.split("-")[0])
        : null,
      ownership_stake: values.ownershipStake || "",
      business_valuation: values.businessValuation || "",
      operational_status: values.operationalStatus || "",
      minimum_investment: values.minimumInvestment || "",
      expected_yield: values.expectedYield || "",
      expected_term: values.expectedTerm || "",
      minimum_annual_return: values.minimumAnnualReturn || "",
      target_close_date: values.targetCloseDate || "",
    };
  };

  const handleSubmit = (values, { setSubmitting }) => {
    if (!currentAssetId) {
      showErrorToast("Please complete Basic Information first");
      setSubmitting(false);
      return;
    }

    const payload = preparePayload(values);

    updateBusinessDetails(
      { assetId: currentAssetId, payload },
      {
        onSuccess: () => {
          updateFormData("businessDetails", values);
          showSuccessToast("Business details saved successfully!");
          setSubmitting(false);
          onNext();
        },
        onError: (error) => {
          showErrorToast(
            error?.response?.data?.message || "Failed to save business details"
          );
          setSubmitting(false);
        },
      }
    );
  };

  const handleSave = (values) => {
    if (!currentAssetId) {
      showErrorToast("Please complete Basic Information first");
      return;
    }

    const payload = preparePayload(values);

    updateBusinessDetails(
      { assetId: currentAssetId, payload },
      {
        onSuccess: () => {
          updateFormData("businessDetails", values);
          showSuccessToast("Business details saved successfully!");
          onSaveDraft();
        },
        onError: (error) => {
          showErrorToast(
            error?.response?.data?.message || "Failed to save business details"
          );
        },
      }
    );
  };

  return (
    <div className="bg-white ">
      {/* Section Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-2 hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-[17px] font-semibold text-[#000] font-['Montserrat']">
          Business Details
        </h3>
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <FaMinus className="w-4 h-4 text-[#000] cursor-pointer" />
          ) : isFilled ? (
            <FaCheck className="w-4 h-4 text-[#248A3D] cursor-pointer" />
          ) : (
            <FaPlus className="w-4 h-4 text-[#000] cursor-pointer" />
          )}
        </div>
      </button>

      {/* Section Content */}
      {isExpanded && (
        <Formik
          initialValues={{
            industrySector: formData.industrySector || "",
            country: formData.country || "",
            city: formData.city || "",
            yearEstablished: formData.yearEstablished || "",
            numberOfEmployees: formData.numberOfEmployees || "",
            ownershipStake: formData.ownershipStake || "",
            businessValuation: formData.businessValuation || "",
            operationalStatus: formData.operationalStatus || "",
            minimumInvestment: formData.minimumInvestment || "",
            expectedYield: formData.expectedYield || "",
            expectedTerm: formData.expectedTerm || "",
            minimumAnnualReturn: formData.minimumAnnualReturn || "",
            targetCloseDate: formData.targetCloseDate || "",
          }}
          validationSchema={businessDetailsSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, setFieldValue, setFieldTouched, validateForm, setTouched }) => (
            <Form>
              <div className=" space-y-8 mt-4 px-2">
                <div className="space-y-5">
                  {/* Industry/Sector */}
                  <div>
                    <AssetDropdown
                      name="industrySector"
                      value={values.industrySector}
                      onChange={(e) => {
                        setFieldValue("industrySector", e.target.value);
                        updateFormData("businessDetails", { industrySector: e.target.value });
                      }}
                      placeholder="Industry/Sector"
                      label="Industry/Sector"
                      required
                      error={touched.industrySector && errors.industrySector ? errors.industrySector : ""}
                      // onFieldFocus={() => setFieldTouched("industrySector", true)}
                      options={[
                        "Fine Art",
                        "Memorabilia",
                        "Luxury Assets",
                        "Wine & Spirits",
                        "Banking & Lending",
                        "Insurance",
                        "Investment & Asset Management",
                        "Biotechnology",
                        "Medical Devices",
                      ]}
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <CountrySelector
                      value={values.country}
                      onChange={(e) => {
                        setFieldValue("country", e.target.value);
                        updateFormData("businessDetails", { country: e.target.value });
                      }}
                      label="Country"
                      required
                      error={touched.country && errors.country ? errors.country : ""}
                      // onFieldFocus={() => setFieldTouched("country", true)}
                      countries={countries}
                    />
                  </div>

                  {/* City */}
                  <div>
                    <AssetsInput
                      name="city"
                      value={values.city}
                      onChange={(e) => {
                        setFieldValue("city", e.target.value);
                        updateFormData("businessDetails", { city: e.target.value });
                      }}
                      label="City"
                      placeholder="City"
                      required
                      error={touched.city && errors.city ? errors.city : ""}
                      maxLength={20}
                      showCharCount={true}
                      // onFieldFocus={() => setFieldTouched("city", true)}
                    />
                  </div>

                  {/* Year Established */}
                  <div>
                    <AssetDropdown
                      name="yearEstablished"
                      value={values.yearEstablished}
                      onChange={(e) => {
                        setFieldValue("yearEstablished", e.target.value);
                        updateFormData("businessDetails", { yearEstablished: e.target.value });
                      }}
                      placeholder="Year Established"
                      label="Year Established"
                      required
                      error={touched.yearEstablished && errors.yearEstablished ? errors.yearEstablished : ""}
                      // onFieldFocus={() => setFieldTouched("yearEstablished", true)}
                      options={Array.from(
                        { length: new Date().getFullYear() - 1900 + 1 },
                        (_, i) => (new Date().getFullYear() - i).toString()
                      )}
                    />
                  </div>

                  {/* Number of Employees */}
                  <div>
                    <AssetDropdown
                      name="numberOfEmployees"
                      value={values.numberOfEmployees}
                      onChange={(e) => {
                        setFieldValue("numberOfEmployees", e.target.value);
                        updateFormData("businessDetails", { numberOfEmployees: e.target.value });
                      }}
                      placeholder="Number of Employees"
                      label="Number of Employees"
                      required
                      error={touched.numberOfEmployees && errors.numberOfEmployees ? errors.numberOfEmployees : ""}
                      // onFieldFocus={() => setFieldTouched("numberOfEmployees", true)}
                      options={[
                        "1-10",
                        "11-50",
                        "51-200",
                        "201-500",
                        "250-499",
                        "501-1000",
                        "1000+",
                      ]}
                    />
                  </div>

                  {/* Ownership Stake */}
                  <div>
                    <AssetsInput
                      name="ownershipStake"
                      value={values.ownershipStake}
                      onChange={(e) => {
                        setFieldValue("ownershipStake", e.target.value);
                        updateFormData("businessDetails", { ownershipStake: e.target.value });
                      }}
                      label="Ownership Stake"
                      placeholder="Ownership Stake"
                      required
                      error={touched.ownershipStake && errors.ownershipStake ? errors.ownershipStake : ""}
                      maxLength={10}
                      showCharCount={true}
                      // onFieldFocus={() => setFieldTouched("ownershipStake", true)}
                      inputType="number"
                      suffix="%"
                    />
                  </div>

                  {/* Business Valuation */}
                  <div>
                    <AssetsInput
                      name="businessValuation"
                      value={values.businessValuation}
                      onChange={(e) => {
                        setFieldValue("businessValuation", e.target.value);
                        updateFormData("businessDetails", { businessValuation: e.target.value });
                      }}
                      label="Business Valuation"
                      placeholder="Business Valuation"
                      required
                      error={touched.businessValuation && errors.businessValuation ? errors.businessValuation : ""}
                      maxLength={30}
                      showCharCount={true}
                      // onFieldFocus={() => setFieldTouched("businessValuation", true)}
                      inputType="number"
                      prefix="$"
                    />
                  </div>

                  {/* Operational Status */}
                  <div>
                    <AssetsInput
                      name="operationalStatus"
                      value={values.operationalStatus}
                      onChange={(e) => {
                        setFieldValue("operationalStatus", e.target.value);
                        updateFormData("businessDetails", { operationalStatus: e.target.value });
                      }}
                      label="Operational Status"
                      placeholder="Operational Status"
                      required
                      error={touched.operationalStatus && errors.operationalStatus ? errors.operationalStatus : ""}
                      maxLength={30}
                      showCharCount={true}
                      // onFieldFocus={() => setFieldTouched("operationalStatus", true)}
                    />
                  </div>

                  {/* Minimum Investment */}
                  <div>
                    <AssetsInput
                      name="minimumInvestment"
                      value={values.minimumInvestment}
                      onChange={(e) => {
                        setFieldValue("minimumInvestment", e.target.value);
                        updateFormData("businessDetails", { minimumInvestment: e.target.value });
                      }}
                      label="Minimum Investment"
                      placeholder="Minimum Investment"
                      required
                      error={touched.minimumInvestment && errors.minimumInvestment ? errors.minimumInvestment : ""}
                      maxLength={20}
                      showCharCount={true}
                      // onFieldFocus={() => setFieldTouched("minimumInvestment", true)}
                      inputType="number"
                      prefix="$"
                    />
                  </div>

                  {/* Expected Yield */}
                  <div>
                    <AssetsInput
                      name="expectedYield"
                      value={values.expectedYield}
                      onChange={(e) => {
                        setFieldValue("expectedYield", e.target.value);
                        updateFormData("businessDetails", { expectedYield: e.target.value });
                      }}
                      label="Expected Yield"
                      placeholder="Expected Yield"
                      required
                      error={touched.expectedYield && errors.expectedYield ? errors.expectedYield : ""}
                      maxLength={20}
                      showCharCount={true}
                      // onFieldFocus={() => setFieldTouched("expectedYield", true)}
                      inputType="number"
                      suffix="%"
                    />
                  </div>

                  {/* Expected Term */}
                  <div>
                    <AssetDropdown
                      name="expectedTerm"
                      value={values.expectedTerm}
                      onChange={(e) => {
                        setFieldValue("expectedTerm", e.target.value);
                        updateFormData("businessDetails", { expectedTerm: e.target.value });
                      }}
                      placeholder="Expected Term"
                      label="Expected Term"
                      required={false}
                      error={touched.expectedTerm && errors.expectedTerm ? errors.expectedTerm : ""}
                      // onFieldFocus={() => setFieldTouched("expectedTerm", true)}
                      options={[
                        "1 Year",
                        "2 Years",
                        "3 Years",
                        "5 Years",
                        "10 Years",
                        "15 Years",
                        "20 Years",
                        "30 Years",
                      ]}
                    />
                  </div>

                  {/* Minimum Annual Return */}
                  <div>
                    <AssetsInput
                      name="minimumAnnualReturn"
                      value={values.minimumAnnualReturn}
                      onChange={(e) => {
                        setFieldValue("minimumAnnualReturn", e.target.value);
                        updateFormData("businessDetails", { minimumAnnualReturn: e.target.value });
                      }}
                      label="Minimum Annual Return"
                      placeholder="Minimum Annual Return"
                      required
                      error={touched.minimumAnnualReturn && errors.minimumAnnualReturn ? errors.minimumAnnualReturn : ""}
                      maxLength={20}
                      showCharCount={true}
                      // onFieldFocus={() => setFieldTouched("minimumAnnualReturn", true)}
                      inputType="number"
                      suffix="%"
                    />
                  </div>

                  {/* Target Close Date */}
                  <div className="w-full">
                    <DatePicker
                      label="Target Close Date"
                      value={values.targetCloseDate}
                      onChange={(dateString) => {
                        setFieldValue("targetCloseDate", dateString);
                        // setFieldTouched("targetCloseDate", true);
                        updateFormData("businessDetails", { targetCloseDate: dateString });
                      }}
                      // onFocus={() => setFieldTouched("targetCloseDate", true)}
                      required={true}
                      hideLabel={true}
                      placeholder="Select date"
                      className="w-full"
                      disablePastDates={true}
                      error={touched.targetCloseDate && errors.targetCloseDate ? errors.targetCloseDate : ""}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex w-full gap-4 ">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleSave(values)}
                    className="!rounded-full w-full"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Saving..." : "Save Draft"}
                  </Button>
                  <Button
                    type="button"
                    variant="gradient"
                    onClick={async () => {
                      // Mark all fields as touched
                      setTouched({
                        industrySector: true,
                        country: true,
                        city: true,
                        yearEstablished: true,
                        numberOfEmployees: true,
                        ownershipStake: true,
                        businessValuation: true,
                        operationalStatus: true,
                        minimumInvestment: true,
                        expectedYield: true,
                        expectedTerm: true,
                        minimumAnnualReturn: true,
                        targetCloseDate: true,
                      });

                      // Validate
                      const validationErrors = await validateForm();
                      
                      // If valid, submit
                      if (Object.keys(validationErrors).length === 0) {
                        handleSubmit(values, { setSubmitting: () => {} });
                      }
                    }}
                    className="!rounded-full w-full"
                    disabled={isUpdating}
                    loading={isUpdating}
                  >
                    {isUpdating ? "Saving..." : "Next"}
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
}

export default BusinessDetails;
