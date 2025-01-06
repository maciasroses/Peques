"use client";

import { cn } from "@/app/shared/utils/cn";
import { XMark } from "@/app/shared/icons";
import { useCallback, useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  isAdminView?: boolean;
}

const Modal = ({
  isOpen,
  onClose,
  children,
  isAdminView = true,
}: ModalProps) => {
  const menuRef = useRef(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        menuRef.current &&
        !(menuRef.current as HTMLElement).contains(event.target as Node)
      ) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-75 mt-20 inset-0 z-10",
        isAdminView && "sm:ml-48"
      )}
    >
      <div
        className="relative bg-accent-light dark:bg-neutral p-8 rounded-lg shadow-lg dark:shadow-gray-900 w-[80%] md:w-1/2 h-auto max-h-[80%] overflow-y-auto overflow-x-hidden"
        ref={menuRef}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300"
        >
          <XMark />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
