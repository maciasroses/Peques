import clsx from "clsx";
import type { IUser } from "@/interfaces";

const Footer = ({ user }: { user: IUser | null }) => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className={clsx("w-full", user && "max-w-[1440px] mx-auto")}>
      <div
        className={clsx(
          "max-w-[1440px] mx-auto bg-neutral text-primary-light text-center p-4",
          user && "sm:ml-48"
        )}
      >
        <p>&copy; {currentYear} - Peques. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;