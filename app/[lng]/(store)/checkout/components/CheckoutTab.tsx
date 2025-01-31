import { useState } from "react";
import { cn } from "@/app/shared/utils/cn";
import { PlusCircle } from "@/app/shared/icons";
import { PaymentMethodCard } from "@/app/shared/components";
import { loadStripe, StripeElementLocale } from "@stripe/stripe-js";
import { updateBillingDetails } from "@/app/shared/services/stripe/payment";
import {
  savePaymentMethod,
  validateCardBeforeCreation,
} from "@/app/shared/services/paymentMethod/controller";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import type { IAddress, IUser } from "@/app/shared/interfaces";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

interface ICheckoutTab {
  lng: string;
  user: IUser;
  theme: string;
  address: IAddress | null;
  isLoading: boolean;
  clientSecret: string;
  handleFinish: () => void;
  selectedMethod: string | null;
  handleSetUpIntent: (value: boolean) => void;
  setSelectedMethod: (method: string | null) => void;
}

const CheckoutTab = ({
  lng,
  user,
  theme,
  address,
  isLoading,
  clientSecret,
  handleFinish,
  selectedMethod,
  handleSetUpIntent,
  setSelectedMethod,
}: ICheckoutTab) => {
  const appearance: {
    theme: "night" | "stripe";
  } = {
    theme: theme === "dark" ? "night" : "stripe",
  };

  const options = {
    appearance,
    clientSecret,
    locale: lng as StripeElementLocale,
  };

  return (
    <>
      {clientSecret.length > 0 && (
        <Elements options={options} stripe={stripePromise}>
          <StripeForm
            lng={lng}
            user={user}
            theme={theme}
            address={address}
            clientSecret={clientSecret}
            handleFinish={handleFinish}
            isLoadingFromHook={isLoading}
            selectedMethod={selectedMethod}
            handleSetUpIntent={handleSetUpIntent}
            setSelectedMethod={setSelectedMethod}
          />
        </Elements>
      )}
    </>
  );
};

export default CheckoutTab;

interface IStripeForm {
  lng: string;
  user: IUser;
  theme: string;
  address: IAddress | null;
  clientSecret: string;
  handleFinish: () => void;
  isLoadingFromHook: boolean;
  selectedMethod: string | null;
  handleSetUpIntent: (value: boolean) => void;
  setSelectedMethod: (method: string | null) => void;
}

