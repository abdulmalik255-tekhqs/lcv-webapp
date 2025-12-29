import { useQuery } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

export const useGetAssetTypes = () => {
  return useQuery({
    queryKey: ["asset-types"],
    queryFn: () => {
      return axiosInstance.get(urls.ASSETS.GET_ASSET_TYPES);
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

