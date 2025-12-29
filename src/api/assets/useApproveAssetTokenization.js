import { useMutation } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

const approveAssetTokenization = (assetTokenizationId) => {
  return axiosInstance.get(urls.ASSETS.APPROVE_ASSET(assetTokenizationId));
};

export const useApproveAssetTokenization = () => {
  const mutation = useMutation({
    mutationFn: approveAssetTokenization,
  });

  return mutation;
};

