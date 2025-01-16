import Image from "next/image";
import formatCurrency from "@/app/shared/utils/format-currency";
import type { ICartItemForFrontend } from "@/app/shared/interfaces";

interface ICartSummary {
  lng: string;
  shippingCost: number;
  cart: ICartItemForFrontend[];
}

const CartSummary = ({ lng, cart, shippingCost }: ICartSummary) => {
  return (
    <div className="w-full md:w-2/3">
      <h1 className="text-2xl font-bold">
        {lng === "en" ? "Order Summary" : "Resumen del pedido"}
      </h1>
      <ul className="flex flex-col gap-4 mt-4">
        {cart.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-2 border-b-2 border-b-gray-200 dark:border-b-gray-700 p-2"
          >
            <div className="flex items-center gap-2">
              <div className="size-24">
                <Image
                  src={item.file}
                  alt={item.name}
                  width={500}
                  height={300}
                  className="size-full object-contain rounded-lg"
                />
              </div>
              <p className="text-base sm:text-xl">{item.name}</p>
            </div>
            <p className="text-sm sm:text-lg">
              {item.quantity} x{" "}
              <span className="font-semibold">
                {formatCurrency(item.price, "MXN")}
              </span>
            </p>
          </li>
        ))}
      </ul>
      <p className="text-sm sm:text-lg text-right mt-4">
        Envío:{" "}
        <span className="font-bold">
          {formatCurrency(shippingCost / 100, "MXN")}
        </span>
      </p>
      <p className="text-sm sm:text-lg text-right">
        Subtotal:{" "}
        <span className="font-bold">
          {formatCurrency(
            cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
            "MXN"
          )}
        </span>
      </p>
      <p className="text-lg sm:text-2xl text-right mt-2">
        Total:{" "}
        <span className="font-bold">
          {formatCurrency(
            cart.reduce((acc, item) => acc + item.price * item.quantity, 0) +
              99,
            "MXN"
          )}
        </span>
      </p>
    </div>
  );
};

export default CartSummary;
