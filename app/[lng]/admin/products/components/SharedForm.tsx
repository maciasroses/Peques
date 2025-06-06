"use client";

import { ReactNode, useState } from "react";
import { generateFileKey } from "@/app/shared/utils/generateFileKey";
import { GenericInput, SubmitButton } from "@/app/shared/components";
import {
  getProductById,
  addFileToProduct,
  createHistoryProduct,
} from "@/app/shared/services/product/controller";
import { INITIAL_STATE_RESPONSE } from "@/app/shared/constants";
import type {
  IProduct,
  ISharedState,
  ICreateNUpdateProductHistoryState,
} from "@/app/shared/interfaces";

interface ISharedForm {
  action: "create";
  productId?: string;
  onClose: () => void;
}

const SharedForm = ({ onClose, productId }: ISharedForm) => {
  const [isPending, setIsPending] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [tab, setTab] = useState<"files" | "history">("files");
  const [badResponse, setBadResponse] = useState<
    ISharedState | ICreateNUpdateProductHistoryState
  >(INITIAL_STATE_RESPONSE);

  const handlerUploadFile = async (productId: string, formData: FormData) => {
    const files = formData.getAll("files") as File[];

    if (files.length === 0 || files.some((file) => file.size === 0)) {
      return {
        success: false,
        message: "No se ha seleccionado ningún archivo",
      };
    }

    const product = (await getProductById({
      id: productId,
      isAdminRequest: true,
    })) as IProduct;

    if (!product) {
      return {
        success: false,
        message: "Producto no encontrado",
      };
    }

    const fileKeys: string[] = [];
    for (const file of files) {
      const fileKey = generateFileKey(file);
      const res = await fetch("/api/aws-s3-signed-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileKey: `Products/${product.id}/${fileKey}`,
          contentType: file.type,
        }),
      });

      const { signedUrl } = await res.json();

      await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      fileKeys.push(fileKey);
    }

    return await addFileToProduct(productId, fileKeys);
  };

  const submitAction: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    setIsPending(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res =
      tab === "history"
        ? await createHistoryProduct(formData, productId as string)
        : await handlerUploadFile(productId as string, formData);
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
          Agregando a producto
        </h1>
        {badResponse.message && (
          <div className="text-center text-red-500">{badResponse.message}</div>
        )}
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => {
            setBadResponse(INITIAL_STATE_RESPONSE);
            setTab("files");
          }}
          className={`${
            tab === "files" ? "bg-accent text-white" : "bg-white text-accent"
          } px-4 py-2 rounded-md`}
        >
          Archivos
        </button>
        <button
          onClick={() => {
            setBadResponse(INITIAL_STATE_RESPONSE);
            setTab("history");
          }}
          className={`${
            tab === "history" ? "bg-accent text-white" : "bg-white text-accent"
          } px-4 py-2 rounded-md`}
        >
          Historial
        </button>
      </div>
      <form onSubmit={submitAction}>
        <fieldset disabled={isPending}>
          <div className="flex flex-col gap-4 text-xl">
            {tab === "files" ? (
              <GenericInput
                multiple
                id="files"
                type="file"
                ariaLabel="Archivos"
                fileAccept=".webp, .mp4"
                file={files?.length ? files[0] : undefined}
                onChange={(event) =>
                  setFiles((event.target as HTMLInputElement).files)
                }
              />
            ) : (
              <>
                <GenericPairDiv>
                  <GenericDiv>
                    <GenericInput
                      type="number"
                      step="0.01"
                      placeholder="19.85"
                      id="dollarExchangeRate"
                      ariaLabel="Cambio de dólar"
                      error={
                        (badResponse as ICreateNUpdateProductHistoryState)
                          .errors?.dollarExchangeRate
                      }
                    />
                  </GenericDiv>
                  <GenericDiv>
                    <GenericInput
                      type="number"
                      step="0.01"
                      id="chinesePriceUSD"
                      ariaLabel="Precio china (USD)"
                      placeholder="100"
                      error={
                        (badResponse as ICreateNUpdateProductHistoryState)
                          .errors?.chinesePriceUSD
                      }
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
                      error={
                        (badResponse as ICreateNUpdateProductHistoryState)
                          .errors?.shippingCostMXN
                      }
                    />
                  </GenericDiv>
                  <GenericDiv>
                    <GenericInput
                      type="number"
                      step="0.01"
                      id="salePriceMXN"
                      ariaLabel="Precio de venta (MXN)"
                      placeholder="2000"
                      error={
                        (badResponse as ICreateNUpdateProductHistoryState)
                          .errors?.salePriceMXN
                      }
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
                      error={
                        (badResponse as ICreateNUpdateProductHistoryState)
                          .errors?.quantityPerCarton
                      }
                    />
                  </GenericDiv>
                  <GenericDiv>
                    <GenericInput
                      type="date"
                      id="orderDate"
                      ariaLabel="Fecha de orden"
                      max="9999-12-31"
                      error={
                        (badResponse as ICreateNUpdateProductHistoryState)
                          .errors?.orderDate
                      }
                    />
                  </GenericDiv>
                </GenericPairDiv>
              </>
            )}
          </div>
          <div className="text-center mt-4">
            <SubmitButton color="accent" title="Agregar" pending={isPending} />
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default SharedForm;

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
