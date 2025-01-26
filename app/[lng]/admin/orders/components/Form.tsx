"use client";

import clsx from "clsx";
import OrderSummary from "./OrderSummary";
import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import { INITIAL_STATE_RESPONSE } from "@/app/shared/constants";
import { AutocompleteInput } from "@/app/shared/components/Form";
import { GenericInput, SubmitButton } from "@/app/shared/components";
import { MinusCircle, PlusCircle, Upload } from "@/app/shared/icons";
import {
  createOrder,
  deleteOrder,
  createMassiveOrder,
  deleteMassiveOrder,
} from "@/app/shared/services/order/controller";
import type {
  ICreateOrderState,
  IOrder,
  IProduct,
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
  const [formView, setFormView] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [file, setFile] = useState<File | null>(null);
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
      action === "create" && formView
        ? await createOrder(formData)
        : file && !formView
          ? await createMassiveOrder(formData)
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

  const onChangeView = () => {
    setFile(null);
    setProductsCounter(1);
    setFormView((prev) => !prev);
    setBadResponse(INITIAL_STATE_RESPONSE);
  };

  return (
    <div className="flex flex-col items-center gap-4 text-left dark:text-white">
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
      {action === "create" && (
        <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
          <ul className="flex flex-wrap">
            <li className="w-1/2">
              <button
                onClick={onChangeView}
                className={clsx(
                  "w-full inline-block p-4 rounded-t-lg border-b-2",
                  formView
                    ? "border-blue-600 text-blue-600 dark:text-blue-500 dark:border-blue-500"
                    : "border-gray-200 dark:border-gray-700"
                )}
              >
                Form
              </button>
            </li>
            <li className="w-1/2">
              <button
                onClick={onChangeView}
                className={clsx(
                  "w-full inline-block p-4 rounded-t-lg border-b-2",
                  !formView
                    ? "border-blue-600 text-blue-600 dark:text-blue-500 dark:border-blue-500"
                    : "border-gray-200 dark:border-gray-700"
                )}
              >
                Excel
              </button>
            </li>
          </ul>
        </div>
      )}
      {formView ? (
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
                      defaultValue={
                        (order as IOrder)?.discount?.toString() ?? ""
                      }
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
      ) : (
        <>
          {badResponse.errors && (
            <div className="h-auto max-h-[60px] overflow-y-auto">
              {Object.entries(badResponse.errors).map(([key, value]) => (
                <p key={key} className="text-red-500 dark:text-red-400">
                  {key}: {value as string}
                </p>
              ))}
            </div>
          )}
          <form onSubmit={submitAction} encType="multipart/form-data">
            <fieldset disabled={isPending}>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="products"
                  className={clsx(
                    "flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer",
                    file
                      ? badResponse.errors &&
                        Object.keys(badResponse.errors as object).length > 0
                        ? "bg-red-50 dark:bg-red-700 dark:border-red-600 border-red-500"
                        : "bg-green-50 dark:bg-green-700 dark:border-green-600 border-green-500"
                      : "bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
                  )}
                >
                  <div className="flex flex-col items-center justify-center p-5">
                    <Upload
                      color={
                        file
                          ? badResponse.errors &&
                            Object.keys(badResponse.errors as object).length > 0
                            ? "red"
                            : "green"
                          : ""
                      }
                    />
                    <p
                      className={clsx(
                        "mb-2 text-sm text-center",
                        file
                          ? badResponse.errors &&
                            Object.keys(badResponse.errors as object).length > 0
                            ? "text-red-500 dark:text-red-400"
                            : "text-green-500 dark:text-green-400"
                          : "text-gray-500 dark:text-gray-400"
                      )}
                    >
                      <span className="font-semibold">Click para subir</span>
                      <br />o arrastra el archivo aquí
                    </p>
                  </div>
                  <input
                    id="products"
                    name="products"
                    type="file"
                    accept=".xlsx"
                    className="hidden"
                    onChange={(event) => {
                      setFile(event.target.files?.[0] || null);
                    }}
                  />
                </label>
              </div>
              <div className="text-center mt-4">
                {file && (
                  <SubmitButton
                    title="Create"
                    color="green"
                    pending={isPending}
                  />
                )}
              </div>
            </fieldset>
          </form>
        </>
      )}
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
