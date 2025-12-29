import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";
import { useMutation } from "@tanstack/react-query";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data) => {
      return axiosInstance.post(urls.AUTH.FORGOT_PASSWORD, data);
    },
  });
};

export const useForgotPasswordVerifyOtp = () => {
  return useMutation({
    mutationFn: (data) => {
      return axiosInstance.post(urls.AUTH.FORGOT_PASSWORD_VERIFY_OTP, data);
    },
  });
};

export const useForgotPasswordConfirm = () => {
  return useMutation({
    mutationFn: (data) => {
      return axiosInstance.put(urls.AUTH.FORGOT_PASSWORD_CONFIRM, data);
    },
  });
};

