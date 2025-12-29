import { useMutation, useQueryClient } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

const updateProfilePic = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  // For FormData, axios will automatically set Content-Type with boundary
  // The axiosInstance interceptor now skips setting Content-Type for FormData
  return axiosInstance.put(urls.AUTH.UPDATE_PROFILE_PIC, formData);
};

export const useUpdateProfilePic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfilePic,
    onSuccess: (response) => {
      // Update the query cache immediately with the response data
      // Response is directly the user object: { id, first_name, last_name, email, profile_pic, ... }
      queryClient.setQueryData(["profile"], response);
      // Also invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export default useUpdateProfilePic;

