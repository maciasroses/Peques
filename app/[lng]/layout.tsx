import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { dir } from "i18next";
import { languages } from "@/app/i18n/settings";
import { ToastContainer } from "react-toastify";
import { getMe } from "@/app/shared/services/user/controller";
import {
  Footer,
  Header,
  Sidebar,
  AuthComponent,
  ThemeComponent,
} from "@/app/shared/components";
import type { Metadata } from "next";
import type { IBaseLangPage, IUser } from "@/app/shared/interfaces";

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
  params,
  children,
}: Readonly<IRootLayout>) {
  const { lng } = await params;
  const user = (await getMe()) as IUser;

  return (
    <html lang={lng} dir={dir(lng)}>
      <body
        suppressHydrationWarning
        className="bg-neutral-light dark:bg-neutral dark:text-white"
      >
        <ThemeComponent>
          <AuthComponent>
            <ToastContainer />
            <Header user={user} />
            {!user ? (
              <MainSection>{children}</MainSection>
            ) : (
              <MainSection>
                <Sidebar user={user} />
                <section className="sm:ml-48 pt-24 px-4 pb-4 min-h-screen">
                  {children}
                </section>
              </MainSection>
            )}
            <Footer user={user} />
          </AuthComponent>
        </ThemeComponent>
      </body>
    </html>
  );
}

const MainSection = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="bg-white dark:bg-gray-900 w-full min-h-screen mx-auto">
      {children}
    </main>
  );
};
