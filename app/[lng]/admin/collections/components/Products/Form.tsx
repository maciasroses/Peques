"use client";

import { useState } from "react";
import { SubmitButton } from "@/app/shared/components";
import { MinusCircle, PlusCircle } from "@/app/shared/icons";
import { INITIAL_STATE_RESPONSE } from "@/app/shared/constants";
import { AutocompleteInput } from "@/app/shared/components/Form";
import {
  addProductsToCollection,
  removeProductsFromCollection,
} from "@/app/shared/services/collection/controller";
import type {
  IProduct,
  IAddNDeleteProductToFromCollectionState,
} from "@/app/shared/interfaces";

interface IForm {
  onClose: () => void;
  collectionId?: string;
  product?: IProduct | IProduct[];
  action: "create" | "delete" | "massiveDelete";
}

const Form = ({ onClose, collectionId, product, action }: IForm) => {
  const [isPending, setIsPending] = useState(false);
  const [productsCounter, setProductsCounter] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [badResponse, setBadResponse] =
    useState<IAddNDeleteProductToFromCollectionState>(INITIAL_STATE_RESPONSE);

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

  const submitAction: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    setIsPending(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const productsIds = formData.getAll("product") as string[];
    const res =
      action === "create"
        ? await addProductsToCollection({
            id: collectionId!,
            products: productsIds,
          })
        : action === "delete"
          ? await removeProductsFromCollection({
              id: collectionId as string,
              products: [(product as IProduct).key],
            })
          : action === "massiveDelete" &&
            (await removeProductsFromCollection({
              id: collectionId as string,
              products: (product as IProduct[]).map((p) => p.key),
            }));
    if (res && !res.success) {
      setBadResponse(res);
    } else {
      onClose();
    }
    setIsPending(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 text-left">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-center text-xl md:text-4xl">
          {action === "create" ? "Agregando" : "Eliminando"} producto
        </h1>
        {badResponse.message && (
          <div className="text-red-500 text-center">{badResponse.message}</div>
        )}
      </div>
      <form onSubmit={submitAction}>
        <fieldset disabled={isPending}>
          {action === "create" ? (
            <>
              <div className="flex flex-col gap-2 w-full">
                {Array.from({ length: productsCounter }).map((_, index) => {
                  const filteredProducts = (product as IProduct[])?.filter(
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
                    />
                  );
                })}
              </div>
              <div className="flex gap-2 items-center justify-end mt-4">
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
            </>
          ) : (
            <>
              {action === "delete" ? (
                <div className="text-center">
                  <span className="text-2xl text-center text-red-500">
                    ⚠️ Acción irreversible ⚠️
                  </span>
                  <h1 className="text-center text-base md:text-xl">
                    ¿Estás seguro de que deseas eliminar el producto
                    {` "${(product as IProduct).name}"`}?
                  </h1>
                </div>
              ) : (
                <div className="text-center">
                  <span className="text-2xl text-center text-red-500">
                    ⚠️ Acción irreversible ⚠️
                  </span>
                  <h1 className="text-center text-base md:text-xl">
                    ¿Estás seguro de que deseas eliminar los siguientes
                    productos?
                  </h1>
                  <ul>
                    {(product as IProduct[]).map((p) => (
                      <li key={p.id}>{p.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
          <div className="text-center mt-4">
            <SubmitButton
              title={action === "create" ? "Agregar" : "Eliminar"}
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

interface IProductForm {
  index: number;
  products: IProduct[];
  onProductSelect: (index: number, productId: string) => void;
}

const ProductForm = ({ index, products, onProductSelect }: IProductForm) => {
  const handleSelectChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    onProductSelect(index, e.target.value);
  };
  return (
    <AutocompleteInput
      id="product"
      ariaLabel="Producto"
      placeholder="Busca un producto..."
      additionOnChange={handleSelectChange}
      suggestions={products.map((p) => ({
        value: p.key,
        label: p.name,
      }))}
      customClassName="mt-2"
    />
  );
};
