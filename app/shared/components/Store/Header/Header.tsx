"use client";

import Link from "next/link";
import Image from "next/image";
import CartMenu from "./CartMenu";
import MainSearch from "./MainSearch";
import ProfileMenu from "./ProfileMenu";
import FiltersMenu from "./FiltersMenu";
import { cn } from "@/app/shared/utils/cn";
import ThemeSelector from "./ThemeSelector";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LogoMini from "@/public/assets/images/logo-mini.webp";
import type { IProduct, IUser } from "@/app/shared/interfaces";

interface IHeader {
  lng: string;
  user: IUser | null;
  products: IProduct[];
}

const Header = ({ lng, user, products }: IHeader) => {
  const pathname = usePathname();
  const isAdmin = user?.role === "ADMIN";
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (isAdmin) {
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Oculta el header al hacer scroll down
        setIsVisible(false);
      } else {
        // Muestra el header al hacer scroll up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY, isAdmin]);

  return (
    <header
      className={cn(
        "fixed z-30 top-0 w-full transition-transform duration-300",
        isAdmin ? "h-20" : "md:h-20",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <nav className="h-full flex flex-col md:flex-row items-center p-4 gap-4 mx-auto bg-primary dark:bg-neutral text-neutral dark:text-primary-light">
        <ul className="w-full flex justify-between items-center gap-4">
          <li className="rounded-full bg-white">
            <Link href={isAdmin ? `/${lng}/admin/home` : `/${lng}`}>
              <Image
                className="h-full max-h-[50px] w-auto rounded-full"
                src={LogoMini}
                alt="Peques logo mini"
                priority
              />
            </Link>
          </li>
          {pathname !== `/${lng}/login` &&
            pathname !== `/${lng}/register` &&
            pathname !== `/${lng}/reset-password` &&
            pathname !== `/${lng}/password-recovery` &&
            !pathname.startsWith(`/${lng}/admin`) &&
            !pathname.startsWith(`/${lng}/checkout`) && (
              <li className="w-full max-w-2xl hidden md:block">
                <MainSearch id="search-bar" lng={lng} />
              </li>
            )}
          <li>
            <ul className="flex items-center gap-2">
              <li className="flex items-center">
                <ThemeSelector />
              </li>
              {!isAdmin &&
                pathname !== `/${lng}/login` &&
                pathname !== `/${lng}/register` &&
                pathname !== `/${lng}/reset-password` &&
                pathname !== `/${lng}/password-recovery` &&
                !pathname.startsWith(`/${lng}/admin`) &&
                !pathname.startsWith(`/${lng}/checkout`) && (
                  <li className="flex items-center text-gray-600 dark:text-white">
                    <CartMenu lng={lng} products={products} />
                  </li>
                )}
              {user && !pathname.startsWith(`/${lng}/checkout`) ? (
                <li className="flex items-center">
                  <ProfileMenu lng={lng} user={user} />
                </li>
              ) : (
                <>
                  {pathname !== `/${lng}/login` &&
                    pathname !== `/${lng}/register` &&
                    pathname !== `/${lng}/reset-password` &&
                    pathname !== `/${lng}/password-recovery` &&
                    !pathname.startsWith(`/${lng}/checkout`) && (
                      <li>
                        <Link
                          href={`/${lng}/login`}
                          className="link-button-primary"
                        >
                          {lng === "en" ? "Log in" : "Ingresa"}
                        </Link>
                      </li>
                    )}
                </>
              )}
            </ul>
          </li>
        </ul>
        {!isAdmin &&
          pathname !== `/${lng}/login` &&
          pathname !== `/${lng}/register` &&
          pathname !== `/${lng}/reset-password` &&
          pathname !== `/${lng}/password-recovery` &&
          !pathname.startsWith(`/${lng}/admin`) &&
          !pathname.startsWith(`/${lng}/checkout`) && (
            <ul
              className={cn(
                "w-full md:hidden",
                pathname === `/${lng}/search` && "flex gap-2"
              )}
            >
              <li className="w-full">
                <MainSearch id="mobile-search-bar" lng={lng} />
              </li>
              {pathname === `/${lng}/search` && (
                <li>
                  <FiltersMenu lng={lng} />
                </li>
              )}
            </ul>
          )}
      </nav>
    </header>
  );
};

export default Header;
