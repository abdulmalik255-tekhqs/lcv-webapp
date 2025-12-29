import { useMutation } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

const updateInitialOwner = ({ assetId, payload }) => {
  return axiosInstance.put(urls.ASSETS.UPDATE_INITIAL_OWNER(assetId), payload);
};

export const useUpdateInitialOwner = () => {
  const mutation = useMutation({
    mutationFn: updateInitialOwner,
  });

  return mutation;
};

