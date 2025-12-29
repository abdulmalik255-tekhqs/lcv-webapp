import { useMutation } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

const updatePassword = (data) => {
  return axiosInstance.put(urls.AUTH.UPDATE_PASSWORD, data);
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: updatePassword,
  });
};

export default useUpdatePassword;

