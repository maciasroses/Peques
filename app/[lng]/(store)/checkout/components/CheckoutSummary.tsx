"use client";

import CartSummary from "./CartSummary";
import { Loading } from "@/app/shared/components";
import StripeCheckoutForm from "./StripeCheckoutForm";
import { useResolvedTheme } from "@/app/shared/hooks";
import { useCheckout } from "@/app/shared/hooks/useCheckout";
import GenericBackToPage from "@/app/shared/components/GenericBackToPage";
import { useState } from "react";
import { DownChevron } from "@/app/shared/icons";
import { cn } from "@/app/shared/utils/cn";
import { IAddress, IUser } from "@/app/shared/interfaces";

interface ICheckoutSummary {
  lng: string;
  user: IUser;
}

const CheckoutSummary = ({ lng, user }: ICheckoutSummary) => {
  const theme = useResolvedTheme();
  const [activeTab, setActiveTab] = useState<number>(1);
  const [address, setAddress] = useState<IAddress | null>(null);

  console.log(address);

  const { cart, isLoading, clientSecret, shippingCost } = useCheckout({
    lng,
    theme,
  });

  const toggleTab = (index: number) => {
    setActiveTab(activeTab === index ? 1 : index);
  };

  if (isLoading) return <LoadingScreen />;
  if (cart.length === 0) return <EmptyCart lng={lng} />;

  return (
    <section className="pt-24 px-4 pb-4 flex flex-col md:flex-row gap-4">
      <CartSummary lng={lng} cart={cart} shippingCost={shippingCost} />
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        <div className="border-b py-4">
          <button
            onClick={() => toggleTab(1)}
            className="w-full py-4 flex justify-between items-center transition duration-200"
          >
            <p className="text-lg font-semibold">Dirección de envío</p>
            <span
              className={cn(
                "transform transition-all duration-300",
                activeTab === 1 ? "rotate-180" : "rotate-0"
              )}
            >
              <DownChevron />
            </span>
          </button>
          {activeTab === 1 && (
            <div>
              Componente de dirección de envío
              <button onClick={() => setAddress(user.addresses[0])}>
                Establecer dirección de envío {user.addresses[0].address1}
              </button>
            </div>
          )}
        </div>
        <div
          className={cn(
            "border-b py-4 transition duration-200 ",
            !address && "opacity-50"
          )}
        >
          <button
            disabled={!address}
            onClick={() => toggleTab(2)}
            className="w-full py-4 flex justify-between items-center transition duration-200"
          >
            <p className="text-lg font-semibold">Método de pago</p>
            <span
              className={cn(
                "transform transition-all duration-300",
                activeTab === 2 ? "rotate-180" : "rotate-0"
              )}
            >
              <DownChevron />
            </span>
          </button>
          {activeTab === 2 && (
            <StripeCheckoutForm
              lng={lng}
              user={user}
              theme={theme}
              address={address as IAddress}
              clientSecret={clientSecret}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default CheckoutSummary;

const LoadingScreen = () => (
  <div className="flex justify-center items-center h-screen pt-24">
    <Loading size="size-20" />
  </div>
);

const EmptyCart = ({ lng }: { lng: string }) => (
  <GenericBackToPage
    link={`/${lng}`}
    title={lng === "en" ? "Your cart is empty" : "Tu carrito está vacío"}
    linkText={lng === "en" ? "Go back to shop" : "Regresar a la tienda"}
    description={
      lng === "en"
        ? "Add some items to your cart"
        : "Agrega algunos artículos a tu carrito"
    }
  />
);
