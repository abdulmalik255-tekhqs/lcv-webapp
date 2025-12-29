import { useMutation } from "@tanstack/react-query";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";

const denyAssetTokenization = ({ assetTokenizationId, rejectionRemarks, rejectionReason }) => {
  return axiosInstance.post(
    urls.ASSETS.DENY_ASSET(assetTokenizationId),
    {
      rejection_remarks: rejectionRemarks,
      rejection_reason: rejectionReason,
    }
  );
};

export const useDenyAssetTokenization = () => {
  const mutation = useMutation({
    mutationFn: denyAssetTokenization,
  });

  return mutation;
};

