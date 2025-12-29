import { useQuery } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

export const useGetInvitations = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["invitations", { page, limit }],
    queryFn: () => {
      return axiosInstance.get(urls.INVITATIONS.GET, {
        params: { page, limit },
      });
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

