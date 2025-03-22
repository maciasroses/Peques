import { Greetings, MainInfo, DeleteAccount } from "./components";
import type { Metadata } from "next";
import type { IBaseLangPage } from "@/app/shared/interfaces";

export const metadata: Metadata = {
  title: "Mi perfil",
};

interface IProfileHomePage extends IBaseLangPage {}

const ProfileHomePage = ({ params: { lng } }: IProfileHomePage) => {
  return (
    <>
      <Greetings />
      <div className="flex flex-col gap-4 items-center justify-center mt-4">
        <MainInfo lng={lng} />
        <DeleteAccount />
      </div>
    </>
  );
};

export default ProfileHomePage;
