import { CheckoutSummary } from "./components";
import { getMe } from "@/app/shared/services/user/controller";
import type { Metadata } from "next";
import type { IBaseLangPage, IUser } from "@/app/shared/interfaces";

export const metadata: Metadata = {
  title: "Checkout",
};

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
