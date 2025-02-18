"use client";

import Link from "next/link";
import Image from "next/image";
import { XMark } from "@/app/shared/icons";
import { useDisableScroll } from "@/app/shared/hooks";
import { useCallback, useEffect, useRef, useState } from "react";

const InitialModal = ({ lng }: { lng: string }) => {
  const menuRef = useRef(null);
  const [isOpen, setIsOpen] = useState(true);
  const [delayedOpen, setDelayedOpen] = useState(false);

  useDisableScroll(isOpen);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayedOpen(true);
      setIsOpen(true);
    }, 10000); // 10 segundos

    return () => clearTimeout(timer);
  }, []);

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

  if (!delayedOpen || !isOpen) return null;

  return (
    <div className="fixed flex items-center justify-center bg-black bg-opacity-50 inset-0 z-50">
      <div
        ref={menuRef}
        className="relative bg-accent/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg max-w-lg text-center w-[80%] md:w-1/2 mt-16"
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-50"
        >
          <XMark />
        </button>
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
          <Image
            width={96}
            height={96}
            alt="Initial Picture"
            src="/assets/images/initialPicture.webp"
            className="w-36 h-36 object-cover rounded-full"
          />
        </div>
        <div className="mt-20">
          <h2 className="text-lg font-semibold">Welcome to the family!</h2>
          <p className="">
            Aprovecha 10% de descuento registrándote y usando el código:
          </p>
          <p className="text-lg font-bold text-gray-900 mt-1">WELCOME10</p>
          <div className="text-center mt-4">
            <Link
              href={`/${lng}/register`}
              className="px-4 py-2 bg-accent-light rounded-md text-lg"
            >
              {"Let's go!"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialModal;
