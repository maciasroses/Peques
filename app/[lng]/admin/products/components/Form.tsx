"use client";

import { ReactNode, useState } from "react";
import { INITIAL_STATE_RESPONSE } from "@/app/shared/constants";
import { GenericInput, SubmitButton } from "@/app/shared/components";
import RichTextEditor from "@/app/shared/components/Form/RichTextEditor";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  deleteMassiveProducts,
} from "@/app/shared/services/product/controller";
import type {
  IProduct,
  IProvider,
  ICreateNUpdateProductState,
} from "@/app/shared/interfaces";

interface IForm {
  onClose: () => void;
  providers?: IProvider[];
  product?: IProduct | IProduct[];
  action: "create" | "update" | "delete" | "massiveDelete";
}

const Form = ({ onClose, providers, product, action }: IForm) => {
  const [isPending, setIsPending] = useState(false);
  const [description, setDescription] = useState(
    (product as IProduct)?.description ?? ""
  );
  const [badResponse, setBadResponse] = useState<ICreateNUpdateProductState>(
    INITIAL_STATE_RESPONSE
  );

  const submitAction: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    setIsPending(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("description", description);
    const res =
      action === "create"
        ? await createProduct(formData)
        : action === "update"
          ? await updateProduct(formData, (product as IProduct).id)
          : action === "delete"
            ? await deleteProduct((product as IProduct).id)
            : await deleteMassiveProducts(
                (product as IProduct[]).map((p) => p.id)
              );
    if (res && !res.success) {
      setBadResponse(res);
    } else {
      onClose();
      if (action === "massiveDelete") location.reload();
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
          producto
        </h1>
      </div>
      <form onSubmit={submitAction}>
        <fieldset disabled={isPending}>
          {action !== "delete" && action !== "massiveDelete" ? (
            <div className="flex flex-col gap-4 text-xl">
              <GenericPairDiv>
                <GenericDiv>
                  <GenericInput
                    id="name"
                    type="text"
                    placeholder="Mueble"
                    ariaLabel="Nombre del producto"
                    defaultValue={(product as IProduct)?.name ?? ""}
                    error={badResponse.errors?.name}
                  />
                </GenericDiv>
                <GenericDiv>
                  <GenericInput
                    id="productKey"
                    type="text"
                    placeholder="MUE-001"
                    ariaLabel="Clave del producto"
                    defaultValue={(product as IProduct)?.key ?? ""}
                    error={badResponse.errors?.key}
                  />
                </GenericDiv>
              </GenericPairDiv>
              {action === "update" && (
                <GenericPairDiv>
                  <GenericDiv>
                    <GenericInput
                      step="0.01"
                      type="number"
                      id="salePriceMXN"
                      placeholder="2000"
                      ariaLabel="Precio de venta (MXN)"
                      defaultValue={(
                        product as IProduct
                      )?.salePriceMXN.toString()}
                      error={badResponse.errors?.salePriceMXN}
                    />
                  </GenericDiv>
                  <GenericDiv>
                    <GenericInput
                      step="1"
                      type="number"
                      placeholder="10"
                      id="availableQuantity"
                      ariaLabel="Cantidad disponible"
                      defaultValue={(
                        product as IProduct
                      )?.availableQuantity.toString()}
                      error={badResponse.errors?.availableQuantity}
                    />
                  </GenericDiv>
                </GenericPairDiv>
              )}
              <div className="w-full">
                <p>Descripción</p>
                <RichTextEditor value={description} onChange={setDescription} />
                {badResponse.errors?.description && (
                  <p className="text-red-500">
                    {badResponse.errors?.description}
                  </p>
                )}
              </div>
              <GenericPairDiv>
                <GenericDiv>
                  <GenericInput
                    step="1"
                    type="number"
                    placeholder="2"
                    id="minimumAcceptableQuantity"
                    defaultValue={
                      (
                        product as IProduct
                      )?.minimumAcceptableQuantity.toString() ?? ""
                    }
                    ariaLabel="Cantidad mínima aceptable"
                    error={badResponse.errors?.minimumAcceptableQuantity}
                  />
                </GenericDiv>
                <GenericDiv>
                  <GenericInput
                    id="providerId"
                    type="select"
                    ariaLabel="Proveedor"
                    placeholder="Selecciona un proveedor"
                    defaultValue={(product as IProduct)?.provider.id ?? ""}
                    options={providers?.map((provider) => ({
                      value: provider.id,
                      label: provider.name,
                    }))}
                    error={badResponse.errors?.providerId}
                  />
                </GenericDiv>
              </GenericPairDiv>
              <div className="flex items-center justify-end gap-2">
                <GenericInput
                  type="checkbox"
                  id="isCustomizable"
                  ariaLabel="¿Es producto personalizable?"
                  defaultChecked={(product as IProduct)?.isCustomizable}
                />
              </div>
              {action === "create" && (
                <>
                  {/* AFTER CHANGE TO A SEPARATE FORM */}
                  <GenericPairDiv>
                    <GenericDiv>
                      <GenericInput
                        type="number"
                        step="0.01"
                        placeholder="19.85"
                        // defaultValue={(
                        //   product as IProduct
                        // )?.dollarExchangeRate.toString()}
                        id="dollarExchangeRate"
                        ariaLabel="Cambio de dólar"
                        error={badResponse.errors?.dollarExchangeRate}
                      />
                    </GenericDiv>
                    <GenericDiv>
                      <GenericInput
                        type="number"
                        step="0.01"
                        id="chinesePriceUSD"
                        ariaLabel="Precio china (USD)"
                        placeholder="100"
                        // defaultValue={(
                        //   product as IProduct
                        // )?.chinesePriceUSD.toString()}
                        error={badResponse.errors?.chinesePriceUSD}
                      />
                    </GenericDiv>
                  </GenericPairDiv>
                  <GenericPairDiv>
                    <GenericDiv>
                      <GenericInput
                        type="number"
                        step="0.01"
                        id="shippingCostMXN"
                        ariaLabel="Costo de envío (MXN)"
                        placeholder="500"
                        // defaultValue={(
                        //   product as IProduct
                        // )?.shippingCostMXN.toString()}
                        error={badResponse.errors?.shippingCostMXN}
                      />
                    </GenericDiv>
                    <GenericDiv>
                      <GenericInput
                        type="number"
                        step="0.01"
                        id="salePriceMXN"
                        ariaLabel="Precio de venta (MXN)"
                        placeholder="2000"
                        // defaultValue={(
                        //   product as IProduct
                        // )?.salePriceMXN.toString()}
                        error={badResponse.errors?.salePriceMXN}
                      />
                    </GenericDiv>
                  </GenericPairDiv>
                  <GenericPairDiv>
                    <GenericDiv>
                      <GenericInput
                        step="1"
                        type="number"
                        id="quantityPerCarton"
                        ariaLabel="Cantidad por caja"
                        placeholder="20"
                        // defaultValue={(
                        //   product as IProduct
                        // )?.quantityPerCarton.toString()}
                        error={badResponse.errors?.quantityPerCarton}
                      />
                    </GenericDiv>
                    <GenericDiv>
                      <GenericInput
                        type="date"
                        id="orderDate"
                        ariaLabel="Fecha de orden"
                        max="9999-12-31"
                        // defaultValue={
                        //   (product as IProduct)?.history.orderDate
                        //     ? formatdateInput(
                        //         (
                        //           product as IProduct
                        //         )?.history.orderDate.toString()
                        //       )
                        //     : ""
                        // }
                        error={badResponse.errors?.orderDate}
                      />
                    </GenericDiv>
                  </GenericPairDiv>
                </>
              )}
            </div>
          ) : (
            <>
              {action === "delete" ? (
                <div className="text-center">
                  <span className="text-2xl text-center text-red-500">
                    ⚠️ Acción irreversible ⚠️
                  </span>
                  <h1 className="text-center text-base md:text-xl">
                    ¿Estás seguro que deseas eliminar el producto{' "'}
                    {(product as IProduct).name}
                    {'"'}?
                  </h1>
                </div>
              ) : (
                <div className="text-center flex flex-col gap-2">
                  <span className="text-2xl text-center text-red-500">
                    ⚠️ Acción irreversible ⚠️
                  </span>
                  <h1 className="text-xl md:text-xl">
                    ¿Estás seguro que deseas eliminar los productos
                    seleccionados?:
                  </h1>
                  <div className="max-h-[60px] overflow-y-auto">
                    <ul className="list-disc list-inside text-left">
                      {(product as IProduct[]).map((p) => (
                        <li key={p.id}>{p.name}</li>
                      ))}
                    </ul>
                  </div>
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
  return (
    <div className="flex flex-col gap-2 w-full sm:w-1/2 justify-end">
      {children}
    </div>
  );
};
