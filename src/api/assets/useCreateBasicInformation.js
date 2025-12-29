import { useMutation } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

const createBasicInformation = ({ payload }) => {
  return axiosInstance.post(urls.ASSETS.CREATE_BASIC_INFORMATION, payload);
};

export const useCreateBasicInformation = () => {
  const mutation = useMutation({
    mutationFn: createBasicInformation,
  });

  return mutation;
};

