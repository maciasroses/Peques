import { isAuthenticated as IsAuth } from "@/app/shared/services/auth";
import {
  useState,
  useEffect,
  ReactNode,
  useCallback,
  createContext,
} from "react";
import {
  getMyCart,
  mergeCarts,
  addToMyCart,
  clearMyCart,
  deleteFromMyCart,
} from "@/app/shared/services/cart/controller";
import type { ICart, ICartItemForFrontend } from "@/app/shared/interfaces";

export interface ICartContext {
  cart: ICartItemForFrontend[];
  addToCart: (item: ICartItemForFrontend) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

export const CartContext = createContext<ICartContext | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<ICartItemForFrontend[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = useCallback(async () => {
    const authenticated = await IsAuth();
    setIsAuthenticated(authenticated);
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated) {
        const localCart =
          typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("cart") || "[]")
            : [];
        if (localCart.length > 0) {
          await mergeCarts(localCart);
          localStorage.removeItem("cart");
        }

        const myCart = (await getMyCart()) as ICart;
        setCart(
          myCart.items.map((item) => ({
            price: item.priceMXN,
            id: item.product.key,
            name: item.product.name,
            quantity: item.quantity,
            discount: item.discount,
            promotionId: item.promotionId,
            finalPrice: item.finalPriceMXN,
            customRequest: item.customRequest,
            file:
              item.product.files.find(
                (file) => file.order === 1 && file.type === "IMAGE"
              )?.url || "/assets/images/landscape-placeholder.webp",
          }))
        );
      } else if (typeof window !== "undefined") {
        const cartData = localStorage.getItem("cart");
        if (cartData && JSON.parse(cartData).length > 0) {
          setCart(JSON.parse(cartData));
        }
      }
    };

    checkAuth();
    loadCart();
  }, [isAuthenticated, checkAuth]);

  useEffect(() => {
    if (!isAuthenticated && typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isAuthenticated]);

  const addToCart = useCallback(
    async (item: ICartItemForFrontend) => {
      if (isAuthenticated) {
        try {
          await addToMyCart(item);
        } catch (error) {
          console.error("Error adding item to the database cart:", error);
          return;
        }
      }
      setCart((prevCart) => {
        const itemIndex = prevCart.findIndex(
          (cartItem) => cartItem.id === item.id
        );

        if (itemIndex >= 0) {
          const updatedCart = [...prevCart];
          const newQuantity = updatedCart[itemIndex].quantity + item.quantity;

          updatedCart[itemIndex] = {
            ...updatedCart[itemIndex],
            quantity: newQuantity,
          };
          return updatedCart;
        } else {
          return [...prevCart, item];
        }
      });
    },
    [isAuthenticated]
  );

  const removeFromCart = useCallback(
    async (id: string) => {
      if (isAuthenticated) {
        try {
          await deleteFromMyCart(id);
        } catch (error) {
          console.error("Error removing item from the database cart.", error);
        }
      }
      setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    },
    [isAuthenticated]
  );

  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        await clearMyCart();
      } catch (error) {
        console.error("Error clearing cart from the database.", error);
      }
    }
    setCart([]);
  }, [isAuthenticated]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
