import { useMutation } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

const mintPurchaseRequest = (purchaseRequestId) => {
  return axiosInstance.put(urls.ASSETS.MINT_PURCHASE_REQUEST(purchaseRequestId));
};

export const useMintPurchaseRequest = () => {
  const mutation = useMutation({
    mutationFn: mintPurchaseRequest,
  });

  return mutation;
};

