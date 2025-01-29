import React from "react";
import Image from "next/image";
import Logo from "@/public/assets/images/logo-color.webp";

interface IAuthTemplate {
  children: React.ReactNode;
}

const AuthTemplate = ({ children }: IAuthTemplate) => {
  return (
    <div className="w-full h-screen items-center justify-center flex flex-col sm:flex-row gap-4 pt-32 px-4 pb-4">
      <div className="w-full sm:w-1/2 flex justify-center items-center">
        <Image
          priority
          src={Logo}
          alt="Peques logo"
          className="w-full max-w-[300px] h-auto"
        />
      </div>
      <div className="w-full sm:w-1/2 flex flex-col items-center dark:text-white max-h-full overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default AuthTemplate;
