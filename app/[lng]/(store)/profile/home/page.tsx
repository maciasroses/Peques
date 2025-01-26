import { Greetings, MainInfo } from "./components";
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
      <div className="flex flex-col md:flex-row gap-2 justify-center mt-4">
        <MainInfo lng={lng} />
      </div>
    </>
  );
};

export default ProfileHomePage;
