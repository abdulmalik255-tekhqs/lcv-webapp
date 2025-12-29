import { useMutation } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

const deleteAssetFile = ({ assetId, fileId }) => {
  return axiosInstance.delete(urls.ASSETS.DELETE_ASSET_FILE(assetId, fileId));
};

export const useDeleteAssetFile = () => {
  const mutation = useMutation({
    mutationFn: deleteAssetFile,
  });

  return mutation;
};

