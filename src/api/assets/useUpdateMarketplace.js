import { useMutation } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

const updateMarketplace = ({ assetTokenizationId, payload }) => {
  return axiosInstance.put(
    urls.ASSETS.UPDATE_MARKETPLACE(assetTokenizationId),
    payload
  );
};

export const useUpdateMarketplace = () => {
  const mutation = useMutation({
    mutationFn: updateMarketplace,
  });

  return mutation;
};

