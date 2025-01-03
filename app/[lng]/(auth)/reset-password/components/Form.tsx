"use client";

import { cn } from "@/app/shared/utils/cn";
import { ReactNode, useState } from "react";
import { INITIAL_STATE_RESPONSE } from "@/app/shared/constants";
import { GenericInput, SubmitButton } from "@/app/shared/components";
import { resetPassword } from "@/app/shared/services/user/controller";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import type { IResetPasswordState } from "@/app/shared/interfaces";

interface IForm {
  token: string;
}

const Form = ({ token }: IForm) => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const [isPending, setIsPending] = useState(false);
  const [response, setResponse] = useState<IResetPasswordState>(
    INITIAL_STATE_RESPONSE
  );

  const submitAction: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    setIsPending(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await resetPassword(formData, token);
    if (res && res.success) {
      const params = new URLSearchParams(searchParams);
      params.set("success", "true");
      replace(`${pathname}?${params.toString()}`);
    }
    setResponse(res);
    setIsPending(false);
  };

  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl md:text-6xl">Restablecer contraseña</h1>
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
              <GenericPairDiv>
                <GenericDiv>
                  <GenericInput
                    id="password"
                    ariaLabel="Contraseña"
                    type="password"
                    placeholder="********"
                    error={response.errors?.password}
                  />
                </GenericDiv>
                <GenericDiv>
                  <GenericInput
                    id="confirmPassword"
                    ariaLabel="Confirmar contraseña"
                    type="password"
                    placeholder="********"
                    error={response.errors?.confirmPassword}
                  />
                </GenericDiv>
              </GenericPairDiv>
            </div>
            <div className="text-center mt-4">
              <SubmitButton
                color="primary"
                title="Restablecer"
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

const GenericDiv = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-col gap-2 w-full lg:w-1/2">{children}</div>;
};

const GenericPairDiv = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-2 w-full">{children}</div>
  );
};
