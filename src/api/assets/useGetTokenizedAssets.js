import { useQuery } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

export const useGetTokenizedAssets = () => {
  return useQuery({
    queryKey: ["tokenized-assets"],
    queryFn: () => {
      return axiosInstance.get(urls.ASSETS.GET_TOKENIZED_ASSETS);
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 1,
  });
};

