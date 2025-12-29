import { useMutation } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

const publishAsset = (assetId) => {
  return axiosInstance.get(urls.ASSETS.PUBLISH_ASSET(assetId));
};

export const usePublishAsset = () => {
  const mutation = useMutation({
    mutationFn: publishAsset,
  });

  return mutation;
};

