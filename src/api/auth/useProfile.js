import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import urls from "@/constants/urls";
import axiosInstance from "../axiosInstance";
import { getStoredToken, getStoredAuth, persistAuth } from "@/utils/storage";

const getProfile = () => {
  return axiosInstance.get(urls.AUTH.PROFILE);
};

export const useProfile = (enabled = true) => {
  const token = getStoredToken();
  const isAuthenticated = !!token;

  const queryResult = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: enabled && isAuthenticated,
  });

  // Sync profile data to localStorage when it's fetched
  useEffect(() => {
    if (queryResult.data && queryResult.data.user) {
      // API returns: { user: {...}, role: "investor" }
      // Save role and updated user data to localStorage
      const currentAuth = getStoredAuth() || {};
      persistAuth({
        ...currentAuth,
        user: queryResult.data.user,
        role: queryResult.data.role || currentAuth.role,
      });
    }
  }, [queryResult.data]);

  return queryResult;
};

export default useProfile;
