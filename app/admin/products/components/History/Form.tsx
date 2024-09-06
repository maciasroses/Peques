"use client";

import { ReactNode, useState } from "react";
import { INITIAL_STATE_RESPONSE } from "@/constants";
import formatdateInput from "@/utils/formatdate-input";
import type {
  ICreateNUpdateProductHistoryState,
  IProductHistory,
} from "@/interfaces";
import {
  createHistoryProduct,
  deleteHistoryProduct,
  deleteMassiveProductsHistory,
  updateHistoryProduct,
} from "@/services/product/controller";
import { GenericInput, SubmitButton } from "@/components";

interface IForm {
  onClose: () => void;
  productId?: string;
  history?: IProductHistory | IProductHistory[];
  action: "create" | "update" | "delete" | "massiveDelete";
}

const Form = ({ onClose, productId, history, action }: IForm) => {
  const [isPending, setIsPending] = useState(false);
  const [badResponse, setBadResponse] =
    useState<ICreateNUpdateProductHistoryState>(INITIAL_STATE_RESPONSE);

  const submitAction: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    setIsPending(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res =
      action === "create"
        ? await createHistoryProduct(formData, productId as string)
        : action === "update"
        ? await updateHistoryProduct(
            productId as string,
            (history as IProductHistory).id,
            formData
          )
        : action === "delete"
        ? await deleteHistoryProduct(
            productId as string,
            (history as IProductHistory).id
          )
        : await deleteMassiveProductsHistory(
            productId as string,
            (history as IProductHistory[]).map((h) => h.id)
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
    <div className="flex flex-col items-center gap-4 text-left dark:text-white">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-center text-xl md:text-4xl">
          {action === "create"
            ? "Creando"
            : action === "update"
            ? "Actualizando"
            : "Eliminando"}{" "}
          pedido de producto
        </h1>
      </div>
      <form onSubmit={submitAction}>
        <fieldset disabled={isPending}>
          {action !== "delete" && action !== "massiveDelete" ? (
            <div className="flex flex-col gap-4 text-xl">
              <GenericPairDiv>
                <GenericDiv>
                  <GenericInput
                    type="number"
                    step="0.01"
                    placeholder="19.85"
                    defaultValue={(
                      history as IProductHistory
                    )?.dollarExchangeRate.toString()}
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
                    defaultValue={(
                      history as IProductHistory
                    )?.chinesePriceUSD.toString()}
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
                    defaultValue={(
                      history as IProductHistory
                    )?.shippingCostMXN.toString()}
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
                    defaultValue={(
                      history as IProductHistory
                    )?.salePriceMXN.toString()}
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
                    defaultValue={(
                      history as IProductHistory
                    )?.quantityPerCarton.toString()}
                    error={badResponse.errors?.quantityPerCarton}
                  />
                </GenericDiv>
                <GenericDiv>
                  <GenericInput
                    type="date"
                    id="orderDate"
                    ariaLabel="Fecha de orden"
                    max="9999-12-31"
                    defaultValue={
                      (history as IProductHistory)?.orderDate
                        ? formatdateInput(
                            (history as IProductHistory).orderDate.toString()
                          )
                        : ""
                    }
                    error={badResponse.errors?.orderDate}
                  />
                </GenericDiv>
              </GenericPairDiv>
            </div>
          ) : (
            <>
              {action === "delete" ? (
                <>
                  <h1 className="text-center text-base md:text-xl">
                    ¿Estás seguro que deseas eliminar el siguiente pedido de
                    producto?
                  </h1>
                  <div className="flex mt-2">
                    {(history as IProductHistory).quantityPerCarton} -{" "}
                    {(history as IProductHistory).totalCostMXN}-{" "}
                    {(history as IProductHistory).salePriceMXN}
                  </div>
                </>
              ) : (
                <div className="text-center flex flex-col gap-2">
                  <h1 className="text-xl md:text-xl">
                    ¿Estás seguro que deseas eliminar los productos
                    seleccionados?:
                  </h1>
                  <div className="max-h-[60px] overflow-y-auto">
                    <ul className="list-disc list-inside text-left">
                      {(history as IProductHistory[]).map((h) => (
                        <li key={h.id}>
                          {h.quantityPerCarton} - {h.totalCostMXN} -{" "}
                          {h.salePriceMXN}
                        </li>
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
