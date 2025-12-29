import { useMutation } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

const deleteAccreditationFile = (accreditationFileId) => {
  return axiosInstance.delete(
    urls.KYC.DELETE_ACCREDITATION_FILE(accreditationFileId)
  );
};

export const useDeleteAccreditationFile = () => {
  const mutation = useMutation({
    mutationFn: deleteAccreditationFile,
  });

  return mutation;
};

