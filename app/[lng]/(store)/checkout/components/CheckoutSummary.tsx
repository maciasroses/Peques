"use client";

import { useState } from "react";
import AddressTab from "./AddressTab";
import CartSummary from "./CartSummary";
import CheckoutTab from "./CheckoutTab";
import { cn } from "@/app/shared/utils/cn";
import { DownChevron } from "@/app/shared/icons";
import { useCheckout, useResolvedTheme } from "@/app/shared/hooks";
import { Loading, GenericBackToPage } from "@/app/shared/components";
import type { IAddress, IDiscountCode, IUser } from "@/app/shared/interfaces";

interface ICheckoutSummary {
  lng: string;
  user: IUser;
}

const CheckoutSummary = ({ lng, user }: ICheckoutSummary) => {
  const theme = useResolvedTheme();
  const [activeTab, setActiveTab] = useState(1);
  const [finished, setFinished] = useState(false);
  const [discountCode, setDiscountCode] = useState<IDiscountCode | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [address, setAddress] = useState<IAddress | null>(
    user.addresses.find((address) => address.isDefault) || null
  );
  const { cart, isLoading, shippingCost, clientSecret, handleSetUpIntent } =
    useCheckout({
      lng,
      theme,
      discountCode,
      addressId: address?.id,
      paymentMethodId: selectedMethod ?? "",
    });

  const toggleTab = (index: number) => {
    setActiveTab(activeTab === index ? 1 : index);
  };

  const handleFinish = () => {
    setFinished((prev) => !prev);
  };

  if (isLoading) return <LoadingScreen />;
  if (cart.length === 0) return <EmptyCart lng={lng} />;

  return (
    <section className="pt-32 px-4 pb-4 flex flex-col md:flex-row gap-4">
      <CartSummary
        lng={lng}
        cart={cart}
        finished={finished}
        shippingCost={shippingCost}
        discountCode={discountCode}
        setDiscountCode={setDiscountCode}
      />
      <div className="w-full md:w-1/3 flex flex-col gap-4 h-full md:sticky md:top-24">
        <div
          className={cn(
            "border-b py-4 transition duration-200",
            finished && "opacity-50"
          )}
        >
          <button
            disabled={finished}
            onClick={() => toggleTab(1)}
            className="w-full py-4 flex justify-between items-center transition duration-200"
          >
            <p className="text-xl font-semibold">Dirección de envío</p>
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
            <AddressTab
              setAddress={setAddress}
              addressSelected={address}
              addresses={user.addresses}
            />
          )}
        </div>
        <div
          className={cn(
            "border-b py-4 transition duration-200",
            (!address || finished) && "opacity-50"
          )}
        >
          <button
            disabled={!address || finished}
            onClick={() => toggleTab(2)}
            className="w-full py-4 flex justify-between items-center transition duration-200"
          >
            <p className="text-xl font-semibold">Método de pago</p>
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
            <CheckoutTab
              lng={lng}
              user={user}
              theme={theme}
              isLoading={isLoading}
              address={address as IAddress}
              clientSecret={clientSecret}
              handleFinish={handleFinish}
              selectedMethod={selectedMethod}
              handleSetUpIntent={handleSetUpIntent}
              setSelectedMethod={setSelectedMethod}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default CheckoutSummary;

const LoadingScreen = () => (
  <div className="flex justify-center items-center h-screen pt-32">
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
