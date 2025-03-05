import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { dir } from "i18next";
import { languages } from "@/app/i18n/settings";
import { ToastContainer } from "react-toastify";
import { getMe } from "@/app/shared/services/user/controller";
import { getFilters } from "@/app/shared/services/filter/controller";
import { getAllProducts } from "@/app/shared/services/product/controller";
import { getAllCollections } from "@/app/shared/services/collection/controller";
import {
  Footer,
  Header,
  AuthComponent,
  CartComponent,
  ThemeComponent,
} from "@/app/shared/components";
import type { Metadata } from "next";
import type {
  IUser,
  IProduct,
  ICollection,
  IBaseLangPage,
  IFilterGroup,
} from "@/app/shared/interfaces";

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
  openGraph: {
    title: "Peques",
    description: "Growing happy and healthy kids",
    url: "https://www.shopeques.com",
    siteName: "Peques",
    images: [
      {
        url: "https://pequesbucket.s3.us-east-2.amazonaws.com/logo-color.webp",
        width: 800,
        height: 600,
      },
    ],
    type: "website",
  },
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
  const collections = (await getAllCollections()) as ICollection[];
  const available_filters = (await getFilters({})) as IFilterGroup[];

  return (
    <html lang={lng} dir={dir(lng)}>
      <body
        suppressHydrationWarning
        className="bg-neutral-light transition-colors duration-300"
      >
        <ThemeComponent>
          <CartComponent>
            <AuthComponent>
              <ToastContainer />
              <Header
                user={me}
                lng={lng}
                products={products}
                collections={collections}
                filters={available_filters}
              />
              <main className="bg-white w-full min-h-screen mx-auto">
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
