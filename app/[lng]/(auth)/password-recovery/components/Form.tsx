"use client";

import { useState } from "react";
import { cn } from "@/app/shared/utils/cn";
import { INITIAL_STATE_RESPONSE } from "@/app/shared/constants";
import { GenericInput, SubmitButton } from "@/app/shared/components";
import { passwordRecovery } from "@/app/shared/services/user/controller";
import type { IRecoverPasswordState } from "@/app/shared/interfaces";

const Form = () => {
  const [isPending, setIsPending] = useState(false);
  const [response, setResponse] = useState<IRecoverPasswordState>(
    INITIAL_STATE_RESPONSE
  );

  const submitAction: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    setIsPending(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await passwordRecovery(formData);
    setResponse(res);
    setIsPending(false);
  };

  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl md:text-6xl">Recuperar contraseña</h1>
        {response.message && (
          <p className={cn(response.success === false && "text-red-600")}>
            {response.message}
          </p>
        )}
      </div>
      {response.success !== true && (
        <form onSubmit={submitAction} className="w-[80%] xl:w-1/2 m-auto">
          <fieldset disabled={isPending}>
            <div className="flex flex-col gap-4 text-base md:text-xl">
              <GenericInput
                id="email"
                ariaLabel="Correo electrónico"
                type="email"
                placeholder="alguien@email.com"
                error={response.errors?.email}
              />
            </div>
            <div className="text-center mt-4">
              <SubmitButton
                color="accent"
                title="Recuperar"
                pending={isPending}
              />
            </div>
          </fieldset>
        </form>
      )}
    </>
  );
};

export default Form;
