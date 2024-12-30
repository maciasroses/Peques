"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/app/shared/utils/cn";
import { usePathname } from "next/navigation";
import { Instagram } from "@/app/shared/icons";
import Logo from "@/public/assets/images/logo-color.webp";
import type { IUser } from "@/app/shared/interfaces";

interface IFooter {
  lng: string;
  user: IUser;
}

const Footer = ({ lng, user }: IFooter) => {
  const pathname = usePathname();
  const isAdmin = user?.role === "ADMIN";
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-black text-primary-light">
      {!pathname.includes("admin") && (
        <section className="w-[80%] flex flex-col md:flex-row gap-4 justify-around items-center mx-auto py-4">
          <div className="w-full md:w-2/4 flex flex-col items-start">
            <div className="flex flex-col items-center justify-center">
              <Image
                src={Logo}
                alt="Peques logo"
                width={150}
                height={150}
                priority
              />
              <p className="text-sm">Growing happy and healthy kids</p>
            </div>
            <ul className="mt-4 flex gap-2 items-center justify-center">
              <li>
                <Link
                  href="https://www.instagram.com/peques.mex/"
                  target="_blank"
                >
                  <Instagram />
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-2/4 flex flex-col sm:flex-row gap-4 items-start">
            <div className="w-full sm:w-1/2">
              <p className="text-lg mb-2">Legal</p>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href={`/${lng}/terms-of-service`}>
                    Términos y condiciones
                  </Link>
                </li>
                <li>
                  <Link href={`/${lng}/privacy-policy`}>
                    Política de privacidad
                  </Link>
                </li>
              </ul>
            </div>
            <div className="w-full sm:w-1/2">
              <p className="text-lg mb-2">Soporte</p>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href={`/${lng}/about`}>Acerca de nosotros</Link>
                </li>
                <li>
                  <Link href={`/${lng}/contact`}>Contacto</Link>
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}
      <section
        className={cn(
          "mx-auto text-center p-4",
          isAdmin && pathname.includes("admin") && "sm:ml-48"
        )}
      >
        <p>&copy; {currentYear}, Peques. Todos los derechos reservados.</p>
      </section>
    </footer>
  );
};

export default Footer;
