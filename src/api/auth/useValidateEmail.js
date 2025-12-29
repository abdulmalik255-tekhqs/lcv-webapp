import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";
import { useMutation } from "@tanstack/react-query";

export const useValidateEmail = () => {
  return useMutation({
    mutationFn: (data) => {
      return axiosInstance.post(urls.AUTH.VALIDATE_EMAIL, data);
    },
  });
};

