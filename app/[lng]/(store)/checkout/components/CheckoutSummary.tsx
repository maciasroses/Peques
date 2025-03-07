"use client";

import { useState } from "react";
import AddressTab from "./AddressTab";
import CartSummary from "./CartSummary";
import CheckoutTab from "./CheckoutTab";
import { cn } from "@/app/shared/utils/cn";
import { DownChevron } from "@/app/shared/icons";
import PickUpAddressTab from "./PickUpAddressTab";
import { useCheckout, useResolvedTheme } from "@/app/shared/hooks";
import { Loading, GenericBackToPage } from "@/app/shared/components";
import type {
  IUser,
  IAddress,
  IDiscountCode,
  IPickUpAddress,
} from "@/app/shared/interfaces";

interface ICheckoutSummary {
  lng: string;
  user: IUser;
}

const CheckoutSummary = ({ lng, user }: ICheckoutSummary) => {
  const theme = useResolvedTheme();
  const [activeTab, setActiveTab] = useState(1);
  const [finished, setFinished] = useState(false);
  const [pickUp, setPickUp] = useState<IPickUpAddress | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [discountCode, setDiscountCode] = useState<IDiscountCode | null>(null);
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
    if (index === 1) {
      setPickUp(null);
    } else if (index === 2) {
      setAddress(null);
    }
  };

  const handleFinish = () => {
    setFinished((prev) => !prev);
  };

  const handleSetAddress = (address: IAddress) => {
    setPickUp(null);
    setAddress(address);
  };

  const handleSetPickUpAddress = (pickUpAddress: IPickUpAddress) => {
    setAddress(null);
    setPickUp(pickUpAddress);
  };

  if (isLoading) return <LoadingScreen />;
  if (cart.length === 0) return <EmptyCart lng={lng} />;

  return (
    <section className="pt-32 md:pt-48 px-4 md:px-28 pb-4 md:pb-28 flex flex-col gap-4">
      <CartSummary
        lng={lng}
        cart={cart}
        finished={finished}
        shippingCost={shippingCost}
        discountCode={discountCode}
        setDiscountCode={setDiscountCode}
        isShippingInformationSelected={!!address || !!pickUp}
      />
      <div className="w-full flex flex-col gap-4 h-full">
        <div>
          <p className="text-2xl font-semibold mb-2">Entrega</p>
          <div className="flex flex-col border rounded-lg">
            <div
              className={cn(
                "px-4 transition duration-200",
                finished && "opacity-50",
                (activeTab === 1 || address) &&
                  "border border-primary bg-primary/20 rounded-t-lg pb-4"
              )}
            >
              <button
                disabled={finished}
                onClick={() => toggleTab(1)}
                className="w-full py-4 flex justify-between items-center transition duration-200"
              >
                <p className="text-xl font-semibold">Dirección de envío</p>
                <div
                  className={cn(
                    "w-6 h-6 rounded-full border border-black",
                    activeTab === 1 || address ? "bg-primary" : "bg-gray-200"
                  )}
                />
              </button>
              {(activeTab === 1 || address) && (
                <AddressTab
                  addressSelected={address}
                  addresses={user.addresses}
                  setAddress={handleSetAddress}
                />
              )}
            </div>
            <div
              className={cn(
                "px-4 transition duration-200",
                finished && "opacity-50",
                (activeTab === 2 || pickUp) &&
                  "border border-primary bg-primary/20 rounded-b-lg pb-4"
              )}
            >
              <button
                disabled={finished}
                onClick={() => toggleTab(2)}
                className="w-full py-4 flex justify-between items-center transition duration-200"
              >
                <p className="text-xl font-semibold">Recoger en tienda</p>
                <div
                  className={cn(
                    "w-6 h-6 rounded-full border border-black",
                    activeTab === 2 || pickUp ? "bg-primary" : "bg-gray-200"
                  )}
                />
              </button>
              {(activeTab === 2 || pickUp) && (
                <PickUpAddressTab
                  pickUpAddressSelected={pickUp}
                  setPickUpAddress={handleSetPickUpAddress}
                />
              )}
            </div>
          </div>
        </div>
        <div
          className={cn(
            "border-b py-4 transition duration-200",
            (finished || (!address && !pickUp)) && "opacity-50"
          )}
        >
          <button
            disabled={finished || (!address && !pickUp)}
            onClick={() => toggleTab(3)}
            className="w-full py-4 flex justify-between items-center transition duration-200"
          >
            <p className="text-xl font-semibold">Método de pago</p>
            <span
              className={cn(
                "transform transition-all duration-300",
                activeTab === 3 ? "rotate-180" : "rotate-0"
              )}
            >
              <DownChevron />
            </span>
          </button>
          {activeTab === 3 && (
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
