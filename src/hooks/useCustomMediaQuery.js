import { useMediaQuery } from "react-responsive";

export function useMediaQueries() {
  const isMobile = useMediaQuery({ query: "(max-width: 48em)" }); // Equivalent to 768px
  const isMedium = useMediaQuery({
    query: "(min-width: 48.0625em) and (max-width: 62.5em)",
  }); // 769px to 1000px (Medium Laptop)
  const isLarge = useMediaQuery({
    query: "(min-width: 62.5625em) and (max-width: 75em)",
  }); // 1001px to 1200px (Large Laptop)
  const isXL = useMediaQuery({
    query: "(min-width: 75.0625em) and (max-width: 125em)",
  }); // 1201px to 2000px (Extra Large Laptop)
  const isXXL = useMediaQuery({ query: "(min-width: 125.0625em)" }); // 2001px and above (4K Screens)

  return {
    isMobile,
    isMedium,
    isLarge,
    isXL,
    isXXL,
  };
}
