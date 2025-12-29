import { useQuery } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

export const useGetPurchaseRequests = (page = 1, limit = 100) => {
  return useQuery({
    queryKey: ["purchase-requests", page, limit],
    queryFn: () => {
      return axiosInstance.get(urls.ASSETS.GET_PURCHASE_REQUESTS, {
        params: { page, limit },
      });
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 0,
    retry: 1,
  });
};

