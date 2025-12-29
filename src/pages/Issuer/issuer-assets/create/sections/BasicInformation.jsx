import { Formik, Form } from "formik";
import { FaPlus, FaMinus, FaCheck } from "react-icons/fa6";
import { Button } from "@/components/shared";
import AssetsInput from "../fields/AssetsInput";
import AssetsTextarea from "../fields/AssetsTextarea";
import AssetDropdown from "../fields/AssetDropdown";
import { useCreateBasicInformation } from "@/api";
import useToast from "@/hooks/useCustomToast";
import { basicInformationSchema } from "../utils/validationSchemas";

function BasicInformation({
  formData,
  updateFormData,
  isExpanded,
  isFilled,
  onToggle,
  onNext,
  currentAssetId,
  onAssetIdCreated,
  assetTypes = [],
}) {
  const {
    showBottomRightToast: showSuccessToast,
    showErrorToast: showErrorToast,
  } = useToast();
  const { mutate: createBasicInfo, isPending: isCreating } =
    useCreateBasicInformation();

  const handleSubmit = (values, { setSubmitting }) => {
    const payload = {
      name: values.assetName,
      description: values.description,
      asset_type_id: values.assetType,
    };

    // Include id if editing (id in URL)
    if (currentAssetId) {
      payload.id = currentAssetId;
    }

    createBasicInfo(
      { payload },
      {
        onSuccess: (response) => {
          updateFormData("basicInformation", values);
          if (response?.id && !currentAssetId) {
            onAssetIdCreated(response.id);
          }
          showSuccessToast("Basic information saved successfully!");
          setSubmitting(false);
          onNext();
        },
        onError: (error) => {
          showErrorToast(
            error?.response?.data?.message || "Failed to save basic information"
          );
          setSubmitting(false);
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
          Basic Information
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
            assetName: formData.assetName || "",
            description: formData.description || "",
            assetType: formData.assetType || "",
          }}
          validationSchema={basicInformationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, setFieldValue, setFieldTouched, validateForm, setTouched }) => (
            <Form>
              <div className=" space-y-8 mt-4 px-2">
                <div className="space-y-5">
                  {/* Asset Name */}
                  <div>
                    <AssetsInput
                      name="assetName"
                      value={values.assetName}
                      onChange={(e) => {
                        setFieldValue("assetName", e.target.value);
                        updateFormData("basicInformation", { assetName: e.target.value });
                      }}
                      label="Asset Name"
                      placeholder="Asset Name"
                      required
                      error={touched.assetName && errors.assetName ? errors.assetName : ""}
                      maxLength={30}
                      showCharCount={true}
                      // onFieldFocus={() => setFieldTouched("assetName", true)}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <AssetsTextarea
                      name="description"
                      value={values.description}
                      onChange={(e) => {
                        setFieldValue("description", e.target.value);
                        updateFormData("basicInformation", { description: e.target.value });
                      }}
                      label="Description"
                      placeholder=" "
                      required
                      error={touched.description && errors.description ? errors.description : ""}
                      maxLength={500}
                      showCharCount={true}
                      rows={4}
                      // onFieldFocus={() => setFieldTouched("description", true)}
                    />
                  </div>

                  {/* Asset Type */}
                  <div>
                    <AssetDropdown
                      name="assetType"
                      value={values.assetType}
                      onChange={(e) => {
                        setFieldValue("assetType", e.target.value);
                        updateFormData("basicInformation", { assetType: e.target.value });
                      }}
                      label="Asset Type"
                      required
                      error={touched.assetType && errors.assetType ? errors.assetType : ""}
                      // onFieldFocus={() => setFieldTouched("assetType", true)}
                      options={assetTypes.map((type) => ({
                        value: type.id,
                        label: type.title,
                      }))}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex w-full gap-4 ">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={async () => {
                      // Mark all fields as touched
                      setTouched({
                        assetName: true,
                        description: true,
                        assetType: true,
                      });

                      // Validate
                      const validationErrors = await validateForm();
                      
                      // If valid, submit
                      if (Object.keys(validationErrors).length === 0) {
                        handleSubmit(values, { setSubmitting: () => {} });
                      }
                    }}
                    className="!rounded-full w-full"
                    disabled={isCreating}
                  >
                    Save Draft
                  </Button>
                  <Button
                    type="button"
                    variant="gradient"
                    onClick={async () => {
                      // Mark all fields as touched
                      setTouched({
                        assetName: true,
                        description: true,
                        assetType: true,
                      });

                      // Validate
                      const validationErrors = await validateForm();
                      
                      // If valid, submit
                      if (Object.keys(validationErrors).length === 0) {
                        handleSubmit(values, { setSubmitting: () => {} });
                      }
                    }}
                    className="!rounded-full w-full"
                    disabled={isCreating}
                    loading={isCreating}
                  >
                    {isCreating ? "Saving..." : "Next"}
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

export default BasicInformation;
