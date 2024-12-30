import { Form } from "./components";
import type { Metadata } from "next";
import type { IBaseLangPage } from "@/app/shared/interfaces";

export const metadata: Metadata = {
  title: "Registro",
};

const RegisterPage = ({ params: { lng } }: IBaseLangPage) => {
  return <Form lng={lng} />;
};

export default RegisterPage;
