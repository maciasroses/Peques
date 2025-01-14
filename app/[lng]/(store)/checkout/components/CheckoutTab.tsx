import { useState } from "react";
import { cn } from "@/app/shared/utils/cn";
import { useCheckout } from "@/app/shared/hooks/useCheckout";
import { loadStripe, StripeElementLocale } from "@stripe/stripe-js";
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
import { updateBillingDetails } from "@/app/shared/services/stripe/payment";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

interface ICheckoutTab {
  lng: string;
  user: IUser;
  theme: string;
  address: IAddress;
}

const CheckoutTab = ({ lng, user, theme, address }: ICheckoutTab) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(
    user.paymentMethods.find((method) => method.isDefault)
      ?.stripePaymentMethodId || null
  );
  const { clientSecret, handleSetUpIntent } = useCheckout({
    lng,
    theme,
    paymentMethodId: selectedMethod ?? "",
  });

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
  address: IAddress;
  clientSecret: string;
  selectedMethod: string | null;
  handleSetUpIntent: () => void;
  setSelectedMethod: (method: string | null) => void;
}

const StripeForm = ({
  lng,
  user,
  theme,
  address,
  clientSecret,
  selectedMethod,
  handleSetUpIntent,
  setSelectedMethod,
}: IStripeForm) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

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
      postal_code: address.zipCode,
    },
  };

  const handleConfirmPayment = async (event: React.FormEvent) => {
    event.preventDefault();

    if (stripe == null || elements == null) return;

    setIsLoading(true);

    try {
      if (selectedMethod) {
        await updateBillingDetails({
          paymentMethodId: selectedMethod,
          billing_details: BILLING_DETAILS,
        });

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
    }
  };

  const handleChangePaymentMethod = (method?: string) => {
    handleSetUpIntent();
    setErrorMessage("");
    setSelectedMethod(method ?? null);
  };

  return (
    <form onSubmit={handleConfirmPayment}>
      <fieldset
        disabled={stripe == null || elements == null || isLoading}
        className={cn(
          stripe == null || elements == null || (isLoading && "opacity-50")
        )}
      >
        {errorMessage && (
          <p className="text-[#cb3544] dark:text-[#c87688] font-bold mb-2">
            {errorMessage}
          </p>
        )}

        {/* Lista de métodos de pago guardados */}
        <div className="mb-4">
          {user.paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value={method.stripePaymentMethodId}
                checked={selectedMethod === method.stripePaymentMethodId}
                onChange={() =>
                  handleChangePaymentMethod(method.stripePaymentMethodId)
                }
              />
              <label className="ml-2">
                {method.brand} •••• {method.last4Digits} (Exp.{" "}
                {method.expiryMonth}/{method.expiryYear})
              </label>
            </div>
          ))}
          <div className="mt-2">
            <input
              type="radio"
              name="paymentMethod"
              value="new"
              checked={selectedMethod === null}
              onChange={() => handleChangePaymentMethod()}
            />
            <label className="ml-2">Agregar nueva tarjeta</label>
          </div>
        </div>

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
          disabled={stripe == null || elements == null || isLoading}
          className={cn(
            "w-full mt-4",
            stripe == null || elements == null || isLoading
              ? "py-2 bg-gray-300 dark:bg-gray-800 cursor-not-allowed"
              : "link-button-blue"
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
