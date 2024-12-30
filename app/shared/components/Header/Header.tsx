"use client";

import Link from "next/link";
import Image from "next/image";
import ProfileMenu from "./ProfileMenu";
import { cn } from "@/app/shared/utils/cn";
import ThemeSelector from "./ThemeSelector";
import { usePathname } from "next/navigation";
import LogoMini from "@/public/assets/images/logo-mini.webp";
import type { IUser } from "@/app/shared/interfaces";
import { ShoppingBag } from "../../icons";
import CartMenu from "./CartMenu";

interface IHeader {
  user: IUser | null;
  lng: string;
}

const Header = ({ user, lng }: IHeader) => {
  const pathname = usePathname();
  const isAdmin = user?.role === "ADMIN";

  return (
    <header
      className={cn("fixed z-30 top-0 w-full", isAdmin ? "h-20" : "md:h-20")}
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
            !pathname.startsWith(`/${lng}/admin`) &&
            !pathname.startsWith(`/${lng}/checkout`) && (
              <li className="w-full max-w-2xl hidden md:block">
                {/* <MainSearch id="search-bar" lng={lng} /> */}
                SEARCHBAR
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
                !pathname.startsWith(`/${lng}/admin`) &&
                !pathname.startsWith(`/${lng}/checkout`) && (
                  <li className="flex items-center text-gray-600 dark:text-white">
                    <CartMenu lng={lng} />
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
                    !pathname.startsWith(`/${lng}/checkout`) && (
                      <li>
                        <Link
                          href={`/${lng}/login`}
                          // className="bg-primary-dark dark:bg-primary hover:bg-primary-dark focus:ring-primary hover:text-white text-sm truncate px-4 py-2  rounded-md w-auto transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 border borde-white text-white"
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
          !pathname.startsWith(`/${lng}/admin`) &&
          !pathname.startsWith(`/${lng}/checkout`) && (
            <ul
              className={cn(
                "w-full md:hidden",
                pathname === `/${lng}/search` && "flex gap-2"
              )}
            >
              <li className="w-full">
                {/* <MainSearch id="mobile-search-bar" lng={lng} /> */}
                SEARCHBAR
              </li>
              {pathname === `/${lng}/search` && (
                <li>
                  {/* <FiltersMenu lng={lng} /> */}
                  FILTERS
                </li>
              )}
            </ul>
          )}
      </nav>
    </header>
  );
};

export default Header;
