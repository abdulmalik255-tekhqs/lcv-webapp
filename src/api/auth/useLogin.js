import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { persistAuth } from "@/utils/storage";

const login = (loginData) => {
  return axiosInstance.post(urls.AUTH.SIGNIN, loginData);
};

export const useLogin = () => {
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Store auth data in localStorage
      persistAuth({
        access_token: data.access_token,
        user: data.user,
        role: data.role,
        kyc_status: data.kyc_status,
      });
    },
  });

  return mutation;
};
