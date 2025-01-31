import Stripe from "stripe";
import { AllGood } from "./components";
import { GenericBackToPage } from "@/app/shared/components";
import { processMetadata } from "@/app/shared/services/stripe/payment";
import type { Metadata } from "next";
import type { IBaseLangPage } from "@/app/shared/interfaces";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

interface ICheckoutSuccessPage extends IBaseLangPage {
  searchParams: {
    payment_intent: string;
  };
}

export async function generateMetadata({
  searchParams: { payment_intent },
}: ICheckoutSuccessPage): Promise<Metadata> {
  if (!payment_intent || typeof payment_intent !== "string") {
    return {
      title: "Pago fallido",
    };
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);

    if (!paymentIntent.metadata.userId) {
      return {
        title: "Pago fallido",
      };
    }

    const isSuccess = paymentIntent.status === "succeeded";
    const isPending = paymentIntent.status === "requires_action";
    const isFailed = ["requires_payment_method", "canceled"].includes(
      paymentIntent.status
    );

    if (isSuccess && paymentIntent.metadata.processed) {
      return {
        title: "Pago ya procesado",
      };
    } else if (isSuccess) {
      return {
        title: "Compra exitosa",
      };
    } else if (isPending) {
      return {
        title: "Pago pendiente",
      };
    } else if (isFailed) {
      return {
        title: "Pago fallido",
      };
    }
  } catch {
    return {
      title: "Pago fallido",
    };
  }

  return {
    title: "Pago fallido",
  };
}

const CheckoutSuccessPage = async ({
  params: { lng },
  searchParams: { payment_intent },
}: ICheckoutSuccessPage) => {
  if (!payment_intent || typeof payment_intent !== "string") {
    return (
      <GenericBackToPage
        link={`/${lng}/checkout`}
        title={lng === "en" ? "Payment failed" : "Pago fallido"}
        linkText={
          lng === "en" ? "Back to checkout" : "Volver al proceso de pago"
        }
        description={
          lng === "en"
            ? "The payment was not successful"
            : "El pago no fue exitoso"
        }
      />
    );
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);

    if (
      !paymentIntent.metadata.userId ||
      !paymentIntent.metadata.shippingCost
    ) {
      return (
        <GenericBackToPage
          link={`/${lng}/checkout`}
          title={lng === "en" ? "Payment failed" : "Pago fallido"}
          linkText={
            lng === "en" ? "Back to checkout" : "Volver al proceso de pago"
          }
          description={
            lng === "en"
              ? "The payment was not successful"
              : "El pago no fue exitoso"
          }
        />
      );
    }

    const isSuccess = paymentIntent.status === "succeeded";
    const isPending = paymentIntent.status === "requires_action";
    const isFailed = ["requires_payment_method", "canceled"].includes(
      paymentIntent.status
    );

    if (isSuccess && paymentIntent.metadata.processed) {
      return (
        <GenericBackToPage
          link={`/${lng}/profile/orders`}
          title={
            lng === "en" ? "Payment already processed" : "Pago ya procesado"
          }
          linkText={lng === "en" ? "Go to my orders" : "Ir a mis pedidos"}
          description={
            lng === "en"
              ? "This payment has already been processed."
              : "Este pago ya fue procesado."
          }
        />
      );
    }

    if (isSuccess) {
      await processMetadata(paymentIntent);
      return <AllGood lng={lng} />;
    } else if (isPending) {
      return (
        <GenericBackToPage
          link={`/${lng}/checkout`}
          title={
            lng === "en" ? "Payment requires action" : "Pago requiere acción"
          }
          linkText={lng === "en" ? "Complete payment" : "Completar pago"}
          description={
            lng === "en"
              ? "Additional steps are required to complete your payment."
              : "Se necesitan pasos adicionales para completar su pago."
          }
        />
      );
    } else if (isFailed) {
      return (
        <GenericBackToPage
          link={`/${lng}/checkout`}
          title={lng === "en" ? "Payment failed" : "Pago fallido"}
          linkText={lng === "en" ? "Try again" : "Intentar de nuevo"}
          description={
            lng === "en"
              ? "Your payment could not be processed."
              : "No se pudo procesar su pago."
          }
        />
      );
    }
  } catch (error) {
    console.error("Stripe error:", error);
    const message =
      error instanceof Error && error.message
        ? error.message
        : lng === "en"
          ? "An unexpected error occurred."
          : "Ocurrió un error inesperado.";
    return (
      <GenericBackToPage
        link={`/${lng}/checkout`}
        title={lng === "en" ? "Payment failed" : "Pago fallido"}
        linkText={
          lng === "en" ? "Back to checkout" : "Volver al proceso de pago"
        }
        description={message}
      />
    );
  }
};

export default CheckoutSuccessPage;
