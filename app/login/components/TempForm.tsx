"use client";

import { useFormState } from "react-dom";
import { ReactNode, useState } from "react";
import { register } from "@/services/user/controller";
import { GenericInput, SubmitButton } from "@/components";
import type { IRegisterState } from "@/interfaces";

const TempForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialState: IRegisterState = { message: "", errors: {} };
  const [state, formAction] = useFormState(register, initialState);
  const { errors } = state ?? {};

  const handleChangeIsSearching = (value: boolean) => {
    setIsSubmitting(value);
  };

  return (
    <div className="w-full sm:w-1/2 flex flex-col justify-center">
      <div className="text-center">
        <h1 className="text-3xl md:text-6xl">REGISTER</h1>
        {state?.message && <p className="text-red-600">{state?.message}</p>}
      </div>
      <form action={formAction} className="w-1/2 m-auto">
        <fieldset disabled={isSubmitting}>
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
            <SubmitButton
              title="REGISTER"
              handleChangeIsSearching={handleChangeIsSearching}
            />
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default TempForm;

const GenericDiv = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-col gap-2 w-full">{children}</div>;
};
