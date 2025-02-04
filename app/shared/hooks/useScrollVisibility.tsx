import { useState, useEffect } from "react";

export const useScrollVisibility = (isAdmin: boolean) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (isAdmin) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsVisible(currentScrollY <= lastScrollY || currentScrollY <= 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isAdmin, lastScrollY]);

  return isVisible;
};
