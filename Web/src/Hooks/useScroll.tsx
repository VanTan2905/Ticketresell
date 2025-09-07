import { useEffect, useState } from "react";

export const useScroll = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    setIsScrolled(scrollPosition > 10);
  };

  useEffect(() => {
    // Set the initial scroll state
    handleScroll(); // This will set the initial state based on the current scroll position

    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  return isScrolled;
};
