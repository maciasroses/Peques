"use client";

import clsx from "clsx";
import Link from "next/link";
import {
  Dollar,
  Puzzle,
  HomeIcon,
  UserIcon,
  UserGroup,
  ShoppingBag,
  PhotoIcon,
  TagIcon,
} from "@/app/shared/icons";
import { usePathname } from "next/navigation";

interface ILinkComp {
  to: string;
  span: string;
  icon: string;
}

const LinkComp = ({ to, span, icon }: ILinkComp) => {
  const pathname = usePathname();
  const isActive = pathname.startsWith(to);

  return (
    <Link
      href={to}
      className={clsx(
        "flex items-center p-2 rounded-lg group group-hover:bg-accent hover:bg-accent",
        isActive && "bg-accent"
      )}
    >
      {icon === "home" ? (
        <HomeIcon isActive={isActive} />
      ) : icon === "sales" ? (
        <Dollar isActive={isActive} />
      ) : icon === "orders" ? (
        <ShoppingBag strokeWidth={2.5} isActive={isActive} />
      ) : icon === "products" ? (
        <Puzzle isActive={isActive} />
      ) : icon === "providers" ? (
        <UserIcon strokeWidth={2.5} />
      ) : icon === "users" ? (
        <UserGroup strokeWidth={2} />
      ) : icon === "hero" ? (
        <PhotoIcon strokeWidth={2.5} />
      ) : (
        icon === "collections" && <TagIcon strokeWidth={2.5} />
      )}
      <span className="ms-3 font-black">{span}</span>
    </Link>
  );
};

export default LinkComp;