const StripeForm = ({
  lng,
  user,
  theme,
  address,
  clientSecret,
  handleFinish,
  selectedMethod,
  isLoadingFromHook,
  handleSetUpIntent,
  setSelectedMethod,
}: IStripeForm) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleConfirmPayment = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isLoadingFromHook || stripe == null || elements == null) return;

    setIsLoading(true);
    handleFinish();

    try {
      if (selectedMethod) {
        if (address) {
          const BILLING_DETAILS = {
            email: user.email,
            name: address.fullName,
            phone: address.phoneNumber ?? undefined,
            address: {
              city: address.city,
              state: address.state,
              line1: address.address1,
              line2: address.address2 ?? undefined,
              country: address.country,
              postal_code: address.zipCode.toString(),
            },
          };

          await updateBillingDetails({
            paymentMethodId: selectedMethod,
            billing_details: BILLING_DETAILS,
          });
        }

        const { error } = await stripe.confirmPayment({
          clientSecret,
          confirmParams: {
            return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/${lng}/checkout/success`,
          },
        });

        if (error) throw error;
      } else {
        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
          throw new Error("Failed to get card element");
        }

        const { token, error: tokenError } =
          await stripe.createToken(cardElement);

        if (tokenError) {
          throw new Error(tokenError.message);
        }

        const dataToValidateCard = {
          brand: token.card?.brand ?? "",
          last4Digits: token.card?.last4 ?? "",
          expiryYear: token.card?.exp_year ?? 0,
          expiryMonth: token.card?.exp_month ?? 0,
        };

        const cardIsValid =
          await validateCardBeforeCreation(dataToValidateCard);

        if (!cardIsValid) {
          throw new Error("La tarjeta ya ha sido registrada");
        }

        const { setupIntent, error } = await stripe.confirmCardSetup(
          clientSecret,
          {
            payment_method: {
              card: cardElement,
            },
          }
        );

        if (error) throw error;

        await savePaymentMethod(setupIntent.payment_method as string);
        handleChangePaymentMethod(setupIntent.payment_method as string);
      }
    } catch (error) {
      setErrorMessage((error as Error).message ?? "An unknown error occurred");
    } finally {
      setIsLoading(false);
      handleFinish();
    }
  };

  const handleChangePaymentMethod = (method?: string) => {
    setErrorMessage("");
    handleSetUpIntent(method ? false : true);
    setSelectedMethod(method ?? null);
  };

  if (!selectedMethod) {
    // ORDERED BY DEFAULT
    user.paymentMethods.sort((a, b) => {
      if (a.isDefault) return -1;
      if (b.isDefault) return 1;
      return 0;
    });
  } else {
    // ORDERED BY SELECTED METHOD
    user.paymentMethods.sort((a, b) => {
      if (a.stripePaymentMethodId === selectedMethod) return -1;
      if (b.stripePaymentMethodId === selectedMethod) return 1;
      return 0;
    });
  }

  return (
    <form onSubmit={handleConfirmPayment}>
      <fieldset
        disabled={
          stripe == null || elements == null || isLoading || isLoadingFromHook
        }
        className={cn(
          (stripe == null ||
            elements == null ||
            isLoading ||
            isLoadingFromHook) &&
            "opacity-50"
        )}
      >
        {errorMessage && (
          <p className="text-[#cb3544] dark:text-[#c87688] font-bold mb-2">
            {errorMessage}
          </p>
        )}

        {/* Lista de métodos de pago guardados */}
        <ul className="flex flex-col gap-2 overflow-y-auto mb-4 max-h-[300px]">
          {user.paymentMethods.map((method) => (
            <li key={method.id}>
              <button
                type="button"
                className={cn(
                  "w-full border-2 rounded-lg text-left",
                  selectedMethod === method.stripePaymentMethodId
                    ? "border-primary bg-primary-light dark:border-primary-dark dark:bg-primary-dark/50"
                    : "border-gray-200"
                )}
                onClick={() =>
                  handleChangePaymentMethod(method.stripePaymentMethodId)
                }
              >
                <PaymentMethodCard paymentMethod={method} />
              </button>
            </li>
          ))}
        </ul>
        {selectedMethod && (
          <div className="mt-4 w-full text-center">
            <button
              type="button"
              disabled={isLoading || isLoadingFromHook}
              onClick={() => handleChangePaymentMethod()}
              className={cn(
                "inline-flex gap-2 items-center justify-center",
                isLoading || isLoadingFromHook
                  ? "py-2 px-4 bg-gray-300 dark:bg-gray-800 cursor-not-allowed rounded-md"
                  : "link-button-primary"
              )}
            >
              Agregar nueva tarjeta
              <span>
                <PlusCircle />
              </span>
            </button>
          </div>
        )}

        {/* Nueva tarjeta */}
        {selectedMethod === null && (
          <CardElement
            options={{
              style: {
                base: {
                  color: theme === "dark" ? "#ffffff" : "#000000",
                  fontSize: "16px",
                  "::placeholder": {
                    color: theme === "dark" ? "#cfcfcf" : "#a0a0a0",
                  },
                },
              },
            }}
          />
        )}

        <button
          type="submit"
          disabled={
            stripe == null || elements == null || isLoading || isLoadingFromHook
          }
          className={cn(
            "w-full mt-4",
            stripe == null || elements == null || isLoading || isLoadingFromHook
              ? "py-2 bg-gray-300 dark:bg-gray-800 cursor-not-allowed rounded-md"
              : "link-button-primary"
          )}
        >
          {isLoading
            ? "Procesando..."
            : selectedMethod
              ? "Pagar ahora"
              : "Guardar tarjeta"}
        </button>
      </fieldset>
    </form>
  );
};
