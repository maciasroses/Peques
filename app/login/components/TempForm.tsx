"use client";

import { ReactNode, useState } from "react";
import { register } from "@/services/user/controller";
import { GenericInput, SubmitButton } from "@/components";
import type { IRegisterState } from "@/interfaces";
import { INITIAL_STATE_RESPONSE } from "@/constants";

const TempForm = () => {
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
    <div className="w-full sm:w-1/2 flex flex-col justify-center">
      <div className="text-center">
        <h1 className="text-3xl md:text-6xl">REGISTER</h1>
        {badResponse.message && (
          <p className="text-red-600">{badResponse.message}</p>
        )}
      </div>
      <form onSubmit={submitAction} className="w-1/2 m-auto">
        <fieldset disabled={isPending}>
          <div className="flex flex-col gap-4 text-base md:text-xl">
            <input name="username" type="text" placeholder="USERNAME" />
            <input name="email" type="email" placeholder="EMAIL" />
            <input name="password" type="password" placeholder="PASSWORD" />
            <input
              name="confirmPassword"
              type="password"
              placeholder="CONFIRM PASSWORD"
            />
          </div>
          <div className="text-center mt-4">
            <SubmitButton title="REGISTER" pending={isPending} />
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default TempForm;
