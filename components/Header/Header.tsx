"use client";

import Link from "next/link";
import Image from "next/image";
import ProfileMenu from "./ProfileMenu";
import ThemeSelector from "./ThemeSelector";
import { usePathname } from "next/navigation";
import LogoMini from "@/public/logo-mini.webp";
import type { IUser } from "@/interfaces";

const Header = ({ user }: { user: IUser | null }) => {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  return (
    <header className="fixed z-40 top-0 w-full h-20">
      <div className="h-full flex justify-between items-center p-4 max-w-[1440px] mx-auto bg-primary dark:bg-neutral text-neutral dark:text-primary-light">
        <Link
          href={isAdmin ? "/admin/home" : "/"}
          className="rounded-full bg-white"
        >
          <Image
            className="h-full max-h-[50px] w-auto rounded-full"
            src={LogoMini}
            alt="Peques logo mini"
            priority
          />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeSelector />
          {user && <ProfileMenu user={user} />}
        </div>
      </div>
    </header>
  );
};

export default Header;
