"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import CartMenu from "./CartMenu";
import MainSearch from "./MainSearch";
import ProfileMenu from "./ProfileMenu";
import FiltersMenu from "./FiltersMenu";
import ThemeSelector from "./ThemeSelector";
import CollectionsMenu from "./CollectionsMenu";
import HamburgerLinksMenu from "./HamburgerLinksMenu";

import { cn } from "@/app/shared/utils/cn";
import { Search, UserIcon } from "@/app/shared/icons";
import { useScrollVisibility, useToggleMenu } from "@/app/shared/hooks";
import type { IUser, IProduct, ICollection } from "@/app/shared/interfaces";

interface IHeader {
  lng: string;
  user: IUser | null;
  products: IProduct[];
  collections: ICollection[];
}

const Header = ({ lng, user, products, collections }: IHeader) => {
  const pathname = usePathname();
  const isAdmin = user?.role === "ADMIN";

  const {
    ref: searchBarRef,
    isOpen: isSearchBarOpen,
    toggle: toggleSearchBar,
  } = useToggleMenu<HTMLUListElement>();

  const isVisible = useScrollVisibility(isAdmin);

  const isAuthPage = [
    `/${lng}/login`,
    `/${lng}/register`,
    `/${lng}/reset-password`,
    `/${lng}/password-recovery`,
  ].includes(pathname);
  const isCheckoutOrAdmin =
    pathname.startsWith(`/${lng}/admin`) ||
    pathname.startsWith(`/${lng}/checkout`);
  const shouldShowMenus = !isAdmin && !isAuthPage && !isCheckoutOrAdmin;

  return (
    <header
      className={cn(
        "fixed z-30 top-0 w-full transition-transform duration-300",
        isAdmin && "h-20",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <nav className="h-full flex flex-col items-center p-4 mx-auto bg-primary dark:bg-neutral text-neutral dark:text-primary-light">
        <ul className="w-full flex justify-between items-center gap-4">
          {shouldShowMenus && (
            <li className="flex items-center md:hidden">
              <HamburgerLinksMenu lng={lng} collections={collections} />
            </li>
          )}
          <li className="rounded-full bg-white w-[50px] h-[50px]">
            <Link href={isAdmin ? `/${lng}/admin/home` : `/${lng}`}>
              <Image
                width={50}
                height={50}
                alt="Logo"
                src="/assets/images/logo-mini.webp"
                className="size-full object-cover rounded-full"
              />
            </Link>
          </li>
          <li>
            <ul className="flex items-center gap-2">
              {shouldShowMenus && (
                <>
                  <li className="mx-2 md:block hidden">
                    <Link href={`/${lng}`}>
                      <p className="cursor-pointer text-gray-600 dark:text-white font-extralight hover:underline">
                        Inicio
                      </p>
                    </Link>
                  </li>
                  <li className="md:flex items-center hidden group mx-2">
                    <CollectionsMenu lng={lng} collections={collections} />
                  </li>
                  <li className="flex items-center">
                    <button data-ignore-outside-click onClick={toggleSearchBar}>
                      <Search size="size-5" />
                    </button>
                  </li>
                </>
              )}
              <li className="flex items-center">
                <ThemeSelector />
              </li>
              {user && !pathname.startsWith(`/${lng}/checkout`) ? (
                <li className="flex items-center">
                  <ProfileMenu lng={lng} user={user} />
                </li>
              ) : (
                !isAuthPage && (
                  <li className="text-gray-600 dark:text-white">
                    <Link href={`/${lng}/login`}>
                      <UserIcon strokeWidth={1} />
                    </Link>
                  </li>
                )
              )}
              {shouldShowMenus && (
                <li className="flex items-center text-gray-600 dark:text-white">
                  <CartMenu lng={lng} products={products} />
                </li>
              )}
            </ul>
          </li>
        </ul>
        {shouldShowMenus && (
          <ul
            ref={searchBarRef}
            className={cn(
              "overflow-hidden transition-all duration-500 ease-in-out w-full flex gap-2",
              isSearchBarOpen
                ? "max-h-96 opacity-100 mt-2"
                : "max-h-0 opacity-0"
            )}
          >
            <li className="w-full max-w-2xl mx-auto">
              <MainSearch
                id="main-search-bar"
                lng={lng}
                onParentClose={toggleSearchBar}
              />
            </li>
            {pathname === `/${lng}/search` && isSearchBarOpen && (
              <li className="md:hidden">
                <FiltersMenu lng={lng} />
              </li>
            )}
          </ul>
        )}
      </nav>
      {/* {isSearchBarOpen && <div className="bg-black/50 w-full h-screen"></div>} */}
    </header>
  );
};

export default Header;
