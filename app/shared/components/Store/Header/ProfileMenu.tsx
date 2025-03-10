"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/app/shared//utils/cn";
import { DownChevron } from "@/app/shared/icons";
import { useEffect, useRef, useState } from "react";
import { logout } from "@/app/shared/services/user/controller";
import { useAuth, useDisableScroll } from "@/app/shared/hooks";
import type { IUser } from "@/app/shared/interfaces";

interface IProfileLink {
  to: string;
  text: string;
  onClick: () => void;
  customClass?: string;
}

const ProfileLink = ({ to, onClick, text, customClass }: IProfileLink) => {
  return (
    <Link
      href={to}
      className={cn(
        "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",
        customClass
      )}
      onClick={onClick}
    >
      {text}
    </Link>
  );
};

interface IProfileMenu {
  lng: string;
  user: IUser;
}

const ProfileMenu = ({ user, lng }: IProfileMenu) => {
  const menuRef = useRef(null);
  const { setUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);

  useDisableScroll(menuOpen);

  const handleProfileMenu = () => {
    setProfileMenu(!profileMenu);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !(menuRef.current as HTMLElement).contains(event.target as Node)
    ) {
      setMenuOpen(false);
      setProfileMenu(false);
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setProfileMenu(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={toggleMenu}
        aria-label="Profile"
        className="size-4 rounded-full flex items-center"
      >
        <Image
          alt="Profile"
          width={40}
          height={40}
          src={user.image || "/assets/images/profilepic.webp"}
          className="size-full object-cover rounded-full"
        />
      </button>
      {menuOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow list-none bg-gray-50 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          aria-roledescription="menu"
        >
          <div className="py-1" aria-roledescription="none">
            <div className="px-4 py-3">
              <p className="text-base text-gray-900">{user.username}</p>
              <p className="text-sm font-medium text-gray-500 truncate">
                {user.email}
              </p>
            </div>
            <div className="border-t border-gray-300"></div>

            {user.role === "ADMIN" ? (
              <div className="sm:hidden pb-1">
                {/* THE FOLLOWING IS THE ADMIN PANEL AND FOR MOBILE DEVICES */}
                <ProfileLink
                  to={`/${lng}/admin/home`}
                  onClick={closeMenu}
                  text="Inicio"
                />
                <ProfileLink
                  to={`/${lng}/admin/sales`}
                  onClick={closeMenu}
                  text="Ventas"
                />
                <ProfileLink
                  to={`/${lng}/admin/orders`}
                  onClick={closeMenu}
                  text="Pedidos"
                />
                <ProfileLink
                  to={`/${lng}/admin/users`}
                  onClick={closeMenu}
                  text="Usuarios"
                />
                <ProfileLink
                  to="/admin/products"
                  onClick={closeMenu}
                  text="Productos"
                />
                <ProfileLink
                  to={`/${lng}/admin/filters`}
                  onClick={closeMenu}
                  text="Filtros"
                />
                <ProfileLink
                  to={`/${lng}/admin/hero`}
                  onClick={closeMenu}
                  text="Hero"
                />
                <ProfileLink
                  to={`/${lng}/admin/collections`}
                  onClick={closeMenu}
                  text="Colecciones"
                />
                <ProfileLink
                  to="/admin/providers"
                  onClick={closeMenu}
                  text="Proveedores"
                />
                <ProfileLink
                  to="/admin/promotions"
                  onClick={closeMenu}
                  text="Promociones"
                />
              </div>
            ) : (
              <>
                <p
                  onClick={handleProfileMenu}
                  className="relative block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Cuenta
                  <span
                    className={cn(
                      "absolute right-4 top-2.5 transform transition-all duration-300",
                      profileMenu ? " rotate-180" : "rotate-0"
                    )}
                  >
                    <DownChevron size="size-4" />
                  </span>
                </p>
                <ul
                  className={`${
                    profileMenu ? "block" : "hidden"
                  } transition duration-300`}
                >
                  <li>
                    <ProfileLink
                      text="Mi perfil"
                      customClass="pl-8"
                      onClick={closeMenu}
                      to={`/${lng}/profile`}
                    />
                  </li>
                  <li>
                    <ProfileLink
                      text="Mis listas"
                      customClass="pl-8"
                      onClick={closeMenu}
                      to={`/${lng}/profile/lists`}
                    />
                  </li>
                  <li>
                    <ProfileLink
                      text="Mis pedidos"
                      customClass="pl-8"
                      onClick={closeMenu}
                      to={`/${lng}/profile/orders`}
                    />
                  </li>
                </ul>
              </>
            )}

            <div className="border-t border-gray-300"></div>
            <form action={logout}>
              <button
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                type="submit"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
