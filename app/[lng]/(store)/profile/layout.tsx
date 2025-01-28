import { Sidebar } from "./components";
import type { IBaseLangPage } from "@/app/shared/interfaces";

interface IProfileLayout extends IBaseLangPage {
  children: React.ReactNode;
}

const ProfileLayout = ({ children, params: { lng } }: IProfileLayout) => {
  return (
    <>
      <Sidebar lng={lng} />
      <article className="md:ml-48 pt-36 px-4 pb-4 min-h-screen">
        {children}
      </article>
    </>
  );
};

export default ProfileLayout;
