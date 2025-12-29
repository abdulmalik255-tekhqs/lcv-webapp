import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";

const getRegistrars = () => {
  return axiosInstance.get("/user/list/registrar");
};

export const useGetRegistrars = () => {
  return useQuery({
    queryKey: ["registrars"],
    queryFn: getRegistrars,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 0,
    retry: 1,
  });
};

