import Link from "next/link";
import { Form } from "./components";
import { Card404 } from "@/app/shared/components";
import { IBaseLangPage } from "@/app/shared/interfaces";
import { verifyTokenExpiration } from "@/app/shared/services/user/controller";

interface IResetPasswordPage extends IBaseLangPage {
  searchParams: {
    token: string;
    success?: string;
  };
}

const ResetPasswordPage = async ({
  searchParams,
  params: { lng },
}: IResetPasswordPage) => {
  if (!searchParams.token) {
    return (
      <Card404
        title="Token inválido"
        description="El token es requerido para resetear la contraseña"
      />
    );
  }

  if (searchParams.success) {
    return (
      <>
        <h1 className="text-center text-3xl md:text-6xl">
          Contraseña actualizada correctamente
        </h1>
        <p className="text-center text-lg md:text-3xl">
          Por favor, inicia sesión con tu nueva contraseña
        </p>
        <Link href={`/${lng}/login`} className="link-button-primary mt-4">
          Iniciar sesión
        </Link>
      </>
    );
  }

  const isValidToken = await verifyTokenExpiration(searchParams.token);
  if (!isValidToken) {
    return (
      <Card404
        title="Token inválido"
        description="El token proporcionado no es válido o ha expirado"
      />
    );
  }

  return <Form token={searchParams.token} />;
};

export default ResetPasswordPage;
