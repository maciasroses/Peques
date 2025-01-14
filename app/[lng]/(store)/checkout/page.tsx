import { getMe } from "@/app/shared/services/user/controller";
import { CheckoutSummary } from "./components";
import type { IBaseLangPage, IUser } from "@/app/shared/interfaces";

interface ICheckoutPage extends IBaseLangPage {}

const CheckoutPage = async ({ params: { lng } }: ICheckoutPage) => {
  const me = (await getMe()) as IUser;
  if (!me) throw new Error("User not found");

  return (
    <>
      <CheckoutSummary lng={lng} user={me} />
    </>
  );
};

export default CheckoutPage;
