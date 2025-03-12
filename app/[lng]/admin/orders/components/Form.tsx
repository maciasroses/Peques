"use client";

import OrderSummary from "./OrderSummary";
import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import { MinusCircle, PlusCircle } from "@/app/shared/icons";
import { INITIAL_STATE_RESPONSE } from "@/app/shared/constants";
import { AutocompleteInput } from "@/app/shared/components/Form";
import { GenericInput, SubmitButton } from "@/app/shared/components";
import {
  createOrder,
  deleteOrder,
  deleteMassiveOrder,
} from "@/app/shared/services/order/controller";
import type {
  IOrder,
  IProduct,
  ICreateOrderState,
} from "@/app/shared/interfaces";

interface IProductInOrder {
  orderId: string;
  costMXN: number;
  quantity: number;
  discount: number;
  productId: string;
  customRequest: string;
  product: {
    name: string;
  };
}

interface IForm {
  lng: string;
  onClose: () => void;
  products?: IProduct[];
  order?: IOrder | IOrder[];
  action: "create" | "update" | "delete" | "massiveDelete";
}

const Form = ({ lng, onClose, products, order, action }: IForm) => {
  const pathname = usePathname();
  const [isPending, setIsPending] = useState(false);
  const [productsCounter, setProductsCounter] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [badResponse, setBadResponse] = useState<ICreateOrderState>(
    INITIAL_STATE_RESPONSE
  );

  const handleIncreaseNSubtract = (action: string) => {
    setProductsCounter((prev) => {
      if (action === "increase") {
        return prev + 1;
      } else if (action === "subtract" && prev > 1) {
        const updatedSelections = [...selectedProducts];
        updatedSelections.pop();
        setSelectedProducts(updatedSelections);
        return prev - 1;
      }
      return prev;
    });
  };

  const handleProductSelect = (index: number, productKey: string) => {
    const updatedSelections = [...selectedProducts];
    updatedSelections[index] = productKey;
    setSelectedProducts(updatedSelections);
  };

  const availableProducts = products?.filter(
    (product) => product.availableQuantity > 0
  );

  const submitAction: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    setIsPending(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res =
      action === "create"
        ? await createOrder(formData)
        : action === "delete"
          ? await deleteOrder((order as IOrder).id, pathname)
          : await deleteMassiveOrder((order as IOrder[]).map((o) => o.id));
    if (res && !res.success) {
      setBadResponse(res);
    } else {
      onClose();
      if (action === "massiveDelete") location.replace(pathname);
    }
    setIsPending(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 text-left">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-center text-xl md:text-4xl">
          {action === "create"
            ? "Creando"
            : action === "update"
              ? "Actualizando"
              : "Eliminando"}{" "}
          {pathname === `/${lng}/admin/orders` ? "pedido" : "venta"}
        </h1>
      </div>
      <form onSubmit={submitAction}>
        <fieldset disabled={isPending}>
          {action !== "delete" && action !== "massiveDelete" ? (
            <div className="flex flex-col gap-2">
              <GenericPairDiv>
                <GenericDiv>
                  <GenericInput
                    id="client"
                    type="text"
                    ariaLabel="Nombre del Cliente"
                    placeholder="Jorge Pérez"
                    defaultValue={(order as IOrder)?.client ?? ""}
                    error={badResponse.errors?.order?.client}
                  />
                </GenericDiv>
                <GenericDiv>
                  <GenericInput
                    id="paymentMethod"
                    type="text"
                    ariaLabel="Método de Pago"
                    placeholder="Efectivo"
                    defaultValue={(order as IOrder)?.paymentMethod ?? ""}
                    error={badResponse.errors?.order?.paymentMethod}
                  />
                </GenericDiv>
              </GenericPairDiv>
              <GenericPairDiv>
                <GenericDiv>
                  <GenericInput
                    id="discount"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    ariaLabel="Descuento (Opcional)"
                    placeholder="10"
                    defaultValue={(order as IOrder)?.discount?.toString() ?? ""}
                  />
                </GenericDiv>
                <GenericDiv>
                  <GenericInput
                    id="shipmentType"
                    type="text"
                    ariaLabel="Tipo de Envío"
                    placeholder="Terrestre"
                    defaultValue={(order as IOrder)?.shipmentType ?? ""}
                    error={badResponse.errors?.order?.shipmentType}
                  />
                </GenericDiv>
              </GenericPairDiv>
              {Array.from({ length: productsCounter }).map((_, index) => {
                const filteredProducts = availableProducts?.filter(
                  (product) =>
                    !selectedProducts.includes(product.key) ||
                    product.key === selectedProducts[index]
                );
                return (
                  <ProductForm
                    key={index}
                    index={index}
                    products={filteredProducts ?? []}
                    onProductSelect={handleProductSelect}
                    badResponse={badResponse}
                  />
                );
              })}
              <div className="flex gap-2 items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleIncreaseNSubtract("increase")}
                >
                  <PlusCircle />
                </button>
                {productsCounter > 1 && (
                  <button
                    type="button"
                    onClick={() => handleIncreaseNSubtract("subtract")}
                  >
                    <MinusCircle />
                  </button>
                )}
                <span>
                  {productsCounter > 1 && `(${productsCounter} total)`}
                </span>
              </div>
            </div>
          ) : (
            <>
              {action === "delete" ? (
                <div className="flex flex-col gap-2">
                  <p className="text-2xl text-center text-red-500">
                    ⚠️ Acción irreversible ⚠️
                  </p>
                  <p className="text-center text-base md:text-xl">
                    ¿Estás seguro de que deseas eliminar
                    {pathname === `/${lng}/admin/orders`
                      ? " este pedido"
                      : " esta venta"}
                    ?
                  </p>
                  <div className="text-center">
                    <h2 className="text-lg">
                      <strong>Cliente: </strong>
                      {(order as IOrder).client}
                    </h2>
                    <p>
                      <strong>Tipo de envío: </strong>
                      {(order as IOrder).shipmentType}
                    </p>
                    <div className="w-[220px] sm:w-[300px] md:w-[200px] lg:w-[300px] xl:w-full mx-auto">
                      <OrderSummary
                        order={{
                          products: (order as IOrder)
                            .products as unknown as IProductInOrder[],
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <span className="text-2xl text-center text-red-500">
                    ⚠️ Acción irreversible ⚠️
                  </span>
                  <h1 className="text-center text-base md:text-xl">
                    ¿Estás seguro de que deseas eliminar
                    <span>
                      {pathname === `/${lng}/admin/orders`
                        ? " estos pedidos"
                        : " estas ventas"}
                    </span>
                    ?
                  </h1>
                  <ul className="flex flex-col items-center gap-2">
                    {(order as IOrder[]).map((o, index) => (
                      <li key={index} className="border-b border-b-black">
                        <div className="text-center">
                          <h2 className="text-lg">
                            <strong>Cliente: </strong>
                            {o.client}
                          </h2>
                          <p>
                            <strong>Tipo de envío: </strong>
                            {o.shipmentType}
                          </p>
                          <div className="w-[220px] sm:w-[300px] md:w-[200px] lg:w-[300px] xl:w-full mx-auto">
                            <OrderSummary
                              order={{
                                products:
                                  o.products as unknown as IProductInOrder[],
                              }}
                            />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
          <div className="text-center mt-4">
            <SubmitButton
              title={
                action === "create"
                  ? "Crear"
                  : action === "update"
                    ? "Actualizar"
                    : "Eliminar"
              }
              color="accent"
              pending={isPending}
            />
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default Form;

const GenericPairDiv = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">{children}</div>
  );
};

const GenericDiv = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-col gap-2 w-full sm:w-1/2">{children}</div>;
};

interface IProductForm {
  index: number;
  products: IProduct[];
  onProductSelect: (index: number, productId: string) => void;
  badResponse: ICreateOrderState;
}

const ProductForm = ({
  index,
  products,
  onProductSelect,
  badResponse,
}: IProductForm) => {
  const handleSelectChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    onProductSelect(index, e.target.value);
  };
  return (
    <GenericPairDiv>
      <GenericDiv>
        <AutocompleteInput
          id="product"
          ariaLabel="Producto"
          placeholder="Busca un producto..."
          additionOnChange={handleSelectChange}
          suggestions={products.map((p) => ({
            value: p.key,
            label: p.name,
          }))}
          error={badResponse.errors?.products?.[index]?.productKey}
          customClassName="mt-2"
        />
      </GenericDiv>
      <GenericDiv>
        <GenericInput
          id="productQuantity"
          type="number"
          step="1"
          ariaLabel="Cantidad"
          placeholder="5"
          error={badResponse.errors?.products?.[index]?.quantity}
        />
      </GenericDiv>
      <GenericDiv>
        <GenericInput
          id="productDiscount"
          type="number"
          step="0.01"
          min="0"
          max="100"
          ariaLabel="Descuento (Opcional)"
          placeholder="10"
        />
      </GenericDiv>
    </GenericPairDiv>
  );
};
