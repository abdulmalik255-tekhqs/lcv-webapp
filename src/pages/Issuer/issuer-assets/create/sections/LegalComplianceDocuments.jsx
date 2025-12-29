import { useState, useRef, useEffect } from "react";
import { FaPlus, FaMinus, FaCheck } from "react-icons/fa6";
import { Button } from "@/components/shared";
import { useUpdateAssetFiles, useDeleteAssetFile } from "@/api";
import useToast from "@/hooks/useCustomToast";
import { Formik, Form } from "formik";
import { legalComplianceSchema } from "../utils/validationSchemas";

const MAX_DOCUMENTS = 10;

function LegalComplianceDocuments({
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
  const { mutate: updateAssetFiles, isPending: isUploading } =
    useUpdateAssetFiles();
  const { mutate: deleteAssetFile, isPending: isDeleting } =
    useDeleteAssetFile();

  const [localData, setLocalData] = useState({
    documents: formData.documents || [],
  });
  const [deletingFileId, setDeletingFileId] = useState(null);

  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Sync localData with formData when formData.documents changes (e.g., when editing)
  useEffect(() => {
    if (formData.documents && formData.documents.length > 0) {
      setLocalData((prev) => {
        // Only update if documents are different to avoid unnecessary updates
        const currentDocIds = prev.documents
          .map((d) => d.id)
          .filter(Boolean)
          .sort()
          .join(",");
        const newDocIds = formData.documents
          .map((d) => d.id)
          .filter(Boolean)
          .sort()
          .join(",");

        if (currentDocIds !== newDocIds) {
          return { documents: formData.documents };
        }
        return prev;
      });
    }
  }, [formData.documents]);

  const handleFileChange = (e, setFieldValue) => {
    const files = Array.from(e.target.files);
    const totalDocuments = localData.documents.length + files.length;

    if (totalDocuments > MAX_DOCUMENTS) {
      showErrorToast(`Maximum ${MAX_DOCUMENTS} documents allowed`);
      return;
    }

    if (!currentAssetId) {
      showErrorToast("Please complete the previous sections first");
      return;
    }

    // Create document data for all files with unique upload IDs
    const documentsToAdd = files.map((file) => {
      const uploadId = `${file.name}-${Date.now()}-${Math.random()}`;
      return {
        file,
        uploadId,
        title: file.name.replace(/\.[^/.]+$/, "").replace(/-/g, " "),
        filename: file.name,
        size: file.size,
        status: "uploading",
        id: null,
        url: null,
      };
    });

    // Add all documents to local state immediately with uploading status
    setLocalData((prev) => {
      const updated = {
        ...prev,
        documents: [...prev.documents, ...documentsToAdd],
      };
      setFieldValue("documents", updated.documents);
      return updated;
    });

    // Upload all files in a single API call if multiple files, otherwise single
    const uploadType = files.length > 1 ? "multiple" : "single";

    updateAssetFiles(
      {
        assetId: currentAssetId,
        slug: "documents",
        type: uploadType,
        files: files.length > 1 ? files : undefined,
        file: files.length === 1 ? files[0] : undefined,
      },
      {
        onSuccess: (response) => {
          // Handle response - could be single object or array
          const responses = Array.isArray(response) ? response : [response];

          // Update documents with API responses
          setLocalData((prev) => {
            const uploadIds = documentsToAdd.map((d) => d.uploadId);
            let responseIndex = 0;

            const updatedDocuments = prev.documents.map((doc) => {
              if (
                uploadIds.includes(doc.uploadId) &&
                doc.status === "uploading"
              ) {
                // Get response for this file (assuming responses are in same order as files)
                const apiResponse =
                  responseIndex < responses.length
                    ? responses[responseIndex]
                    : null;
                responseIndex++;

                if (apiResponse) {
                  return {
                    ...doc,
                    status: "completed",
                    id: apiResponse.id || null,
                    url: apiResponse.url || null,
                    updated_at: apiResponse.updated_at || null,
                  };
                }
                // If no response available, mark as completed anyway (shouldn't happen normally)
                return {
                  ...doc,
                  status: "completed",
                };
              }
              return doc;
            });

            const updated = { ...prev, documents: updatedDocuments };
            // Update form data after successful upload
            setFieldValue("documents", updatedDocuments);
            updateFormData("legalCompliance", updated);
            return updated;
          });

          const successMessage =
            files.length > 1
              ? `${files.length} documents uploaded successfully`
              : "Document uploaded successfully";
          showSuccessToast(successMessage);
        },
        onError: (error) => {
          // Remove all failed documents from list
          const uploadIds = documentsToAdd.map((d) => d.uploadId);
          setLocalData((prev) => {
            const updated = {
              ...prev,
              documents: prev.documents.filter(
                (doc) => !uploadIds.includes(doc.uploadId)
              ),
            };
            setFieldValue("documents", updated.documents);
            return updated;
          });
          showErrorToast(
            error?.response?.data?.message || "Failed to upload documents"
          );
        },
      }
    );

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveDocument = (index, setFieldValue) => {
    const document = localData.documents[index];

    // If document has an ID, it's already uploaded to the server - delete it via API
    if (document.id && currentAssetId) {
      setDeletingFileId(document.id);
      deleteAssetFile(
        {
          assetId: currentAssetId,
          fileId: document.id,
        },
        {
          onSuccess: () => {
            // Remove document from local state after successful deletion
            const updated = {
              ...localData,
              documents: localData.documents.filter((_, i) => i !== index),
            };
            setLocalData(updated);
            setFieldValue("documents", updated.documents);
            updateFormData("legalCompliance", updated);
            setDeletingFileId(null);
            showSuccessToast("Document deleted successfully");
          },
          onError: (error) => {
            setDeletingFileId(null);
            showErrorToast(
              error?.response?.data?.message || "Failed to delete document"
            );
          },
        }
      );
    } else {
      // Document is not yet uploaded (still uploading or just added) - just remove from local state
      const updated = {
        ...localData,
        documents: localData.documents.filter((_, i) => i !== index),
      };
      setLocalData(updated);
      setFieldValue("documents", updated.documents);
      updateFormData("legalCompliance", updated);
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
          Legal & Compliance Documents
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
            documents: localData.documents || [],
          }}
          validationSchema={legalComplianceSchema}
          onSubmit={(values) => {
            // Update form data with current local state
            updateFormData("legalCompliance", { documents: values.documents });
            onNext();
          }}
          enableReinitialize
        >
          {({ values, errors, touched, setFieldValue, setFieldTouched, validateForm, setTouched }) => (
            <Form>
              <div className="space-y-8 mt-4 px-2">
                {/* Supporting Documents Section */}
                <div className="space-y-3">
                  {touched.documents && errors.documents && (
                    <div className="text-xs font-medium text-red-500">
                      {errors.documents}
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <h4 className="text-sm font-semibold text-[#000]">
                        Supporting Documents
                      </h4>
                      <p className="text-xs text-[#48484A] font-normal">
                        Upload required legal and compliance documents including:
                        articles of incorporation, board authorizations, share
                        descriptions, financial statements, business valuations,
                        operating agreements, cap table, and any relevant licenses or
                        permits.
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Button
                        type="button"
                        variant="upload"
                        onClick={() => fileInputRef.current?.click()}
                        className="!rounded-full text-sm px-4 py-1.5"
                        icon={<FaPlus />}
                        iconPosition="left"
                        disabled={isUploading || !currentAssetId}
                        loading={isUploading}
                      >
                        Add Document
                      </Button>
                      <span className="text-xs text-[#AEAEB2]">
                        Max: {MAX_DOCUMENTS} documents
                      </span>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={(e) => handleFileChange(e, setFieldValue)}
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                  />
                </div>

                {/* Uploaded Documents List */}
                {localData.documents.length > 0 && (
                  <div className="space-y-3">
                    {localData.documents.map((doc, index) => (
                      <div
                        key={doc.id || doc.uploadId || index}
                        className="bg-[#FAFAFC] border border-[#E5E5EA] rounded-lg p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {/* Status Icon */}
                          <div
                            className={`flex-shrink-0 w-6 h-6 rounded-full border border-[#E5E5EA] !bg-white flex items-center justify-center ${
                              doc.status === "uploading" ? "animate-pulse" : ""
                            }`}
                          >
                            <FaCheck className="w-3 h-3 text-green-700" />
                          </div>
                          {/* Document Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#000] truncate">
                              {doc.title}
                            </p>
                            <p className="text-xs text-[#48484A] truncate">
                              {doc.filename}
                              {doc.size && `, ${formatFileSize(doc.size)}`}
                              {/* {doc.status === "uploading" && " (Uploading...)"} */}
                            </p>
                          </div>
                        </div>
                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveDocument(index, setFieldValue)}
                          className="flex-shrink-0 text-[#D70015] font-semibold hover:text-red-700 text-[13px] font-semibold ml-4 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={
                            doc.status === "uploading" ||
                            (isDeleting && deletingFileId === doc.id)
                          }
                        >
                          {isDeleting && deletingFileId === doc.id
                            ? "Deleting..."
                            : "Remove"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex w-full gap-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      // Update form data with current local state
                      updateFormData("legalCompliance", localData);
                      onSaveDraft();
                    }}
                    className="!rounded-full w-full"
                    disabled={isUploading}
                  >
                    Save Draft
                  </Button>
                  <Button
                    type="button"
                    variant="gradient"
                    onClick={async () => {
                      // Mark documents as touched
                      setFieldTouched("documents", true);

                      // Validate
                      const validationErrors = await validateForm();
                      
                      // If valid, proceed
                      if (Object.keys(validationErrors).length === 0) {
                        updateFormData("legalCompliance", localData);
                        onNext();
                      }
                    }}
                    className="!rounded-full w-full"
                    disabled={isUploading}
                    // loading={isUploading}
                  >
                    Continue
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

export default LegalComplianceDocuments;
