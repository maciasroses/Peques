import { cn } from "@/app/shared/utils/cn";
import { loadStripe, StripeElementLocale } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { IAddress, IUser } from "@/app/shared/interfaces";

interface IStripeCheckoutForm {
  lng: string;
  user: IUser;
  theme: string;
  address: IAddress;
  clientSecret: string;
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const StripeCheckoutForm = ({
  lng,
  user,
  theme,
  address,
  clientSecret,
}: IStripeCheckoutForm) => {
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
          <StripeForm lng={lng} user={user} address={address} />
        </Elements>
      )}
    </>
  );
};

export default StripeCheckoutForm;

interface IStripeForm {
  lng: string;
  user: IUser;
  address: IAddress;
}

const StripeForm = ({ lng, user, address }: IStripeForm) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleConfirmPayment = async (event: React.FormEvent) => {
    event.preventDefault();

    if (stripe == null || elements == null) return;

    setIsLoading(true);

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/${lng}/checkout/success`,
          payment_method_data: {
            billing_details: {
              email: user.email,
              name: address.fullName,
              phone: address.phoneNumber,
              address: {
                city: address.city,
                state: address.state,
                line1: address.address1,
                line2: address.address2,
                country: address.country,
                postal_code: address.zipCode,
              },
            },
          },
        },
      })
      .then(({ error }) => {
        if (error.type === "card_error" || error.type === "validation_error") {
          setErrorMessage(error.message);
        } else {
          setErrorMessage(
            lng === "en"
              ? "Something went wrong, please try again"
              : "Algo salió mal, por favor intenta de nuevo"
          );
        }
      })
      .finally(() => setIsLoading(false));
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
        <PaymentElement />
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
          {isLoading ? "Procesando..." : "Pagar ahora"}
        </button>
      </fieldset>
    </form>
  );
};
