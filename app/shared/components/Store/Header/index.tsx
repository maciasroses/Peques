"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import CartMenu from "./CartMenu";
import MainSearch from "./MainSearch";
import ProfileMenu from "./ProfileMenu";
// import FiltersMenu from "../../../../[lng]/(store)/search/components/FiltersMenu";
import { cn } from "@/app/shared/utils/cn";
import { usePathname } from "next/navigation";
import CollectionsMenu from "./CollectionsMenu";
import { useToggleMenu } from "@/app/shared/hooks";
import HamburgerLinksMenu from "./HamburgerLinksMenu";
import { Search, UserIcon } from "@/app/shared/icons";
import Logo from "@/public/assets/images/logo-color.webp";
import type {
  IUser,
  IProduct,
  ICollection,
  IFilterGroup,
} from "@/app/shared/interfaces";

interface IHeader {
  lng: string;
  user: IUser | null;
  products: IProduct[];
  filters: IFilterGroup[];
  collections: ICollection[];
}

const Header = ({ lng, user, products, filters, collections }: IHeader) => {
  const pathname = usePathname();
  const isAdmin = user?.role === "ADMIN";
  const mainSearchRef = useRef<{ focusInput: () => void }>(null);

  const {
    ref: searchBarRef,
    isOpen: isSearchBarOpen,
    toggle: toggleSearchBar,
  } = useToggleMenu<HTMLUListElement>();

  // const isVisible = useScrollVisibility(isAdmin);

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

  const handleToggleAndFocus = () => {
    toggleSearchBar();
    if (!isSearchBarOpen) {
      setTimeout(() => {
        mainSearchRef.current?.focusInput();
      }, 500);
    }
  };

  return (
    <header
      className={cn(
        "fixed z-30 top-0 w-full transition-transform duration-300"
        // isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      {shouldShowMenus && (
        <div className="overflow-hidden whitespace-nowrap bg-accent-light text-white">
          <div className="flex animate-marquee gap-6 py-2">
            {Array.from({ length: 10 }).map((_, index) => (
              <p key={index}>
                WELCOME! Envío <strong>GRATIS</strong> a partir de{" "}
                <strong>$1,900 MXN</strong>
              </p>
            ))}
          </div>
        </div>
      )}
      <nav className="h-full flex flex-col items-center py-2 px-4 mx-auto bg-white border-b-4 border-accent-light">
        <ul
          className={cn(
            "w-full flex items-center gap-4",
            !pathname.startsWith(`/${lng}/checkout`)
              ? "justify-between"
              : "justify-center"
          )}
        >
          {shouldShowMenus && (
            <li className="flex items-center md:hidden">
              <HamburgerLinksMenu lng={lng} collections={collections} />
            </li>
          )}
          <li>
            <Link href={isAdmin ? `/${lng}/admin/home` : `/${lng}`}>
              <Image
                priority
                src={Logo}
                width={150}
                height={150}
                alt="Peques logo"
                className="max-w-80"
              />
            </Link>
          </li>
          <li>
            <ul className="flex items-center gap-4 text-black">
              {shouldShowMenus && (
                <>
                  <li className="mx-2 md:block hidden">
                    <Link href={`/${lng}`}>
                      <p className="font-thin text-lg">INICIO</p>
                    </Link>
                  </li>
                  <li className="md:flex items-center hidden group mx-2">
                    <CollectionsMenu lng={lng} collections={collections} />
                  </li>
                  <li className="flex items-center">
                    <button
                      aria-label="Search"
                      data-ignore-outside-click
                      onClick={handleToggleAndFocus}
                    >
                      <Search size="size-4" />
                    </button>
                  </li>
                </>
              )}
              {/* <li className="flex items-center">
                <ThemeSelector />
              </li> */}
              {user && !pathname.startsWith(`/${lng}/checkout`) ? (
                <li className="flex items-center">
                  <ProfileMenu lng={lng} user={user} />
                </li>
              ) : (
                !isAuthPage &&
                !isCheckoutOrAdmin && (
                  <li>
                    <Link href={`/${lng}/login`} aria-label="Login">
                      <UserIcon size="size-4" strokeWidth={2} isFilled />
                    </Link>
                  </li>
                )
              )}
              {shouldShowMenus && (
                <li className="flex items-center">
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
                lng={lng}
                ref={mainSearchRef}
                id="main-search-bar"
                onParentClose={toggleSearchBar}
              />
            </li>
            {/* {(pathname === `/${lng}/search` ||
              new RegExp(`^/${lng}/collections/[a-z-]+$`).test(pathname)) &&
              isSearchBarOpen && (
                <li className="md:hidden">
                  <FiltersMenu filters_available={filters} />
                </li>
              )} */}
          </ul>
        )}
      </nav>
    </header>
  );
};

export default Header;
