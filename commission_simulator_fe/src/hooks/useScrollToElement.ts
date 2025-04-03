import { useCallback } from "react";

/**
 * Hook personalizado para hacer scroll a un elemento específico
 */
export const useScrollToElement = () => {
  const scrollToElement = useCallback(
    (element: HTMLElement | null, offset = 50) => {
      if (!element) return;

      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    },
    []
  );

  return scrollToElement;
};
