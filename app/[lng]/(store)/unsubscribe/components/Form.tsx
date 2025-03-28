"use client";

import { useState } from "react";
import { SubmitButton } from "@/app/shared/components";
import { switchNewsletterDecision } from "@/app/shared/services/user/controller";
import { INITIAL_STATE_RESPONSE } from "@/app/shared/constants";
import type { ISharedState } from "@/app/shared/interfaces";

interface IForm {
  lng: string;
  currentOption: boolean;
}

const Form = ({ lng, currentOption }: IForm) => {
  const [isPending, setIsPending] = useState(false);
  const [badResponse, setBadResponse] = useState<ISharedState>(
    INITIAL_STATE_RESPONSE
  );

  const submitAction: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    setIsPending(true);
    event.preventDefault();
    const res = await switchNewsletterDecision();
    if (res && !res.success) {
      setBadResponse(res);
    }
    setIsPending(false);
  };

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-center">
          {currentOption
            ? "¿Estás seguro de que deseas desuscribirte de nuestro newsletter?"
            : "Ya no estás suscrito a nuestro newsletter, ¿te gustaría volver a suscribirte?"}
        </h1>
        {badResponse.message && (
          <p className="text-red-600">{badResponse.message}</p>
        )}
      </div>
      <form onSubmit={submitAction} className="w-[80%] xl:w-1/2 mx-auto">
        <fieldset disabled={isPending}>
          <div className="text-center mt-4">
            <SubmitButton
              title={currentOption ? "Desuscribirme" : "Suscribirme"}
              color="accent"
              pending={isPending}
            />
            <button
              type="button"
              className="px-4 py-2 bg-accent-light hover:bg-accent-dark rounded-md ml-2"
              onClick={() => (window.location.href = `/${lng}/`)}
            >
              Cancelar
            </button>
          </div>
        </fieldset>
      </form>
    </>
  );
};

export default Form;
