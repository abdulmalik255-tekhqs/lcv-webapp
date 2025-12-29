import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";

const cancelPurchaseRequest = (purchaseRequestId) => {
  return axiosInstance.delete(
    `/purchase-request/${purchaseRequestId}/cancel-order`
  );
};

export const useCancelPurchaseRequest = () => {
  const mutation = useMutation({
    mutationFn: cancelPurchaseRequest,
  });

  return mutation;
};

