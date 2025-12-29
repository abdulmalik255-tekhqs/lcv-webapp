import { Formik, Form } from "formik";
import { FaPlus, FaMinus, FaCheck } from "react-icons/fa6";
import { Button } from "@/components/shared";
import AssetsInput from "../fields/AssetsInput";
import { useUpdateFinancialDetails } from "@/api";
import useToast from "@/hooks/useCustomToast";
import { financialInformationSchema } from "../utils/validationSchemas";

function FinancialInformation({
  formData,
  updateFormData,
  isExpanded,
  isFilled,
  onToggle,
  onSaveDraft,
  onNext,
  currentAssetId,
}) {
  const { showBottomRightToast: showSuccessToast, showErrorToast } = useToast();
  const { mutate: updateFinancialDetails, isPending: isUpdating } =
    useUpdateFinancialDetails();

  const preparePayload = (values) => {
    return {
      annual_revenue: values.annualRevenue || "",
      revenue_cagr: values.revenueCAGR || "",
      ebitda: values.ebitda || "",
      broadcasting_revenue: values.broadcastingRevenue || "",
      matchday_revenue: values.matchdayRevenue || "",
      commercial_revenue: values.commercialRevenue || "",
      player_acquisitions: values.playerAcquisitions || "",
      operating_expenses: values.operatingExpenses || "",
    };
  };

  const handleSubmit = (values, { setSubmitting }) => {
    if (!currentAssetId) {
      showErrorToast("Please complete Basic Information first");
      setSubmitting(false);
      return;
    }

    const payload = preparePayload(values);

    updateFinancialDetails(
      { assetId: currentAssetId, payload },
      {
        onSuccess: () => {
          updateFormData("financialInformation", values);
          showSuccessToast("Financial information saved successfully!");
          setSubmitting(false);
          onNext();
        },
        onError: (error) => {
          showErrorToast(
            error?.response?.data?.message ||
              "Failed to save financial information"
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

    updateFinancialDetails(
      { assetId: currentAssetId, payload },
      {
        onSuccess: () => {
          updateFormData("financialInformation", values);
          showSuccessToast("Financial information saved successfully!");
          onSaveDraft();
        },
        onError: (error) => {
          showErrorToast(
            error?.response?.data?.message ||
              "Failed to save financial information"
          );
        },
      }
    );
  };

  return (
    <div className="bg-white  overflow-hidden">
      {/* Section Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-2 hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-[17px] font-semibold text-[#000] font-['Montserrat']">
          Financial Information
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
            annualRevenue: formData.annualRevenue || "",
            revenueCAGR: formData.revenueCAGR || "",
            ebitda: formData.ebitda || "",
            broadcastingRevenue: formData.broadcastingRevenue || "",
            matchdayRevenue: formData.matchdayRevenue || "",
            commercialRevenue: formData.commercialRevenue || "",
            playerAcquisitions: formData.playerAcquisitions || "",
            operatingExpenses: formData.operatingExpenses || "",
          }}
          validationSchema={financialInformationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, setFieldValue, setFieldTouched, validateForm, setTouched }) => (
            <Form>
              <div className=" space-y-8 mt-4 px-2">
                <div className="space-y-5">
                  {/* Annual Revenue */}
                  <div>
                    <AssetsInput
                      name="annualRevenue"
                      value={values.annualRevenue}
                      onChange={(e) => {
                        setFieldValue("annualRevenue", e.target.value);
                        updateFormData("financialInformation", { annualRevenue: e.target.value });
                      }}
                      label="Annual Revenue"
                      placeholder="Annual Revenue"
                      required
                      error={touched.annualRevenue && errors.annualRevenue ? errors.annualRevenue : ""}
                      maxLength={20}
                      showCharCount={true}
                      // onFieldFocus={() => setFieldTouched("annualRevenue", true)}
                      inputType="number"
                      prefix="$"
                    />
                  </div>

                  {/* Revenue CAGR */}
                  <div>
                    <AssetsInput
                      name="revenueCAGR"
                      value={values.revenueCAGR}
                      onChange={(e) => {
                        setFieldValue("revenueCAGR", e.target.value);
                        updateFormData("financialInformation", { revenueCAGR: e.target.value });
                      }}
                      label="Revenue CAGR"
                      placeholder="Revenue CAGR"
                      required
                      error={touched.revenueCAGR && errors.revenueCAGR ? errors.revenueCAGR : ""}
                      maxLength={20}
                      showCharCount={true}
                      // onFieldFocus={() => setFieldTouched("revenueCAGR", true)}
                      inputType="number"
                      suffix="%"
                    />
                  </div>

                  {/* EBITDA */}
                  <div>
                    <AssetsInput
                      name="ebitda"
                      value={values.ebitda}
                      onChange={(e) => {
                        setFieldValue("ebitda", e.target.value);
                        updateFormData("financialInformation", { ebitda: e.target.value });
                      }}
                      label="EBITDA"
                      placeholder="EBITDA"
                      required
                      error={touched.ebitda && errors.ebitda ? errors.ebitda : ""}
                      maxLength={20}
                      showCharCount={true}
                      // onFieldFocus={() => setFieldTouched("ebitda", true)}
                      inputType="number"
                      prefix="$"
                    />
                  </div>

                  {/* Broadcasting Revenue */}
                  <div>
                    <AssetsInput
                      name="broadcastingRevenue"
                      value={values.broadcastingRevenue}
                      onChange={(e) => {
                        setFieldValue("broadcastingRevenue", e.target.value);
                        updateFormData("financialInformation", { broadcastingRevenue: e.target.value });
                      }}
                      label="Broadcasting Revenue"
                      placeholder="Broadcasting Revenue"
                      required
                      error={touched.broadcastingRevenue && errors.broadcastingRevenue ? errors.broadcastingRevenue : ""}
                      maxLength={20}
                      showCharCount={true}
                      // onFieldFocus={() => setFieldTouched("broadcastingRevenue", true)}
                      inputType="number"
                      prefix="$"
                    />
                  </div>

                  {/* Matchday Revenue */}
                  <div>
                    <AssetsInput
                      name="matchdayRevenue"
                      value={values.matchdayRevenue}
                      onChange={(e) => {
                        setFieldValue("matchdayRevenue", e.target.value);
                        updateFormData("financialInformation", { matchdayRevenue: e.target.value });
                      }}
                      label="Matchday Revenue"
                      placeholder="Matchday Revenue"
                      required
                      error={touched.matchdayRevenue && errors.matchdayRevenue ? errors.matchdayRevenue : ""}
                      maxLength={20}
                      showCharCount={true}
                      // onFieldFocus={() => setFieldTouched("matchdayRevenue", true)}
                      inputType="number"
                      prefix="$"
                    />
                  </div>

                  {/* Commercial Revenue */}
                  <div>
                    <AssetsInput
                      name="commercialRevenue"
                      value={values.commercialRevenue}
                      onChange={(e) => {
                        setFieldValue("commercialRevenue", e.target.value);
                        updateFormData("financialInformation", { commercialRevenue: e.target.value });
                      }}
                      label="Commercial Revenue"
                      placeholder="Commercial Revenue"
                      required
                      error={touched.commercialRevenue && errors.commercialRevenue ? errors.commercialRevenue : ""}
                      maxLength={20}
                      showCharCount={true}
                      // onFieldFocus={() => setFieldTouched("commercialRevenue", true)}
                      inputType="number"
                      prefix="$"
                    />
                  </div>

                  {/* Player Acquisitions */}
                  <div>
                    <AssetsInput
                      name="playerAcquisitions"
                      value={values.playerAcquisitions}
                      onChange={(e) => {
                        setFieldValue("playerAcquisitions", e.target.value);
                        updateFormData("financialInformation", { playerAcquisitions: e.target.value });
                      }}
                      label="Player Acquisitions"
                      placeholder="Player Acquisitions"
                      required
                      error={touched.playerAcquisitions && errors.playerAcquisitions ? errors.playerAcquisitions : ""}
                      maxLength={20}
                      showCharCount={true}
                      // onFieldFocus={() => setFieldTouched("playerAcquisitions", true)}
                      inputType="number"
                      prefix="$"
                    />
                  </div>

                  {/* Operating Expenses */}
                  <div>
                    <AssetsInput
                      name="operatingExpenses"
                      value={values.operatingExpenses}
                      onChange={(e) => {
                        setFieldValue("operatingExpenses", e.target.value);
                        updateFormData("financialInformation", { operatingExpenses: e.target.value });
                      }}
                      label="Operating Expenses"
                      placeholder="Operating Expenses"
                      required
                      error={touched.operatingExpenses && errors.operatingExpenses ? errors.operatingExpenses : ""}
                      maxLength={20}
                      showCharCount={true}
                      //  onFieldFocus={() => setFieldTouched("operatingExpenses", true)}
                      inputType="number"
                      prefix="$"
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
                        annualRevenue: true,
                        revenueCAGR: true,
                        ebitda: true,
                        broadcastingRevenue: true,
                        matchdayRevenue: true,
                        commercialRevenue: true,
                        playerAcquisitions: true,
                        operatingExpenses: true,
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
                    {isUpdating ? "Saving..." : "Continue"}
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

export default FinancialInformation;
