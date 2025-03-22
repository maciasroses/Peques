"use client";

import Link from "next/link";
import { ReactNode, useState } from "react";
import { login } from "@/app/shared/services/user/controller";
import { INITIAL_STATE_RESPONSE } from "@/app/shared/constants";
import { GenericInput, SubmitButton } from "@/app/shared/components";
import type { ILoginState } from "@/app/shared/interfaces";

const Form = ({ lng }: { lng: string }) => {
  const [isPending, setIsPending] = useState(false);
  const [badResponse, setBadResponse] = useState<ILoginState>(
    INITIAL_STATE_RESPONSE
  );

  const submitAction: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    setIsPending(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await login(formData);
    if (res && !res.success) {
      setBadResponse(res);
    }
    setIsPending(false);
  };

  return (
    <>
      <div className="text-center">
        <h1 className="text-xl md:text-3xl mb-2">Inicio de sesión</h1>
        {badResponse.message && (
          <p className="text-red-600">{badResponse.message}</p>
        )}
      </div>
      <form onSubmit={submitAction} className="w-[80%] xl:w-1/2 m-auto">
        <fieldset disabled={isPending}>
          <div className="flex flex-col gap-4 text-base md:text-xl">
            <GenericDiv>
              <GenericInput
                id="email"
                ariaLabel="Correo electrónico"
                type="email"
                placeholder="alguien@mail.com"
                error={badResponse.errors?.email}
              />
            </GenericDiv>
            <GenericDiv>
              <GenericInput
                id="password"
                ariaLabel="Contraseña"
                type="password"
                placeholder="********"
                error={badResponse.errors?.password}
              />
            </GenericDiv>
            <p className="text-right text-sm">
              <Link
                className="hover:underline"
                href={`/${lng}/password-recovery`}
              >
                ¿Olvidaste tu contraseña?{" "}
              </Link>
            </p>
          </div>
          <div className="text-center mt-4">
            <SubmitButton
              title="Iniciar sesión"
              color="accent"
              pending={isPending}
            />
          </div>
        </fieldset>
      </form>
      <p className="text-center mt-4">
        ¿No tienes una cuenta?{" "}
        <Link href={`/${lng}/register`} className="hover:underline">
          Regístrate
        </Link>
      </p>
    </>
  );
};

export default Form;

const GenericDiv = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-col gap-2 w-full">{children}</div>;
};
