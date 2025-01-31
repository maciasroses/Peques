"use server";

import Stripe from "stripe";
import {
  getMe,
  addStripeCustomerIdToMe,
} from "@/app/shared/services/user/controller";
import {
  clearOrderInfoDataForStripe,
  updateOrderInfoDataForStripe,
} from "@/app/shared/services/cart/controller";
import type {
  IUser,
  IDiscountCode,
  ICartItemForFrontend,
} from "@/app/shared/interfaces";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function createPaymentIntent(
  addressId: string | null,
  shippingCost: number,
  paymentMethodId: string,
  cart: ICartItemForFrontend[],
  discountCode?: IDiscountCode | null
) {
  try {
    const me = (await getMe()) as IUser;
    if (!me) {
      throw new Error("Failed to get user");
    }

    await createStriperCustomer({ me });

    const productsForStripeOrderInfoData = JSON.stringify(
      cart.map((item) => ({
        id: item.id,
        name: item.name,
        file: item.file,
        price: item.price,
        discount: item.discount,
        quantity: item.quantity,
        finalPrice: item.finalPrice,
        promotionId: item.promotionId,
        customRequest: item.customRequest,
      }))
    );

    await updateOrderInfoDataForStripe(productsForStripeOrderInfoData);

    const amount = Math.round(
      cart.reduce((acc, item) => acc + item.finalPrice * 100 * item.quantity, 0)
    );

    const possibleDiscount = discountCode
      ? Math.round(
          discountCode.promotion.discountType === "PERCENTAGE"
            ? (amount * discountCode.promotion?.discountValue) / 100
            : (discountCode?.promotion?.discountValue ?? 0) * 100
        )
      : 0;

    const paymentIntent = await stripe.paymentIntents.create({
      currency: "MXN",
      payment_method: paymentMethodId,
      customer: me.stripeCustomerId || undefined,
      amount:
        amount +
        shippingCost -
        (possibleDiscount > amount ? amount : possibleDiscount),
      metadata: {
        userId: me.id,
        addressId: addressId || null,
        shippingCost,
        discountCodeId: discountCode?.id || "",
      },
    });

    if (!paymentIntent || paymentIntent.client_secret === undefined) {
      throw new Error("Failed to create payment intent");
    }

    return paymentIntent.client_secret;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create payment intent");
  }
}

export async function createSetUpIntent() {
  try {
    const me = (await getMe()) as IUser;
    if (!me) {
      throw new Error("Failed to get user");
    }

    await createStriperCustomer({ me });

    const setupIntent = await stripe.setupIntents.create({
      customer: me.stripeCustomerId || undefined,
      payment_method_types: ["card"],
      metadata: {
        userId: me.id,
      },
    });

    if (!setupIntent || setupIntent.client_secret === undefined) {
      throw new Error("Failed to create setup intent");
    }

    return setupIntent.client_secret;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create setup intent");
  }
}

interface IUpdatePaymentMethod {
  paymentMethodId: string;
  billing_details: {
    email: string;
    name: string;
    phone: string | undefined;
    address: {
      city: string;
      state: string;
      line1: string;
      line2: string | undefined;
      country: string;
      postal_code: string;
    };
  };
}

export async function updateBillingDetails({
  paymentMethodId,
  billing_details,
}: IUpdatePaymentMethod) {
  try {
    const me = (await getMe()) as IUser;
    if (!me) {
      throw new Error("Failed to get user");
    }

    await stripe.paymentMethods.update(paymentMethodId, {
      billing_details,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to attach payment method");
  }
}

async function createStriperCustomer({ me }: { me: IUser }) {
  try {
    if (!me.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: me.email,
        name:
          me.firstName || me.lastName
            ? `${me.firstName} ${me.lastName}`
            : me.username,
      });

      if (!customer || customer.id === undefined) {
        throw new Error("Failed to create customer");
      }

      await stripe.customers.update(customer.id, {
        metadata: {
          userId: me.id,
        },
      });

      await addStripeCustomerIdToMe({ stripeCustomerId: customer.id });
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create customer");
  }
}

interface PaymentIntentMetadata {
  userId: string;
  shippingCost: string;
  processed?: string;
}

export async function processMetadata(paymentIntent: Stripe.PaymentIntent) {
  try {
    const metadata = paymentIntent.metadata as unknown as PaymentIntentMetadata;

    if (!metadata.userId || !metadata.shippingCost) {
      throw new Error("Missing required metadata fields");
    }

    if (metadata.processed === "true") {
      return { success: true, alreadyProcessed: true };
    }

    await stripe.paymentIntents.update(paymentIntent.id, {
      metadata: { processed: "true" },
    });

    await clearOrderInfoDataForStripe();

    return { success: true, alreadyProcessed: false };
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      console.error("Stripe-specific error:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    throw new Error("Failed to process payment metadata");
  }
}
