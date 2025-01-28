"use client";

import Link from "next/link";
import { XMark } from "@/app/shared/icons";
import { useDisableScroll } from "@/app/shared/hooks";
import { useCallback, useEffect, useRef, useState } from "react";

const InitialModal = ({ lng }: { lng: string }) => {
  const menuRef = useRef(null);
  const [isOpen, setIsOpen] = useState(true);

  useDisableScroll(isOpen);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        menuRef.current &&
        !(menuRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    },
    [setIsOpen]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  if (!isOpen) return null;

  return (
    <div className="fixed flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-75 inset-0 z-50">
      <div
        ref={menuRef}
        className="relative bg-accent-light dark:bg-neutral rounded-lg shadow-lg dark:shadow-gray-900 w-[80%] md:w-1/2 h-auto max-h-[80%] overflow-y-auto overflow-x-hidden flex flex-col lg:flex-row gap-2"
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300 z-50"
        >
          <XMark />
        </button>
        <div
          className="w-full h-52 lg:h-auto lg:w-1/2 bg-cover bg-center bg-no-repeat "
          style={{
            backgroundImage: "url('/assets/images/initialPicture.webp')",
          }}
        />
        <div className="relative flex flex-col justify-center p-4 lg:p-8 w-full lg:w-1/2">
          <div className="m-5">
            <h1 className="text-center text-xl md:text-4xl font-bold">
              Aprovecha el 10% en tu primera compra
            </h1>
            <p className="text-center text-lg md:text-2xl my-4">
              Regístrate y usa el código <strong>BIENVENIDO10</strong> en tu
              primera compra.
            </p>
            <div className="text-center">
              <Link
                href={`/${lng}/register`}
                className="link-button-primary text-lg md:text-2xl"
              >
                Regístrate
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialModal;
