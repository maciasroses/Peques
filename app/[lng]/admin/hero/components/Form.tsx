import { useState } from "react";
import { INITIAL_STATE_RESPONSE } from "@/app/shared/constants";
import { createHero } from "@/app/shared/services/hero/controller";
import type { IHeroState } from "@/app/shared/interfaces";

const Form = () => {
  const [isPending, setIsPending] = useState(false);
  const [badResponse, setBadResponse] = useState<IHeroState>(
    INITIAL_STATE_RESPONSE
  );

  const submitAction: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    setIsPending(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await createHero(formData);
    if (res && !res.success) {
      setBadResponse(res);
    }
    setIsPending(false);
  };

  return (
    <form onSubmit={submitAction} className="text-black">
      <input name="title" type="text" />
      <input name="subtitle" type="text" />
      <input name="description" type="text" />
      <input name="link" type="text" />
      <input name="imageUrl" type="file" accept="image/webp" />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Form;
