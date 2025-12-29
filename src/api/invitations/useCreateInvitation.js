import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const createInvitation = (invitationData) => {
  return axiosInstance.post(urls.INVITATIONS.CREATE, invitationData);
};

export const useCreateInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInvitation,
    onSuccess: () => {
      // Invalidate invitations query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });
};

