import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";
import { useMutation } from "@tanstack/react-query";

export const useSignupOtpRequest = () => {
  return useMutation({
    mutationFn: (data) => {
      return axiosInstance.post(urls.AUTH.SIGNUP_OTP_REQUEST, data);
    },
  });
};

export const useSignupOtpVerify = () => {
  return useMutation({
    mutationFn: (data) => {
      return axiosInstance.post(urls.AUTH.SIGNUP_OTP_VERIFY, data);
    },
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: (data) => {
      return axiosInstance.post(urls.AUTH.SIGNUP, data);
    },
  });
};

