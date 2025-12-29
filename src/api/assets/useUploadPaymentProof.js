import { useMutation } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

const uploadPaymentProof = ({ purchaseRequestId, file }) => {
  const formData = new FormData();
  formData.append("file", file);

  return axiosInstance.put(
    `/purchase-request/${purchaseRequestId}/payment-proof`,
    formData
  );
};

export const useUploadPaymentProof = () => {
  const mutation = useMutation({
    mutationFn: uploadPaymentProof,
  });

  return mutation;
};

