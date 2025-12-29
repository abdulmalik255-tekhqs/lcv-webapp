import { useMutation } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

const deleteSponsor = ({ assetTokenizationId, sponsorId }) => {
  return axiosInstance.delete(
    urls.ASSETS.DELETE_SPONSOR(assetTokenizationId, sponsorId)
  );
};

export const useDeleteSponsor = () => {
  const mutation = useMutation({
    mutationFn: deleteSponsor,
  });

  return mutation;
};

