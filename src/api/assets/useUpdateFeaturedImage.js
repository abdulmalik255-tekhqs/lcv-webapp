import { useMutation } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

const updateFeaturedImage = ({ assetTokenizationId, type, file }) => {
  const formData = new FormData();
  formData.append("file", file);

  return axiosInstance.put(
    urls.ASSETS.UPDATE_FEATURED_IMAGE(assetTokenizationId, type),
    formData
  );
};

export const useUpdateFeaturedImage = () => {
  const mutation = useMutation({
    mutationFn: updateFeaturedImage,
  });

  return mutation;
};

