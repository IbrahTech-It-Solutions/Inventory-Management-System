import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollContainer = document.querySelector<HTMLElement>(
      "[data-scroll-container]",
    );

    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });

      return;
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;