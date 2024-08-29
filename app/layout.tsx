import "./globals.css";
import {
  AuthComponent,
  Footer,
  Header,
  Sidebar,
  ThemeComponent,
} from "@/components";
import { getSession, getUserById } from "@/services/user/controller";
import type { Metadata } from "next";
import type { IUser } from "@/interfaces";

export const metadata: Metadata = {
  title: {
    template: "%s | Peques",
    default: "Peques",
  },
  description: "Growing happy and healthy kids",
};

// FONTS EXAMPLE
{
  /* <p className="italic">Asi es, texto de prueba en regular italic.</p>
<p className="italic font-bold">
  Asi es, texto de prueba en bold italic.
</p>
<p className="font-bold">Asi es, texto de prueba solo en bold.</p> */
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userSession = await getSession();
  let user = null;
  if (userSession) {
    user = (await getUserById({ id: userSession.userId })) as IUser;
  }

  return (
    <html lang="en">
      <body className="bg-accent-light dark:bg-neutral">
        <ThemeComponent>
          <AuthComponent>
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
    <main className="bg-primary-light w-full min-h-screen max-w-[1440px] mx-auto">
      {children}
    </main>
  );
};
