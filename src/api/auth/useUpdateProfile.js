import { useMutation, useQueryClient } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

const updateProfile = (data) => {
  return axiosInstance.put(urls.AUTH.UPDATE_PROFILE, data);
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (response) => {
      // Update the query cache immediately with the response data
      // Response is directly the user object: { id, first_name, last_name, email, profile_pic, ... }
      queryClient.setQueryData(["profile"], response);
      // Also invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export default useUpdateProfile;

