import { Sidebar } from "./components";
import { redirect } from "next/navigation";
import { getMe } from "@/app/shared/services/user/controller";
import type { Metadata } from "next";
import type { IBaseLangPage, IUser } from "@/app/shared/interfaces";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    template: "%s | Admin",
    default: "Admin",
  },
};

interface IAdminLayout extends IBaseLangPage {
  children: React.ReactNode;
}

const AdminLayout = async ({ children, params: { lng } }: IAdminLayout) => {
  const me = (await getMe()) as IUser;
  if (!me || me.role !== "ADMIN") {
    redirect(`/${lng}`);
  }

  return (
    <>
      <Sidebar lng={lng} />
      <main className="sm:ml-48 pt-32 px-4 pb-4 min-h-screen">{children}</main>
    </>
  );
};

export default AdminLayout;
