import { Sidebar } from "@/app/shared/components";
import type { Metadata } from "next";
import type { IBaseLangPage } from "@/app/shared/interfaces";

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
  return (
    <>
      <Sidebar lng={lng} />
      <main className="sm:ml-48 pt-24 px-4 pb-4 min-h-screen">{children}</main>
    </>
  );
};

export default AdminLayout;
