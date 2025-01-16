import Stripe from "stripe";
import { Resend } from "resend";
import OrderReceipt from "@/app/email/OrderReceipt";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/shared/services/prisma";
import { createOrderThroughStripeWebHook } from "@/app/shared/services/order/controller";
import {
  IOrder,
  IOrderInfoForEmail,
  IProductFromStripe,
  IStockReservation,
} from "@/app/shared/interfaces";
import { getProductByKey } from "@/app/shared/services/product/controller";
import {
  deleteStockReservation,
  readStockReservation,
} from "@/app/shared/services/stock/model";
import { createInventoryTransactionThroughStripeWebHook } from "@/app/shared/services/inventoryTrans/controller";
import React from "react";
import { genericParseJSON } from "@/app/shared/utils/genericParseJSON";
import { Prisma } from "@prisma/client";

const resend = new Resend(process.env.RESEND_API_KEY as string);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      await req.text(),
      req.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    console.error("❌ Stripe webhook signature verification failed:", err);
    return new NextResponse("Webhook signature verification failed", {
      status: 400,
    });
  }
  console.log("✅ Event constructed successfully:", event.id);

  switch (event.type) {
    case "setup_intent.created": {
      console.log("🟡 Setup created");
      const setupIntent = event.data.object;
      console.log(`SetupIntent status: ${setupIntent.status}`);
      break;
    }
    case "setup_intent.succeeded": {
      console.log("🟢 Setup succeeded");
      const setupIntent = event.data.object;
      console.log(`SetupIntent status: ${setupIntent.status}`);
      break;
    }
    case "setup_intent.setup_failed": {
      console.error("❌ Setup failed");
      const setupIntent = event.data.object;
      console.log(`Message: ${setupIntent.last_setup_error?.message}`);
      console.log(`SetupIntent id: ${setupIntent.id}`);
      break;
    }
    case "payment_method.attached": {
      console.log("🔗 PaymentMethod attached");
      const paymentMethod = event.data.object;
      console.log(`PaymentMethod id: ${paymentMethod.id}`);
      break;
    }
    case "payment_intent.created": {
      console.log("💳 Payment created");
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent status: ${paymentIntent.status}`);
      break;
    }
    case "payment_intent.succeeded": {
      console.log("💰 Payment received");
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent status: ${paymentIntent.status}`);
      break;
    }
    case "payment_intent.payment_failed": {
      console.error("❌ Payment failed");
      const paymentIntent = event.data.object;
      console.log(`Message: ${paymentIntent.last_payment_error?.message}`);
      console.log(`PaymentIntent id: ${paymentIntent.id}`);
      break;
    }
    case "payment_method.updated": {
      console.log("🔄 PaymentMethod updated");
      const paymentMethod = event.data.object;
      console.log(`PaymentMethod id: ${paymentMethod.id}`);
      break;
    }
    case "charge.updated": {
      console.log("🔄 Charge updated");
      const charge = event.data.object;
      console.log(`Charge status: ${charge.status}`);
      break;
    }
    case "charge.succeeded": {
      console.log("💰 Payment received!");
      const charge = event.data.object;
      console.log(`Charge id: ${charge.id}`);

      const { userId, products, addressId, shippingCost } = charge.metadata;

      if (!userId || !products || !addressId || !shippingCost) {
        console.error("❌ Missing metadata");
        return new NextResponse("Missing metadata", { status: 400 });
      }

      const parsedProducts = genericParseJSON<IProductFromStripe[]>(products);

      try {
        await prisma.$transaction(async () => {
          const order = (await createOrderThroughStripeWebHook({
            userId,
            amount: Number(charge.amount / 100),
            addressId,
            stripePaymentMethodId: charge.payment_method as string,
            productsIds: parsedProducts.map((product) => product.id),
            productsPrices: parsedProducts.map((product) => product.price),
            productsQuantities: parsedProducts.map(
              (product) => product.quantity
            ),
            paymentMethodFromStripe: `${charge.payment_method_details?.card?.brand} ${charge.payment_method_details?.card?.funding}`,
          })) as IOrder;

          for (const product of parsedProducts) {
            const { id: productId } = (await getProductByKey({
              key: product.id,
            })) as { id: string };

            const reservation = (await readStockReservation({
              userId,
              productId: productId,
              isForSripeWebHook: true,
            })) as IStockReservation;

            if (reservation) {
              await createInventoryTransactionThroughStripeWebHook({
                productId,
                quantity: reservation.quantity,
                description: `Product ${productId} sold in order ${order.id}`,
              });
              await deleteStockReservation(reservation.id);
            }
          }

          const orderInfoForEmail: IOrderInfoForEmail = {
            order,
            products: parsedProducts,
            totalInCents: charge.amount,
            email: charge.billing_details.email as string,
          };

          await resend.emails.send({
            from: `Peques <${process.env.RESEND_EMAIL}>`,
            to: charge.billing_details.email as string,
            subject: "Recibo de compra",
            react: React.createElement(OrderReceipt, {
              order: orderInfoForEmail,
            }),
          });
        });

        console.log("✅ Transaction completed successfully");
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          console.error("❌ Database error:", error);
          return new NextResponse("Database transaction failed", {
            status: 500,
          });
        }

        console.error("❌ Unexpected error:", error);
        return new NextResponse("Unexpected error", { status: 500 });
      }

      break;
    }
    default: {
      console.warn(`⚠️ Unhandled event type: ${event.type}`);
      break;
    }
  }
  return new NextResponse("Webhook received", { status: 200 });
}
