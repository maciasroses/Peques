"use client";

import { XMark } from "@/app/shared/icons";
import { useDisableScroll } from "@/app/shared/hooks";
import { useCallback, useEffect, useRef } from "react";
import { cn } from "../utils/cn";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  backgroundColor?: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children, backgroundColor }: ModalProps) => {
  const menuRef = useRef(null);

  useDisableScroll(isOpen);

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
    <div className="fixed flex items-center justify-center bg-black bg-opacity-50 inset-0 z-50">
      <div
        className={cn(
          "relative p-8 rounded-lg shadow-lg w-[80%] md:w-1/2 h-auto max-h-[80%] overflow-y-auto overflow-x-hidden",
          backgroundColor || "bg-accent-light"
        )}
        ref={menuRef}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <XMark />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
