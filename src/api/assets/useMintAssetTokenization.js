import { useMutation } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

const mintAssetTokenization = (assetTokenizationId) => {
  return axiosInstance.get(urls.ASSETS.MINT_ASSET(assetTokenizationId));
};

export const useMintAssetTokenization = () => {
  const mutation = useMutation({
    mutationFn: mintAssetTokenization,
  });

  return mutation;
};

