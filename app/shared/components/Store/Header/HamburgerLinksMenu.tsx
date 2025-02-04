import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/app/shared/utils/cn";
import CollectionsMenu from "./CollectionsMenu";
import { BarsII, XMark } from "@/app/shared/icons";
import { useDisableScroll } from "@/app/shared/hooks";
import type { ICollection } from "@/app/shared/interfaces";

interface IHamburgerLinksMenu {
  lng: string;
  collections: ICollection[];
}

const HamburgerLinksMenu = ({ lng, collections }: IHamburgerLinksMenu) => {
  const [isOpen, setIsOpen] = useState(false);

  useDisableScroll(isOpen);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button onClick={toggleMenu}>
        <BarsII />
      </button>
      <div
        className={cn(
          "bg-white dark:bg-gray-800 fixed top-0 left-0 h-screen w-64 shadow-lg transform transition-transform z-40",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full p-4 flex flex-col gap-8">
          <div className="flex justify-between items-center gap-2">
            <div className="rounded-full bg-white w-[50px] h-[50px] min-w-[50px] min-h-[50px]">
              <Link href={`/${lng}`}>
                <Image
                  width={50}
                  height={50}
                  alt="Peques logo"
                  src="/assets/images/logo-mini.webp"
                  className="size-full object-cover rounded-full"
                />
              </Link>
            </div>
            <button onClick={toggleMenu} aria-label="Close Cart">
              <XMark />
            </button>
          </div>
          <ul className="flex flex-col gap-4">
            <li className="mx-2">
              <Link href={`/${lng}`} onClick={toggleMenu}>
                <p className="cursor-pointer text-black font-extralight hover:underline">
                  INICIO
                </p>
              </Link>
            </li>
            <li className="relative inline-block group mx-2">
              <CollectionsMenu
                lng={lng}
                collections={collections}
                onParentClose={toggleMenu}
              />
            </li>
          </ul>
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 h-screen"
          onClick={toggleMenu}
        ></div>
      )}
    </>
  );
};

export default HamburgerLinksMenu;
