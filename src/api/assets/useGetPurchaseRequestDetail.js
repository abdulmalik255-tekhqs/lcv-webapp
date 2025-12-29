import { useQuery } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

export const useGetPurchaseRequestDetail = (purchaseRequestId) => {
  // Ensure purchaseRequestId is valid (not null, undefined, or empty string)
  const isValidId = purchaseRequestId != null && purchaseRequestId !== "" && 
    (typeof purchaseRequestId === "string" ? purchaseRequestId.trim() !== "" : true);
  
  return useQuery({
    queryKey: ["purchase-request-detail", purchaseRequestId],
    queryFn: () => {
      return axiosInstance.get(urls.ASSETS.GET_PURCHASE_REQUEST_DETAIL(purchaseRequestId));
    },
    enabled: isValidId, // Only run query if purchaseRequestId exists and is valid
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Always refetch when component mounts
    staleTime: 0, // Consider data stale immediately to ensure fresh fetch on every load
    retry: 1,
  });
};

