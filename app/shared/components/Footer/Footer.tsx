import clsx from "clsx";
import type { IUser } from "@/app/shared/interfaces";

const Footer = ({ user }: { user: IUser | null }) => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className={clsx("w-full", user && "mx-auto")}>
      <div
        className={clsx(
          "mx-auto bg-black text-primary-light text-center p-4",
          user && "sm:ml-48"
        )}
      >
        <p>&copy; {currentYear} - Peques. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
