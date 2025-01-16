import { useState, useEffect } from "react";
import { useCart } from "@/app/shared/hooks";
import { Toast } from "@/app/shared/components";
import {
  reserverStock,
  checkNUpdateStock,
} from "@/app/shared/services/stock/controller";
import {
  createSetUpIntent,
  createPaymentIntent,
} from "@/app/shared/services/stripe/payment";
import type { ICartItemForFrontend } from "@/app/shared/interfaces";

interface UseCheckoutProps {
  lng: string;
  theme: string;
  addressId?: string;
  paymentMethodId?: string;
}

export const useCheckout = ({
  lng,
  theme,
  addressId,
  paymentMethodId,
}: UseCheckoutProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const { cart, clearCart, addToCart } = useCart();
  const [clientSecret, setClientSecret] = useState("");
  const [isSetUpIntent, setIsSetUpIntent] = useState(true);
  const [changesInCart, setChangesInCart] = useState(false);
  const [isStockChecked, setIsStockChecked] = useState(false);
  const [updatedCart, setUpdatedCart] = useState<ICartItemForFrontend[]>([]);

  const shippingCost = 99 * 100; // Change this to a dynamic value, and it is multiplied by 100 for cents

  // Step 1: Check and update stock
  useEffect(() => {
    const handleStockCheck = async () => {
      const newCart = await checkNUpdateStock(cart);
      const hasChanges = newCart.some(
        (item, i) =>
          !cart[i] ||
          cart[i].id !== item.id ||
          cart[i].quantity !== item.quantity
      );

      if (hasChanges) {
        clearCart();
        newCart.forEach(addToCart);
        setChangesInCart(true);
      }

      setUpdatedCart(newCart);
      setIsStockChecked(true);
      setIsLoading(false);
    };

    if (!isStockChecked && cart.length > 0) {
      handleStockCheck();
    } else if (cart.length === 0) {
      setIsLoading(false);
    }
  }, [cart, isStockChecked, clearCart, addToCart]);

  // Step 2: Notify if cart changes
  useEffect(() => {
    if (changesInCart) {
      Toast({
        theme,
        type: "warning",
        message:
          lng === "en"
            ? "Some items are out of stock or updated, please review your cart"
            : "Algunos artículos están agotados o actualizados, por favor revisa tu carrito",
      });
    }
  }, [changesInCart, lng, theme]);

  // Step 3: Reserve stock and create payment intent
  useEffect(() => {
    const handleReservationAndPayment = async () => {
      setIsLoading(true);
      if (isStockChecked && updatedCart.length > 0) {
        const reservations = await reserverStock(updatedCart);

        if (reservations.length !== updatedCart.length) {
          Toast({
            theme,
            type: "error",
            message:
              lng === "en"
                ? "An error occurred, please try again later"
                : "Ocurrió un error, por favor intenta de nuevo más tarde",
          });
          return;
        }

        let clientSecret = "";
        if (isSetUpIntent) {
          clientSecret = (await createSetUpIntent()) as string;
        } else {
          clientSecret = (await createPaymentIntent(
            addressId as string,
            shippingCost,
            paymentMethodId as string,
            updatedCart
          )) as string;
        }
        setClientSecret(clientSecret as string);
      }
      setIsLoading(false);
    };

    if (isStockChecked) {
      handleReservationAndPayment();
    }
  }, [
    updatedCart,
    isStockChecked,
    lng,
    theme,
    isSetUpIntent,
    paymentMethodId,
    shippingCost,
    addressId,
  ]);

  const handleSetUpIntent = (value: boolean) => {
    setIsSetUpIntent(value);
  };

  return {
    cart,
    isLoading,
    clientSecret,
    shippingCost,
    handleSetUpIntent,
  };
};
