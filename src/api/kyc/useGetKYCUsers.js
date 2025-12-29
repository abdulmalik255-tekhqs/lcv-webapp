import { useQuery } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

export const useGetKYCUsers = (status, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["kyc-users", status, page, limit],
    queryFn: async () => {
      if (!status) {
        throw new Error("Status is required");
      }
      const response = await axiosInstance.get(urls.KYC.GET_KYC_USERS(status), {
        params: {
          page,
          limit,
        },
      });
      return response;
    },
    enabled: !!status, // Only run query if status is provided
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 0, // Always consider data stale to ensure fresh fetch
    retry: 1,
  });
};

