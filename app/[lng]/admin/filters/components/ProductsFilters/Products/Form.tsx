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
  ISharedState,
} from "@/app/shared/interfaces";
import {
  deleteMassiveProductFromFilterFromGroup,
  deleteProductFromFilterFromGroup,
} from "@/app/shared/services/filter/controller";

interface IForm {
  onClose: () => void;
  productFilterId: string;
  product?: IProduct | IProduct[];
  action: "delete" | "massiveDelete";
}

const Form = ({ onClose, productFilterId, product, action }: IForm) => {
  const [isPending, setIsPending] = useState(false);
  const [badResponse, setBadResponse] = useState<ISharedState>(
    INITIAL_STATE_RESPONSE
  );

  const submitAction: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    setIsPending(true);
    event.preventDefault();
    const res =
      action === "delete"
        ? await deleteProductFromFilterFromGroup(
            productFilterId,
            (product as IProduct).id
          )
        : action === "massiveDelete" &&
          (await deleteMassiveProductFromFilterFromGroup(
            productFilterId,
            (product as IProduct[]).map((p) => p.id)
          ));
    if (res && !res.success) {
      setBadResponse(res);
    } else {
      onClose();
    }
    setIsPending(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 text-left dark:text-white">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-center text-xl md:text-4xl">Quitando productos</h1>
        {badResponse.message && (
          <div className="text-red-500 text-center">{badResponse.message}</div>
        )}
      </div>
      <form onSubmit={submitAction}>
        <fieldset disabled={isPending}>
          {action === "delete" ? (
            <div className="text-center">
              <span className="text-2xl text-center text-red-500">
                ⚠️ Acción irreversible ⚠️
              </span>
              <h1 className="text-center text-base md:text-xl">
                ¿Estás seguro de que deseas quitar el producto
                {` "${(product as IProduct).name}"`}?
              </h1>
            </div>
          ) : (
            <div className="text-center">
              <span className="text-2xl text-center text-red-500">
                ⚠️ Acción irreversible ⚠️
              </span>
              <h1 className="text-center text-base md:text-xl">
                ¿Estás seguro de que deseas quitar los siguientes productos?
              </h1>
              <ul>
                {(product as IProduct[]).map((p) => (
                  <li key={p.id}>{p.name}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="text-center mt-4">
            <SubmitButton color="accent" title="Quitar" pending={isPending} />
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default Form;
