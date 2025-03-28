import { Form } from "./components";
import { redirect } from "next/navigation";
import { getMe } from "@/app/shared/services/user/controller";
import type { IBaseLangPage, IUser } from "@/app/shared/interfaces";

const UnsubscribePage = async ({ params: { lng } }: IBaseLangPage) => {
  const me = (await getMe()) as IUser;

  if (!me) {
    redirect(`/${lng}/login`);
  }

  return (
    <article className="pt-40 px-4 pb-4 min-h-screen flex flex-col justify-center items-center gap-4">
      <Form lng={lng} currentOption={me.wantsNewsletter} />
    </article>
  );
};

export default UnsubscribePage;
