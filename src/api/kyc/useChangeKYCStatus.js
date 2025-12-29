import { useMutation, useQueryClient } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

const changeKYCStatus = (data) => {
  return axiosInstance.put(urls.KYC.CHANGE_STATUS, data);
};

export const useChangeKYCStatus = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: changeKYCStatus,
    onSuccess: () => {
      // Invalidate all KYC users queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["kyc-users"] });
    },
  });

  return mutation;
};

