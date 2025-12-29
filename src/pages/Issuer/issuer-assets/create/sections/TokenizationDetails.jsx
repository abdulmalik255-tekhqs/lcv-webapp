import {
  useDeleteInitialOwner,
  useUpdateInitialOwner,
  useUpdateTokenizationDetails,
} from "@/api";
import { Button } from "@/components/shared";
import useToast from "@/hooks/useCustomToast";
import { useMemo } from "react";
import { FaCheck, FaDatabase, FaMinus, FaPlus } from "react-icons/fa6";
import AssetsInput from "../fields/AssetsInput";
import { Formik, Form, FieldArray } from "formik";
import { tokenizationDetailsSchema } from "../utils/validationSchemas";

function TokenizationDetails({
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
  const {
    mutate: updateTokenizationDetails,
    isPending: isUpdatingTokenization,
  } = useUpdateTokenizationDetails();
  const { mutate: updateInitialOwner, isPending: isUpdatingOwner } =
    useUpdateInitialOwner();
  const { mutate: deleteInitialOwner, isPending: isDeletingOwner } =
    useDeleteInitialOwner();

  const formatNumber = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("en-US").format(value);
  };

  const handleSubmit = (values, { setSubmitting }) => {
    if (!currentAssetId) {
      showErrorToast("Please complete Basic Information first");
      setSubmitting(false);
      return;
    }

    // Check custom validations
    const totalSupply = parseFloat(values.totalSupply) || 0;
    const initialMint = parseFloat(values.initialMint) || 0;
    if (values.initialMint && initialMint > totalSupply) {
      showErrorToast(
        `Initial mint cannot be greater than total supply. Maximum: ${formatNumber(
          totalSupply
        )}`
      );
      setSubmitting(false);
      return;
    }

    // Save tokenization details
    const tokenizationPayload = {
      total_supply: values.totalSupply || "",
      initial_mint: values.initialMint || "",
      initial_price: values.tokenPrice ? parseFloat(values.tokenPrice) : null,
    };

    updateTokenizationDetails(
      { assetId: currentAssetId, payload: tokenizationPayload },
      {
        onSuccess: () => {
          // Update external formData with all current values
          updateFormData("tokenizationDetails", {
            totalSupply: values.totalSupply,
            initialMint: values.initialMint,
            tokenPrice: values.tokenPrice,
            initialOwners: values.initialOwners,
          });
          showSuccessToast("Tokenization details saved successfully!");
          setSubmitting(false);
          onNext();
        },
        onError: (error) => {
          showErrorToast(
            error?.response?.data?.message ||
              "Failed to save tokenization details"
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

    // Save tokenization details
    const tokenizationPayload = {
      total_supply: values.totalSupply || "",
      initial_mint: values.initialMint || "",
      initial_price: values.tokenPrice ? parseFloat(values.tokenPrice) : null,
    };

    updateTokenizationDetails(
      { assetId: currentAssetId, payload: tokenizationPayload },
      {
        onSuccess: () => {
          // Update external formData with all current values
          updateFormData("tokenizationDetails", {
            totalSupply: values.totalSupply,
            initialMint: values.initialMint,
            tokenPrice: values.tokenPrice,
            initialOwners: values.initialOwners,
          });
          showSuccessToast("Asset Tokenization Request saved successfully!");
          onSaveDraft();
        },
        onError: (error) => {
          showErrorToast(
            error?.response?.data?.message ||
              "Failed to save tokenization details"
          );
        },
      }
    );
  };

  const saveOwner = async (owner, index, values) => {
    if (!currentAssetId) {
      showErrorToast("Please complete Basic Information first");
      return;
    }

    if (!owner.name || !owner.email || !owner.tokenAllocation) {
      showErrorToast(
        "Please fill in all owner fields (Name, Email, Token Allocation)"
      );
      return;
    }

    // Validate token allocation
    const initialMint = parseFloat(values.initialMint) || 0;
    const allocation = parseFloat(owner.tokenAllocation) || 0;
    const otherOwnersTotal = values.initialOwners.reduce((sum, o, i) => {
      if (i !== index) {
        return sum + (parseFloat(o.tokenAllocation) || 0);
      }
      return sum;
    }, 0);
    const maxAllocation = initialMint - otherOwnersTotal;

    if (allocation > maxAllocation) {
      showErrorToast(
        `Token allocation cannot be greater than Issuer Treasury. Maximum: ${formatNumber(
          maxAllocation
        )}`
      );
      return;
    }

    const payload = {
      name: owner.name,
      email: owner.email,
      token_allocation: parseInt(owner.tokenAllocation) || 0,
    };

    // If owner has ID, include it for update
    if (owner.id) {
      payload.id = owner.id;
    }

    updateInitialOwner(
      { assetId: currentAssetId, payload },
      {
        onSuccess: (response) => {
          // Update owner with ID from response
          const updatedOwners = [...values.initialOwners];
          updatedOwners[index] = {
            ...updatedOwners[index],
            id: response?.id || owner.id,
          };
          // Update external formData with all current values including the updated owner
          updateFormData("tokenizationDetails", {
            totalSupply: values.totalSupply,
            initialMint: values.initialMint,
            tokenPrice: values.tokenPrice,
            initialOwners: updatedOwners,
          });
          showSuccessToast(
            owner.id
              ? "Owner updated successfully!"
              : "Owner added successfully!"
          );
        },
        onError: (error) => {
          showErrorToast(
            error?.response?.data?.message || "Failed to save owner"
          );
        },
      }
    );
  };

  const handleRemoveOwner = async (index, values, arrayHelpers) => {
    if (!currentAssetId) {
      showErrorToast("Please complete Basic Information first");
      return;
    }

    const owner = values.initialOwners[index];

    // If owner has an ID, delete via API
    if (owner.id) {
      deleteInitialOwner(
        { assetId: currentAssetId, ownerId: owner.id },
        {
          onSuccess: () => {
            arrayHelpers.remove(index);
            showSuccessToast("Owner removed successfully!");
          },
          onError: (error) => {
            showErrorToast(
              error?.response?.data?.message || "Failed to remove owner"
            );
          },
        }
      );
    } else {
      // If no ID, just remove from local state
      if (values.initialOwners.length > 1) {
        arrayHelpers.remove(index);
      }
    }
  };

  return (
    <div className="bg-white overflow-hidden">
      {/* Section Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-2 hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-[17px] font-semibold text-[#000] font-['Montserrat']">
          Tokenization Details
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
        <Formik
          initialValues={{
            totalSupply: formData.totalSupply || "",
            initialMint: formData.initialMint || "",
            tokenPrice: formData.tokenPrice || "",
            initialOwners:
              formData.initialOwners?.length > 0
                ? formData.initialOwners.map((owner) => ({
                    name: owner.name || "",
                    email: owner.email || "",
                    tokenAllocation: owner.tokenAllocation || "",
                    id: owner.id || null,
                  }))
                : [{ name: "", email: "", tokenAllocation: "", id: null }],
          }}
          validationSchema={tokenizationDetailsSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            setFieldValue,
            setFieldTouched,
            validateForm,
            setTouched,
          }) => {
            // Calculate owner allocations total
            const ownerAllocationsTotal = useMemo(() => {
              return values.initialOwners.reduce((sum, owner) => {
                return sum + (parseFloat(owner.tokenAllocation) || 0);
              }, 0);
            }, [values.initialOwners]);

            // Calculate issuer treasury (Initial Mint - Owner Allocations)
            const issuerTreasury = useMemo(() => {
              const initialMint = parseFloat(values.initialMint) || 0;
              return Math.max(0, initialMint - ownerAllocationsTotal);
            }, [values.initialMint, ownerAllocationsTotal]);

            // Calculate unminted (Total Supply - Initial Mint)
            const unminted = useMemo(() => {
              const totalSupply = parseFloat(values.totalSupply) || 0;
              const initialMint = parseFloat(values.initialMint) || 0;
              return Math.max(0, totalSupply - initialMint);
            }, [values.totalSupply, values.initialMint]);

            // Calculate available for investment ((Issuer Treasury + Unminted) * Token Price)
            const availableForInvestment = useMemo(() => {
              const tokenPrice = parseFloat(
                values.tokenPrice?.replace(/[^0-9.]/g, "") || "0"
              );
              return (issuerTreasury + unminted) * tokenPrice;
            }, [issuerTreasury, unminted, values.tokenPrice]);

            // Calculate minimum initial mint based on owner allocations
            const minimumInitialMint = useMemo(() => {
              return ownerAllocationsTotal;
            }, [ownerAllocationsTotal]);

            // Calculate max initial mint (total supply)
            const maxInitialMint = useMemo(() => {
              return parseFloat(values.totalSupply) || 0;
            }, [values.totalSupply]);

            const tokenPriceNum = parseFloat(
              values.tokenPrice?.replace(/[^0-9.]/g, "") || "0"
            );

            return (
              <Form>
                <div className="mt-4 px-2">
                  {/* Two Column Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px] overflow-y-auto">
                    {/* Left Column - Input Fields */}
                    <div className="space-y-6">
                      <p className="text-sm text-[#48484A] mb-6">
                        Configure the token supply, pricing, and initial
                        ownership structure for your asset.
                      </p>
                      {/* Total Supply */}
                      <div>
                        <AssetsInput
                          name="totalSupply"
                          value={values.totalSupply}
                          onChange={(e) => {
                            setFieldValue("totalSupply", e.target.value);
                          }}
                          label="Total Supply"
                          placeholder="Total Supply"
                          description="Maximum number of tokens that can exist."
                          error={
                            touched.totalSupply && errors.totalSupply
                              ? errors.totalSupply
                              : ""
                          }
                          maxLength={30}
                          showCharCount={true}
                          // onFieldFocus={() => setFieldTouched("totalSupply", true)}
                          inputType="number"
                          suffix="tokens"
                        />
                      </div>

                      {/* Initial Mint */}
                      <div>
                        <AssetsInput
                          name="initialMint"
                          value={values.initialMint}
                          onChange={(e) => {
                            setFieldValue("initialMint", e.target.value);
                          }}
                          label="Initial Mint"
                          placeholder="Initial Mint"
                          description={
                            maxInitialMint > 0
                              ? minimumInitialMint > 0
                                ? `Minimum: ${formatNumber(
                                    minimumInitialMint
                                  )} based on owner allocations. Maximum: ${formatNumber(
                                    maxInitialMint
                                  )} (Total Supply).`
                                : `Maximum: ${formatNumber(
                                    maxInitialMint
                                  )} (Total Supply). Must include any owner allocations and any left over will reside in the Issuer's Treasury.`
                              : minimumInitialMint > 0
                              ? `Minimum: ${formatNumber(
                                  minimumInitialMint
                                )} based on owner allocations.`
                              : "Must include any owner allocations and any left over will reside in the Issuer's Treasury."
                          }
                          error={
                            touched.initialMint && errors.initialMint
                              ? errors.initialMint
                              : ""
                          }
                          maxLength={20}
                          showCharCount={true}
                          // onFieldFocus={() => setFieldTouched("initialMint", true)}
                          inputType="number"
                          suffix="tokens"
                        />
                      </div>

                      {/* Price per Token */}
                      <div>
                        <AssetsInput
                          name="tokenPrice"
                          value={values.tokenPrice}
                          onChange={(e) => {
                            setFieldValue("tokenPrice", e.target.value);
                          }}
                          label="Price per Token"
                          placeholder="Price per Token"
                          description=""
                          error={
                            touched.tokenPrice && errors.tokenPrice
                              ? errors.tokenPrice
                              : ""
                          }
                          maxLength={20}
                          showCharCount={true}
                          // onFieldFocus={() => setFieldTouched("tokenPrice", true)}
                          inputType="number"
                          prefix="$"
                        />
                      </div>

                      {/* Initial Owners Section */}
                      <FieldArray name="initialOwners">
                        {(arrayHelpers) => (
                          <div className="space-y-4 h-[416px] overflow-y-auto">
                            <div className="flex items-center justify-between pt-1">
                              <h4 className="text-sm font-semibold text-[#000]">
                                Initial Owners
                              </h4>
                              <Button
                                type="button"
                                variant="secondary"
                                onClick={() =>
                                  arrayHelpers.push({
                                    name: "",
                                    email: "",
                                    tokenAllocation: "",
                                    id: null,
                                  })
                                }
                                className="!rounded-full text-sm px-4 py-1.5"
                                icon={<FaPlus />}
                                iconPosition="left"
                              >
                                Add Owner
                              </Button>
                            </div>

                            {values.initialOwners.map((owner, index) => (
                              <div
                                key={index}
                                className="bg-[#FAFAFC] border border-[#E5E5EA] rounded-lg p-4 space-y-4 "
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="text-sm font-semibold text-[#000]">
                                    Owner {index + 1}
                                  </h5>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() =>
                                      handleRemoveOwner(
                                        index,
                                        values,
                                        arrayHelpers
                                      )
                                    }
                                    className="!border border-[#000]"
                                    disabled={isDeletingOwner}
                                    // icon={<FaDatabase />}
                                  >
                                    Remove Owner
                                  </Button>
                                </div>
                                <div>
                                  <AssetsInput
                                    name={`initialOwners.${index}.name`}
                                    value={owner.name}
                                    onChange={(e) => {
                                      setFieldValue(
                                        `initialOwners.${index}.name`,
                                        e.target.value
                                      );
                                    }}
                                    label="Name"
                                    placeholder="Name"
                                    error={
                                      touched.initialOwners?.[index]?.name &&
                                      errors.initialOwners?.[index]?.name
                                        ? errors.initialOwners[index].name
                                        : ""
                                    }
                                    maxLength={100}
                                    showCharCount={!!owner.name}
                                    // onFieldFocus={() => setFieldTouched(`initialOwners.${index}.name`, true)}
                                  />
                                </div>
                                <div>
                                  <AssetsInput
                                    name={`initialOwners.${index}.email`}
                                    type="email"
                                    value={owner.email}
                                    onChange={(e) => {
                                      setFieldValue(
                                        `initialOwners.${index}.email`,
                                        e.target.value
                                      );
                                    }}
                                    label="Email"
                                    placeholder="Email"
                                    error={
                                      touched.initialOwners?.[index]?.email &&
                                      errors.initialOwners?.[index]?.email
                                        ? errors.initialOwners[index].email
                                        : ""
                                    }
                                    onFieldFocus={() => setFieldTouched(`initialOwners.${index}.email`, true)}
                                  />
                                </div>
                                <div>
                                  <AssetsInput
                                    name={`initialOwners.${index}.tokenAllocation`}
                                    value={owner.tokenAllocation}
                                    onChange={(e) => {
                                      setFieldValue(
                                        `initialOwners.${index}.tokenAllocation`,
                                        e.target.value
                                      );
                                    }}
                                    label="Token Allocation"
                                    placeholder="Token Allocation"
                                    description={(() => {
                                      const initialMint =
                                        parseFloat(values.initialMint) || 0;
                                      const otherOwnersTotal =
                                        values.initialOwners.reduce(
                                          (sum, o, i) => {
                                            if (i !== index) {
                                              return (
                                                sum +
                                                (parseFloat(
                                                  o.tokenAllocation
                                                ) || 0)
                                              );
                                            }
                                            return sum;
                                          },
                                          0
                                        );
                                      const maxAllocation =
                                        initialMint - otherOwnersTotal;
                                      return maxAllocation > 0
                                        ? `Maximum: ${formatNumber(
                                            maxAllocation
                                          )} (Issuer Treasury)`
                                        : "";
                                    })()}
                                    error={
                                      touched.initialOwners?.[index]
                                        ?.tokenAllocation &&
                                      errors.initialOwners?.[index]
                                        ?.tokenAllocation
                                        ? errors.initialOwners[index]
                                            .tokenAllocation
                                        : ""
                                    }
                                    maxLength={30}
                                    // onFieldFocus={() => setFieldTouched(`initialOwners.${index}.tokenAllocation`, true)}
                                    inputType="number"
                                  />
                                </div>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  onClick={() =>
                                    saveOwner(owner, index, values)
                                  }
                                  className="!rounded-full w-full"
                                  disabled={isUpdatingOwner}
                                >
                                  {isUpdatingOwner
                                    ? "Saving..."
                                    : owner.id
                                    ? "Update Owner"
                                    : "Save Owner"}
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </FieldArray>
                    </div>

                    {/* Right Column - Summary Cards */}
                    <div className="border border-[#E5E5EA] rounded-lg ">
                      {/* Token Breakdown Card */}
                      <div className="bg-[#FAFAFC] p-6">
                        <h4 className="text-sm font-semibold text-[#000] mb-4">
                          Token Breakdown
                        </h4>
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <p className="text-[13px] font-normal text-[#000]">Total Supply</p>
                            <p className="text-[13px] font-normal text-[#000]">
                              {values.totalSupply || "0"}
                            </p>
                          </div>
                          <div className="flex justify-between items-start ">
                              <p className="text-xs font-semibold text-[#000]">
                                Initial Mint
                              </p>
                              <p className="text-base font-medium text-[#000]">
                                {values.initialMint || "0"}
                              </p>
                            </div>
                          <div>
                           
                            <div className="ml-2 mt-2 space-y-2 bg-[#F5F5F7] border border-[#E5E5EA] px-4 py-2 rounded">
                              <div className="flex justify-between items-start">
                                <p className="text-[13px] font-normal text-[#000]">
                                  Owner Allocations
                                </p>
                                <p className="text-[13px] font-normal text-[#000]">
                                  {ownerAllocationsTotal}
                                </p>
                              </div>
                              <div className="flex justify-between items-start">
                                <p className="text-[13px] font-normal text-[#000]">
                                  Issuer Treasury
                                </p>
                                <p className="text-[13px] font-normal text-[#000]">
                                  {issuerTreasury}
                                </p>
                              </div>
                            </div>
                          </div>
                          <hr className="border-t border-[#E5E5EA] my-4 border-1"></hr>
                          <div className="flex justify-between items-start !space-y-0">
                            <div className="flex-1">
                              <p className="text-[13px] text-[#000] font-normal ">
                                Unminted
                              </p>
                            </div>
                            <p className="text-[13px] font-normal text-[#000] ml-4">
                              {unminted}
                            </p>
                          </div>
                          <p className="text-[11px] font-normal text-[#48484A]  ">
                            Unminted tokens will be minted on demand by the Registrar as
                            needed.
                          </p>
                        </div>
                      </div>

                      {/* Available for Investment Card */}
                      <div className="bg-[#FAFAFC]  px-6 pb-4">
                        <div className="bg-white p-4 shadow-sm relative rounded-[10px] border border-[#E5E5EA]">
                          <div className="absolute top-4 right-4">
                            <div className="w-8 h-8 rounded-full bg-[#0D4BEF] flex items-center justify-center">
                              <span className="text-white text-[16px] font-semibold">
                                $
                              </span>
                            </div>
                          </div>
                          <h4 className="text-sm font-semibold text-[#000] mb-1 pr-9">
                            Available for Investment
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <p className="text-[11px] font-normal text-[#48484A] mb-1">
                                (Issuer Treasury + Unminted) × Token Price
                              </p>
                              <p className="text-[11px] font-normal text-[#48484A] mb-3">
                                {issuerTreasury + unminted} tokens × {tokenPriceNum}
                              </p>
                              <p className="text-[24px] font-[500] text-[#000]">
                              $ {availableForInvestment} 
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => handleSave(values)}
                      className="!rounded-full w-full"
                      disabled={isUpdatingTokenization}
                    >
                      {isUpdatingTokenization ? "Saving..." : "Save Draft"}
                    </Button>
                    <Button
                      type="button"
                      variant="gradient"
                      onClick={async () => {
                        // Mark all fields as touched
                        const touchedFields = {
                          totalSupply: true,
                          initialMint: true,
                          tokenPrice: true,
                          initialOwners: values.initialOwners.map(() => ({
                            name: true,
                            email: true,
                            tokenAllocation: true,
                          })),
                        };
                        setTouched(touchedFields);

                        // Validate
                        const validationErrors = await validateForm();

                        // If valid, submit
                        if (Object.keys(validationErrors).length === 0) {
                          handleSubmit(values, { setSubmitting: () => {} });
                        }
                      }}
                      className="!rounded-full w-full"
                      disabled={isUpdatingTokenization}
                    >
                      {isUpdatingTokenization ? "Saving..." : "Continue"}
                    </Button>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      )}
    </div>
  );
}

export default TokenizationDetails;
