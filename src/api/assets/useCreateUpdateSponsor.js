import { useMutation } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

const createUpdateSponsor = ({ assetTokenizationId, payload }) => {
  return axiosInstance.post(
    urls.ASSETS.CREATE_UPDATE_SPONSOR(assetTokenizationId),
    payload
  );
};

export const useCreateUpdateSponsor = () => {
  const mutation = useMutation({
    mutationFn: createUpdateSponsor,
  });

  return mutation;
};

