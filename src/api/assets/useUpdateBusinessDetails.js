import { useMutation } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

const updateBusinessDetails = ({ assetId, payload }) => {
  return axiosInstance.put(urls.ASSETS.UPDATE_BUSINESS_DETAILS(assetId), payload);
};

export const useUpdateBusinessDetails = () => {
  const mutation = useMutation({
    mutationFn: updateBusinessDetails,
  });

  return mutation;
};

