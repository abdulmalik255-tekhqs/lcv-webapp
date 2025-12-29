import { useMutation } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

const updateFinancialDetails = ({ assetId, payload }) => {
  return axiosInstance.put(urls.ASSETS.UPDATE_FINANCIAL_DETAILS(assetId), payload);
};

export const useUpdateFinancialDetails = () => {
  const mutation = useMutation({
    mutationFn: updateFinancialDetails,
  });

  return mutation;
};

