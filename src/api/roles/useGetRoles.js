import { useQuery } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

export const useGetRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: () => {
      return axiosInstance.get(urls.ROLES.GET);
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

