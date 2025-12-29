import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const cancelInvitation = (id) => {
  return axiosInstance.delete(urls.INVITATIONS.CANCEL(id));
};

export const useCancelInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelInvitation,
    onSuccess: () => {
      // Invalidate invitations query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });
};

