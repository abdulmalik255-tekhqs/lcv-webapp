import { useQuery } from "@tanstack/react-query";

const fetchCountries = async () => {
  const response = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,flags");
  const data = await response.json();
  // Sort countries alphabetically
  return data.sort((a, b) => a.name.common.localeCompare(b.name.common));
};

export const useGetCountries = () => {
  return useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
};

