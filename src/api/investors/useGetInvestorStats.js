import { useQuery } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

export const useGetInvestorStats = () => {
  return useQuery({
    queryKey: ["investor-stats"],
    queryFn: () => {
      return axiosInstance.get(urls.INVESTORS.GET_STATS);
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 1,
  });
};

