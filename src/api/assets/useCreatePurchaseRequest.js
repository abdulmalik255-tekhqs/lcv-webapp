import { useMutation } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

const createPurchaseRequest = ({ assetTokenizationId, orderAmount }) => {
  return axiosInstance.post(
    urls.ASSETS.CREATE_PURCHASE_REQUEST(assetTokenizationId),
    { order_amount: orderAmount }
  );
};

export const useCreatePurchaseRequest = () => {
  const mutation = useMutation({
    mutationFn: createPurchaseRequest,
  });

  return mutation;
};

