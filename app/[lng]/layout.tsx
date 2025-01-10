import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { dir } from "i18next";
import { languages } from "@/app/i18n/settings";
import { ToastContainer } from "react-toastify";
import { getMe } from "@/app/shared/services/user/controller";
import {
  Footer,
  Header,
  AuthComponent,
  CartComponent,
  ThemeComponent,
} from "@/app/shared/components";
import type { Metadata } from "next";
import type { IBaseLangPage, IProduct, IUser } from "@/app/shared/interfaces";
import { getAllProducts } from "../shared/services/product/controller";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export const metadata: Metadata = {
  title: {
    template: "%s | Peques",
    default: "Peques",
  },
  description: "Growing happy and healthy kids",
};

interface IRootLayout extends IBaseLangPage {
  children: React.ReactNode;
}

export default async function RootLayout({
  children,
  params: { lng },
}: Readonly<IRootLayout>) {
  const me = (await getMe()) as IUser;
  const products = (await getAllProducts()) as IProduct[];

  return (
    <html lang={lng} dir={dir(lng)}>
      <body
        suppressHydrationWarning
        className="bg-neutral-light dark:bg-neutral dark:text-white transition-colors duration-300"
      >
        <ThemeComponent>
          <CartComponent>
            <AuthComponent>
              <ToastContainer />
              <Header user={me} lng={lng} products={products} />
              <main className="bg-white dark:bg-gray-900 w-full min-h-screen mx-auto">
                {children}
              </main>
              <Footer user={me} lng={lng} />
            </AuthComponent>
          </CartComponent>
        </ThemeComponent>
      </body>
    </html>
  );
}
