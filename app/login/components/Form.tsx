"use client";

import { ReactNode, useState } from "react";
import { login } from "@/services/user/controller";
import { INITIAL_STATE_RESPONSE } from "@/constants";
import { GenericInput, SubmitButton } from "@/components";
import type { ILoginState } from "@/interfaces";

const Form = () => {
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
    <div className="w-full sm:w-1/2 flex flex-col justify-center">
      <div className="text-center">
        <h1 className="text-3xl md:text-6xl">Inicio de sesión</h1>
        {badResponse.message && (
          <p className="text-red-600">{badResponse.message}</p>
        )}
      </div>
      <form onSubmit={submitAction} className="w-1/2 m-auto">
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
          </div>
          <div className="text-center mt-4">
            <SubmitButton title="Log in" color="primary" pending={isPending} />
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default Form;

const GenericDiv = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-col gap-2 w-full">{children}</div>;
};
