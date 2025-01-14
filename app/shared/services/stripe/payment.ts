"use server";

import Stripe from "stripe";
import { getMe } from "@/app/shared/services/user/controller";
import type { IUser, ICartItemForFrontend } from "@/app/shared/interfaces";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function createPaymentIntent(cart: ICartItemForFrontend[]) {
  try {
    const me = (await getMe()) as IUser;
    if (!me) {
      throw new Error("Failed to get user");
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount:
        cart.reduce((acc, item) => acc + item.price * 100 * item.quantity, 0) +
        9900, // *100 for cents and 9900 for 99MXN for shipping
      currency: "MXN",
      // payment_method:
      //   me.paymentMethods && me.paymentMethods.length > 0
      //     ? me.paymentMethods.find((method) => method.isDefault === true)
      //         ?.stripePaymentMethodId
      //     : undefined,
      // payment_method: "pm_1Qgz5p4cbtG1N3KFyCcgGLKD",
      // off_session: true,
      // confirm: true,
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
