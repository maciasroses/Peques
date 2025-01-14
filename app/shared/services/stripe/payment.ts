"use server";

import Stripe from "stripe";
import {
  getMe,
  addStripeCustomerIdToMe,
} from "@/app/shared/services/user/controller";
import type { IUser, ICartItemForFrontend } from "@/app/shared/interfaces";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function createPaymentIntent(
  cart: ICartItemForFrontend[],
  paymentMethodId: string
) {
  try {
    const me = (await getMe()) as IUser;
    if (!me) {
      throw new Error("Failed to get user");
    }

    await createStriperCustomer({ me });

    const paymentIntent = await stripe.paymentIntents.create({
      customer: me.stripeCustomerId || undefined,
      payment_method: paymentMethodId,
      amount:
        cart.reduce((acc, item) => acc + item.price * 100 * item.quantity, 0) +
        9900, // *100 for cents and 9900 for 99MXN for shipping
      currency: "MXN",
      metadata: {
        userId: me.id,
        productsIds: JSON.stringify(cart.map((item) => item.id)),
        productsNames: JSON.stringify(cart.map((item) => item.name)),
        productsFiles: JSON.stringify(cart.map((item) => item.file)),
        productsPrices: JSON.stringify(cart.map((item) => item.price)),
        productsQuantities: JSON.stringify(cart.map((item) => item.quantity)),
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
