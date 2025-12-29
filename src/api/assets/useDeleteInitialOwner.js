import { useMutation } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

const deleteInitialOwner = ({ assetId, ownerId }) => {
  return axiosInstance.delete(urls.ASSETS.DELETE_INITIAL_OWNER(assetId, ownerId));
};

export const useDeleteInitialOwner = () => {
  const mutation = useMutation({
    mutationFn: deleteInitialOwner,
  });

  return mutation;
};

