import { useQuery } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

export const useGetAssetDetails = (assetId) => {
  // Ensure assetId is valid (not null, undefined, or empty string)
  const isValidAssetId = assetId != null && assetId !== "" && 
    (typeof assetId === "string" ? assetId.trim() !== "" : true);
  
  return useQuery({
    queryKey: ["asset-details", assetId],
    queryFn: () => {
      return axiosInstance.get(urls.ASSETS.GET_ASSET_DETAILS(assetId));
    },
    enabled: isValidAssetId, // Only run query if assetId exists and is valid
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Always refetch when component mounts
    staleTime: 0, // Consider data stale immediately to ensure fresh fetch on every load
    retry: 1,
  });
};

