import { useMutation } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

const updateTokenizationDetails = ({ assetId, payload }) => {
  return axiosInstance.put(urls.ASSETS.UPDATE_TOKENIZATION_DETAILS(assetId), payload);
};

export const useUpdateTokenizationDetails = () => {
  const mutation = useMutation({
    mutationFn: updateTokenizationDetails,
  });

  return mutation;
};

