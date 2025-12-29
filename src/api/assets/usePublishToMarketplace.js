import { useMutation } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

const publishToMarketplace = (assetTokenizationId) => {
  return axiosInstance.get(
    `/tokenized-assets/${assetTokenizationId}/published`
  );
};

export const usePublishToMarketplace = () => {
  const mutation = useMutation({
    mutationFn: publishToMarketplace,
  });

  return mutation;
};

