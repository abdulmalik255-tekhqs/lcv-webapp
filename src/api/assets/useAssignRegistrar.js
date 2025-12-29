import { useMutation } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

const assignRegistrar = ({ assetTokenizationId, userId }) => {
  return axiosInstance.get(
    urls.ASSETS.ASSIGN_REGISTRAR(assetTokenizationId, userId)
  );
};

export const useAssignRegistrar = () => {
  return useMutation({
    mutationFn: assignRegistrar,
  });
};

