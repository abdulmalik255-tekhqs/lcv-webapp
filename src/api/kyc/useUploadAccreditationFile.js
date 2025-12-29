import { useMutation } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

const uploadAccreditationFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  console.log("Uploading accreditation file:", {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    url: urls.KYC.UPLOAD_ACCREDITATION_FILE,
  });

  return axiosInstance.put(urls.KYC.UPLOAD_ACCREDITATION_FILE, formData);
};

export const useUploadAccreditationFile = () => {
  const mutation = useMutation({
    mutationFn: uploadAccreditationFile,
  });

  return mutation;
};

