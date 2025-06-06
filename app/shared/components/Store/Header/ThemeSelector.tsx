"use client";

import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { useDisableScroll, useTheme } from "@/app/shared/hooks";
import { DarkIcon, LightIcon, SystemIcon } from "@/app/shared/icons";

interface IThemeButton {
  theme: string;
  themeColor: string;
  handleThemeChange: () => void;
  icon: React.ReactNode;
  span: string;
}

const ThemeButton = ({
  theme,
  themeColor,
  handleThemeChange,
  icon,
  span,
}: IThemeButton) => {
  return (
    <button
      aria-label="Botón de cambio de tema"
      onClick={handleThemeChange}
      className={clsx(
        "w-full flex items-center gap-2 p-2 rounded-lg group text-primary-light hover:bg-accent",
        theme === themeColor && "text-accent hover:text-primary-light"
      )}
    >
      {icon}
      <span>{span}</span>
    </button>
  );
};

const ThemeSelector = () => {
  const menuRef = useRef(null);
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light");

  useDisableScroll(menuOpen);

  const handleThemeChange = (theme: string) => {
    setTheme(theme);
    setMenuOpen(false);
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
    }
  };

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    setSystemTheme(darkModeMediaQuery.matches ? "dark" : "light");

    darkModeMediaQuery.addEventListener("change", handleSystemThemeChange);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      darkModeMediaQuery.removeEventListener("change", handleSystemThemeChange);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        aria-label="Selector de tema"
        className="flex items-center"
        onClick={toggleMenu}
      >
        {theme === "light" ||
        (theme === "system" && systemTheme === "light") ? (
          <LightIcon theme={theme} />
        ) : (
          <DarkIcon theme={theme} />
        )}
      </button>
      {menuOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow list-none bg-neutral-light dark:bg-primary-dark text-primary-light focus:outline-none z-10"
          aria-roledescription="menu"
        >
          <div className="py-1" aria-roledescription="none">
            <ThemeButton
              theme={theme}
              themeColor="light"
              handleThemeChange={() => handleThemeChange("light")}
              icon={<LightIcon theme={theme} />}
              span="Claro"
            />
            <ThemeButton
              theme={theme}
              themeColor="dark"
              handleThemeChange={() => handleThemeChange("dark")}
              icon={<DarkIcon theme={theme} />}
              span="Oscuro"
            />
            <ThemeButton
              theme={theme}
              themeColor="system"
              handleThemeChange={() => handleThemeChange("system")}
              icon={<SystemIcon theme={theme} />}
              span="Sistema"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
