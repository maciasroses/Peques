"use client";

import Link from "next/link";
import { ReactNode, useState } from "react";
import { INITIAL_STATE_RESPONSE } from "@/app/shared/constants";
import { register } from "@/app/shared/services/user/controller";
import { GenericInput, SubmitButton } from "@/app/shared/components";
import type { IRegisterState } from "@/app/shared/interfaces";

const Form = ({ lng }: { lng: string }) => {
  const [isPending, setIsPending] = useState(false);
  const [badResponse, setBadResponse] = useState<IRegisterState>(
    INITIAL_STATE_RESPONSE
  );

  const submitAction: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    setIsPending(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await register(formData);
    if (res && !res.success) {
      setBadResponse(res);
    }
    setIsPending(false);
  };

  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl md:text-6xl">Registro</h1>
        {badResponse.message && (
          <p className="text-red-600">{badResponse.message}</p>
        )}
      </div>
      <form onSubmit={submitAction} className="w-[80%] xl:w-1/2 m-auto">
        <fieldset disabled={isPending}>
          <div className="flex flex-col gap-4 text-base md:text-xl">
            <GenericPairDiv>
              <GenericDiv>
                <GenericInput
                  id="username"
                  ariaLabel="Nombre de usuario"
                  type="text"
                  placeholder="Nombre de usuario"
                  error={badResponse.errors?.username}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  id="email"
                  ariaLabel="Correo electrónico"
                  type="email"
                  placeholder="alguien@mail.com"
                  error={badResponse.errors?.email}
                />
              </GenericDiv>
            </GenericPairDiv>
            <GenericPairDiv>
              <GenericDiv>
                <GenericInput
                  id="firstName"
                  ariaLabel="Nombre(s)"
                  type="text"
                  placeholder="Juan Carlos"
                  error={badResponse.errors?.firstName}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  id="lastName"
                  ariaLabel="Apellido(s)"
                  type="text"
                  placeholder="Pérez López"
                  error={badResponse.errors?.lastName}
                />
              </GenericDiv>
            </GenericPairDiv>
            <GenericPairDiv>
              <GenericDiv>
                <GenericInput
                  id="password"
                  ariaLabel="Contraseña"
                  type="password"
                  placeholder="********"
                  error={badResponse.errors?.password}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  id="confirmPassword"
                  ariaLabel="Confirmar contraseña"
                  type="password"
                  placeholder="********"
                  error={badResponse.errors?.confirmPassword}
                />
              </GenericDiv>
            </GenericPairDiv>
            <div className="inline-flex items-center justify-end gap-2 text-sm">
              <GenericInput
                type="checkbox"
                id="wantsNewsletter"
                ariaLabel="¿Quieres recibir nuestro boletín?"
              />
            </div>
          </div>
          <div className="text-center mt-4">
            <SubmitButton
              color="primary"
              title="Registrarme"
              pending={isPending}
            />
          </div>
        </fieldset>
      </form>
      <p className="text-center mt-4">
        ¿Ya tienes una cuenta?{" "}
        <Link href={`/${lng}/login`} className="hover:underline">
          Inicia sesión
        </Link>
      </p>
    </>
  );
};

export default Form;

const GenericDiv = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-col gap-2 w-full lg:w-1/2">{children}</div>;
};

const GenericPairDiv = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-2 w-full">{children}</div>
  );
};
