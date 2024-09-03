import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { Form } from "./components";
import Logo from "@/public/logo-color.webp";
import TempForm from "./components/TempForm";

export const metadata: Metadata = {
  title: "Log in",
};

const LoginPage = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-full flex flex-col sm:flex-row items-center gap-4 max-h-full overflow-y-auto py-4">
        <div className="w-full sm:w-1/2 flex justify-center">
          <Link href="/">
            <Image
              className="w-full max-w-[300px] h-auto"
              src={Logo}
              alt="Peques logo"
              priority
            />
          </Link>
        </div>
        <Form />
        {/* <TempForm /> */}
      </div>
    </div>
  );
};

export default LoginPage;
