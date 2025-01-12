import { useState, useCallback, useRef, useEffect } from "react";

interface UseToggleMenu<T = HTMLElement> {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  ref: React.RefObject<T>;
}
export const useToggleMenu = <T extends HTMLElement>(): UseToggleMenu<T> => {
  const ref = useRef<T>(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Si el clic fue en un elemento que tiene el atributo `data-ignore-outside-click`, ignóralo
      if (target.closest("[data-ignore-outside-click]")) {
        return;
      }

      // Si el clic fue fuera del elemento referenciado, cierra el menú
      if (ref.current && !ref.current.contains(target)) {
        close();
      }
    },
    [close]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return { isOpen, toggle, open, close, ref };
};
