import { useMutation } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

const submitKYC = ({ payload }) => {
  return axiosInstance.post(urls.KYC.SUBMIT, payload);
};

export const useSubmitKYC = () => {
  const mutation = useMutation({
    mutationFn: submitKYC,
  });

  return mutation;
};

