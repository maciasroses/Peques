"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/app/shared/hooks";
import ProfilePic from "@/public/assets/images/profilepic.webp";
import { logout } from "@/app/shared/services/user/controller";
import { useEffect, useRef, useState } from "react";
import type { IUser } from "@/app/shared/interfaces";

interface IProfileLink {
  to: string;
  onClick: () => void;
  text: string;
}

const ProfileLink = ({ to, onClick, text }: IProfileLink) => {
  return (
    <Link
      href={to}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
      onClick={onClick}
    >
      {text}
    </Link>
  );
};

const ProfileMenu = ({ user }: { user: IUser }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { setUser } = useAuth();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !(menuRef.current as HTMLElement).contains(event.target as Node)
    ) {
      setMenuOpen(false);
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
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
    <div className="relative inline-flex text-left" ref={menuRef}>
      <button
        type="button"
        className="inline-flex justify-center w-full rounded-full border border-gray-300 shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
        onClick={toggleMenu}
      >
        <Image
          className="size-10 rounded-full"
          src={ProfilePic}
          alt="Profile"
        />
      </button>
      {menuOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow list-none bg-red-white bg-gray-50 dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none"
          aria-roledescription="menu"
        >
          <div className="py-1" aria-roledescription="none">
            <div className="px-4 py-3">
              <p className="text-base text-gray-900 dark:text-white">
                {user.username}
              </p>
              <p className="text-sm font-medium text-gray-500 truncate dark:text-gray-400">
                {user.email}
              </p>
            </div>

            {/* THE FOLLOWING IS FOR MOBILE DEVICES */}

            <div className="sm:hidden pb-1">
              <div className="border-t border-gray-300 dark:border-gray-800"></div>
              <ProfileLink
                to={user.role === "ADMIN" ? "/admin/home" : "/auth/home"}
                onClick={closeMenu}
                text="Inicio"
              />
              {user.role === "ADMIN" && (
                <ProfileLink
                  to="/admin/sales"
                  onClick={closeMenu}
                  text="Ventas"
                />
              )}
              <ProfileLink
                to={user.role === "ADMIN" ? "/admin/orders" : "/auth/orders"}
                onClick={closeMenu}
                text="Pedidos"
              />
              {user.role === "ADMIN" && (
                <>
                  <ProfileLink
                    to="/admin/products"
                    onClick={closeMenu}
                    text="Productos"
                  />
                  <ProfileLink
                    to="/admin/providers"
                    onClick={closeMenu}
                    text="Proveedores"
                  />
                </>
              )}
            </div>

            <div className="border-t border-gray-300 dark:border-gray-800"></div>
            <form action={logout}>
              <button
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white w-full text-left"
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
