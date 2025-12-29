import { useMutation } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

const updateAssetFiles = ({ assetId, slug, type, file, files }) => {
  const formData = new FormData();
  
  // If multiple files are provided, append all of them
  if (files && Array.isArray(files) && files.length > 0) {
    files.forEach((fileItem) => {
      formData.append("file", fileItem);
    });
  } else if (file) {
    // Single file upload
    formData.append("file", file);
  }

  // For FormData, axios will automatically set Content-Type with boundary
  return axiosInstance.put(
    urls.ASSETS.UPDATE_ASSET_FILES(assetId, slug, type),
    formData
  );
};

export const useUpdateAssetFiles = () => {
  const mutation = useMutation({
    mutationFn: updateAssetFiles,
  });

  return mutation;
};

