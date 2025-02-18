"use client";

import { ReactNode, useState } from "react";
import { INITIAL_STATE_RESPONSE } from "@/app/shared/constants";
import formatdateInput from "@/app/shared/utils/formatdate-input";
import type {
  ICreateNUpdateProductHistoryState,
  IProductFile,
  IProductHistory,
  ISharedState,
} from "@/app/shared/interfaces";
import {
  addFileToProduct,
  createHistoryProduct,
  deleteHistoryProduct,
  deleteMassiveProductsHistory,
  removeFileFromProduct,
  removeMassiveFilesFromProduct,
  updateHistoryProduct,
} from "@/app/shared/services/product/controller";
import { GenericInput, SubmitButton } from "@/app/shared/components";
import formatCurrency from "@/app/shared/utils/format-currency";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import Image from "next/image";

interface IForm {
  productId?: string;
  onClose: () => void;
  action: "delete" | "massiveDelete";
  file: IProductFile | IProductFile[];
}

const Form = ({ file, onClose, productId, action }: IForm) => {
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
        ? await removeFileFromProduct(
            productId as string,
            (file as IProductFile).id
          )
        : await removeMassiveFilesFromProduct(
            productId as string,
            (file as IProductFile[]).map((f) => f.id)
          );
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
        <h1 className="text-center text-xl md:text-4xl">Eliminando archivo</h1>
        {badResponse.message && (
          <div className="text-center text-red-500">{badResponse.message}</div>
        )}
      </div>
      <form onSubmit={submitAction}>
        <fieldset disabled={isPending}>
          <div className="flex flex-col gap-4 text-xl">
            {action === "delete" ? (
              <div className="text-center">
                <span className="text-2xl text-center text-red-500">
                  ⚠️ Acción irreversible ⚠️
                </span>
                <h1 className="text-center text-base md:text-xl">
                  ¿Estás seguro que deseas eliminar el siguiente archivo?
                </h1>
                <div className="w-full h-[100px] relative rounded-md text-center p-2 m-2 flex items-center justify-center">
                  {(file as IProductFile).type === "IMAGE" ? (
                    <Image
                      width={100}
                      height={100}
                      src={(file as IProductFile).url}
                      alt="Imagen del archivo"
                      className="object-contain size-full"
                    />
                  ) : (
                    <video
                      controls
                      src={(file as IProductFile).url}
                      className="object-contain size-full"
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center flex flex-col gap-2">
                <span className="text-2xl text-center text-red-500">
                  ⚠️ Acción irreversible ⚠️
                </span>
                <h1 className="text-xl md:text-xl">
                  ¿Estás seguro que deseas eliminar los archivos seleccionados?:
                </h1>
                <div className="flex gap-2 overflow-x-auto items-start w-full max-w-min">
                  {(file as IProductFile[]).map((file) => (
                    <div
                      key={file.id}
                      className="relative flex flex-col items-center justify-center gap-2 w-[150px] h-[150px]"
                    >
                      {file.type === "IMAGE" ? (
                        <Image
                          width={100}
                          height={100}
                          src={file.url}
                          alt="Imagen del archivo"
                          className="object-contain size-full"
                        />
                      ) : (
                        <video
                          controls
                          src={file.url}
                          className="object-contain size-full"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="text-center mt-4">
            <SubmitButton color="accent" title="Eliminar" pending={isPending} />
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default Form;
