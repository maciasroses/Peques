"use server";

import Stripe from "stripe";
import { getSession } from "@/app/shared/services/auth";
import {
  readPaymentMethod,
  createPaymentMethod,
  updatePaymentMethod,
} from "./model";
import type {
  IUser,
  IPaymentMethod,
  IPaymentMethodSearchParams,
} from "@/app/shared/interfaces";
import { getMe } from "../user/controller";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function getMyActivePaymentMethods({
  page,
}: IPaymentMethodSearchParams) {
  try {
    const session = await getSession();
    if (!session || !session.userId) return null;
    return await readPaymentMethod({
      page,
      userId: session.userId as string,
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getPaymentMethodByStripeId({
  isAdminRequest,
  stripePaymentMethodId,
}: IPaymentMethodSearchParams) {
  try {
    return await readPaymentMethod({
      isAdminRequest,
      stripePaymentMethodId,
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}

interface IDataToValidateCard {
  last4Digits: string;
  expiryMonth: number;
  expiryYear: number;
  brand: string;
}

export async function validateCardBeforeCreation(
  data: IDataToValidateCard
): Promise<boolean> {
  try {
    const me = (await getMe()) as IUser;
    if (!me || !me.stripeCustomerId) {
      throw new Error("Failed to get user or user has no stripeCustomerId");
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: me.stripeCustomerId,
      type: "card",
    });

    if (!paymentMethods || paymentMethods.data === undefined) {
      throw new Error("Failed to retrieve payment methods");
    }

    const cardExists = paymentMethods.data.some(
      (method) =>
        method.card?.last4 === data.last4Digits &&
        method.card?.exp_month === data.expiryMonth &&
        method.card?.exp_year === data.expiryYear &&
        method.card?.brand.toUpperCase() === data.brand.toUpperCase()
    );

    return !cardExists;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function savePaymentMethod(paymentMethodId: string) {
  try {
    const session = await getSession();
    if (!session || !session.userId) return null;

    const cardInformation =
      await stripe.paymentMethods.retrieve(paymentMethodId);

    if (!cardInformation || cardInformation.card === undefined) {
      throw new Error("Failed to retrieve card information");
    }

    return await createPaymentMethod({
      data: {
        userId: session.userId as string,
        brand: cardInformation.card.brand,
        last4Digits: cardInformation.card.last4,
        expiryYear: cardInformation.card.exp_year,
        expiryMonth: cardInformation.card.exp_month,
        stripePaymentMethodId: paymentMethodId,
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function setAsDefaultPaymentMethod(paymentMethodId: string) {
  try {
    const session = await getSession();
    if (!session || !session.userId) return null;

    const paymentMethod = (await readPaymentMethod({
      id: paymentMethodId,
      userId: session.userId as string,
    })) as IPaymentMethod;

    if (!paymentMethod) throw new Error("Payment method not found");

    await updatePaymentMethod({
      id: paymentMethodId,
      data: {
        isDefault: true,
      },
    });

    await stripe.paymentMethods.update(paymentMethod.stripePaymentMethodId, {
      metadata: {
        isDefault: "true",
      },
    });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function deactivatePaymentMethod(paymentMethodId: string) {
  try {
    const session = await getSession();
    if (!session || !session.userId) return null;

    await updatePaymentMethod({
      id: paymentMethodId,
      data: {
        isActive: false,
      },
    });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
