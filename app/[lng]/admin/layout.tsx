import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Admin",
    default: "Admin",
  },
};

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default AdminLayout;
