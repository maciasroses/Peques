"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/app/shared/hooks";
import GenericBackToPage from "@/app/shared/components/GenericBackToPage";

const AllGood = ({ lng }: { lng: string }) => {
  const { clearCart } = useCart();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleClearCart = async () => {
      try {
        clearCart();
      } catch (err) {
        console.error("Error clearing cart:", err);
        setError(
          lng === "en"
            ? "An error occurred while clearing your cart. Please try again later."
            : "Ocurrió un error al vaciar tu carrito. Por favor, inténtalo más tarde."
        );
      }
    };

    handleClearCart();
  }, [clearCart, lng]);

  if (error) {
    return (
      <GenericBackToPage
        link={`/${lng}/profile/orders`}
        title={lng === "en" ? "Error" : "Error"}
        linkText={lng === "en" ? "Go to my orders" : "Ir a mis pedidos"}
        description={error}
      />
    );
  }

  return (
    <GenericBackToPage
      link={`/${lng}/profile/orders`}
      title={lng === "en" ? "Payment succeeded" : "Pago exitoso"}
      linkText={lng === "en" ? "Go to my orders" : "Ir a mis pedidos"}
      description={
        lng === "en" ? "The payment was successful" : "El pago fue exitoso"
      }
    />
  );
};

export default AllGood;
