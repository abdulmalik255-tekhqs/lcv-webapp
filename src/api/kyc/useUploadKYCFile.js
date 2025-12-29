import { useMutation } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

const uploadKYCFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  // Upload file using the /user/upload endpoint
  return axiosInstance.put(urls.AUTH.UPLOAD_FILE, formData);
};

export const useUploadKYCFile = () => {
  const mutation = useMutation({
    mutationFn: uploadKYCFile,
  });

  return mutation;
};

