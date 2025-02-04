"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/app/shared/utils/cn";
import { useResolvedTheme } from "@/app/shared/hooks";
import { INITIAL_STATE_RESPONSE } from "@/app/shared/constants";
import { Heart, LeftArrow, Plus, PhotoIcon } from "@/app/shared/icons";
import { Toast, GenericInput, SubmitButton } from "@/app/shared/components";
import {
  createNewCustomList,
  addProductToManyCustomLists,
} from "@/app/shared/services/customList/controller";
import type {
  ICustomList,
  ICustomListState,
  IAddProductToCustomList,
} from "@/app/shared/interfaces";

interface IForm {
  lng: string;
  productId: string;
  myLists: ICustomList[];
  handleClose: () => void;
}

const Form = ({ lng, productId, myLists, handleClose }: IForm) => {
  const theme = useResolvedTheme();
  const [isPending, setIsPending] = useState(false);
  const [newListForm, setNewListForm] = useState(false);
  const [response, setResponse] = useState<
    ICustomListState | IAddProductToCustomList
  >(INITIAL_STATE_RESPONSE);

  const submitAction: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    setIsPending(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = newListForm
      ? await createNewCustomList(formData)
      : await addProductToManyCustomLists(formData);
    if (res && !res.success) {
      setResponse(res);
    } else {
      if (newListForm) {
        Toast({
          theme,
          type: "success",
          message:
            lng === "en"
              ? "List created and product added to it successfully"
              : "Lista creada y producto añadido a ella con éxito",
        });
      } else {
        Toast({
          theme,
          type: "success",
          message:
            lng === "en"
              ? "Product added to list(s) successfully"
              : "Producto añadido a la(s) lista(s) con éxito",
        });
      }
      handleClose();
    }
  };

  const handleChangeView = () => {
    setNewListForm(!newListForm);
  };

  return (
    <>
      {newListForm ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <button
                onClick={handleChangeView}
                disabled={isPending}
                className={cn(
                  "text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-400",
                  isPending && "opacity-50"
                )}
              >
                <LeftArrow size="size-6 md:size-8" />
              </button>
              <h1 className="text-xl md:text-4xl">Nueva lista</h1>
            </div>
            {response.message && (
              <p className="text-red-600">{response.message}</p>
            )}
          </div>
          <form onSubmit={submitAction} className="px-4">
            <fieldset
              disabled={isPending}
              className={cn(isPending && "opacity-50")}
            >
              <div className="flex flex-col gap-2">
                <GenericInput
                  id="name"
                  ariaLabel="Nombre de la lista"
                  type="text"
                  placeholder="Lista de compras"
                  error={(response as ICustomListState).errors?.name}
                />
                <GenericInput
                  id="description"
                  ariaLabel="Descripción de la lista"
                  type="text"
                  placeholder="Esta lista es para..."
                />
              </div>
              <input hidden name="productId" defaultValue={productId} />
              <div className="text-center mt-4 w-full">
                <SubmitButton
                  title="Crear lista"
                  color="accent"
                  pending={isPending}
                />
              </div>
            </fieldset>
          </form>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl md:text-4xl">Añadir a lista(s)</h1>
            {response.message && (
              <p className="text-red-600 dark:text-red-300">
                {response.message}
              </p>
            )}
            {Array.isArray(response.errors) &&
              response.errors[0]?.customListId && (
                <p className="text-red-600 dark:text-red-300">
                  {response.errors[0]?.customListId}
                </p>
              )}
          </div>
          <div className="flex flex-col px-4">
            <button
              onClick={handleChangeView}
              disabled={isPending}
              className={cn(
                "flex items-center group gap-2 text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-400 mb-2",
                isPending && "opacity-50 cursor-not-allowed"
              )}
            >
              <Plus
                size="size-10"
                customClass="border border-blue-600 dark:border-blue-300 group-hover:border-blue-700 dark:group-hover:border-blue-400 rounded-md p-1"
              />
              <span>Nueva lista</span>
            </button>
            <form onSubmit={submitAction}>
              <fieldset
                disabled={isPending}
                className={cn(isPending && "opacity-50")}
              >
                <div className="max-h-[169px] overflow-y-auto">
                  {myLists.map((list) => (
                    <label
                      key={list.id}
                      htmlFor={list.id}
                      className={cn(
                        "flex justify-between items-center gap-2 mb-2",
                        isPending ? "cursor-not-allowed" : "cursor-pointer"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div className="size-10 border border-gray-200 p-1 rounded-md">
                          {list.name.toLowerCase() === "favorites" ||
                          list.name.toLowerCase() === "favorite" ||
                          list.name.toLowerCase() === "favourites" ||
                          list.name.toLowerCase() === "favourite" ? (
                            <div className="size-full flex items-center justify-center">
                              <Heart isFilled />
                            </div>
                          ) : list.products[0]?.product.files[0] ? (
                            <Image
                              src={list.products[0]?.product.files[0].url}
                              alt="Main list image"
                              width={50}
                              height={50}
                              className="size-full object-contain"
                            />
                          ) : (
                            <div className="size-full flex items-center justify-center">
                              <PhotoIcon />
                            </div>
                          )}
                        </div>
                        {list.name}
                      </div>
                      <input
                        id={list.id}
                        type="checkbox"
                        name="customListId"
                        value={list.id}
                        aria-label={list.name}
                        className="size-4"
                      />
                    </label>
                  ))}
                </div>
                <input hidden name="productId" defaultValue={productId} />
                <div className="text-center mt-4">
                  <SubmitButton
                    title="Añadir a lista(s)"
                    color="accent"
                    pending={isPending}
                  />
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Form;
