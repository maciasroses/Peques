"use client";

import Link from "next/link";
import Image from "next/image";
import Actions from "./Actions";
import { Heart, PhotoIcon } from "@/app/shared/icons";
import type { ICustomList } from "@/app/shared/interfaces";

interface IListCard {
  lng: string;
  customList: ICustomList;
}

const ListCard = ({ lng, customList }: IListCard) => {
  const customListForActions = {
    id: customList.id,
    name: customList.name,
    description: customList.description,
  };

  return (
    <div className="flex justify-between items-start shadow-lg border border-gray-200 hover:bg-gray-50 rounded-lg">
      <Link
        href={`/${lng}/profile/lists/${customList.name}`}
        className="flex gap-2 m-4 w-full"
      >
        <div className="min-w-[136px] min-h-[136px]">
          {customList.name.toLowerCase() === "favorites" ||
          customList.name.toLowerCase() === "favorite" ||
          customList.name.toLowerCase() === "favourites" ||
          customList.name.toLowerCase() === "favourite" ? (
            <div className="size-full flex items-center justify-center">
              <Heart isFilled size="size-24" />
            </div>
          ) : customList.products.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {customList.products.slice(0, 3).map((item) => (
                <Image
                  key={item.productId}
                  src={
                    item.product.files.find(
                      (file) => file.order === 1 && file.type === "IMAGE"
                    )?.url ?? "/assets/images/landscape-placeholder.webp"
                  }
                  alt={item.product.name}
                  width={50}
                  height={50}
                  className="size-16 object-contain"
                />
              ))}
              {customList.products.length > 4 ? (
                <div className="size-16 flex items-center justify-center bg-gray-100 text-black">
                  +{customList.products.length - 3}
                </div>
              ) : (
                customList.products.length === 4 && (
                  <Image
                    key={customList.products[3].productId}
                    src={
                      customList.products[3].product.files.find(
                        (file) => file.order === 1 && file.type === "IMAGE"
                      )?.url ?? "/assets/images/landscape-placeholder.webp"
                    }
                    alt={customList.products[3].product.name}
                    width={50}
                    height={50}
                    className="size-16 object-contain"
                  />
                )
              )}
            </div>
          ) : (
            <div className="size-full flex items-center justify-center">
              <PhotoIcon size="size-24" />
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center items-start">
          <h2 className="text-lg line-clamp-1">{customList.name}</h2>
          <p className="text-base text-gray-500 line-clamp-3">
            {customList.description}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {customList.products.length}{" "}
            {customList.products.length === 1 ? "producto" : "productos"}
          </p>
        </div>
      </Link>
      <Actions lng={lng} customList={customListForActions} />
    </div>
  );
};

export default ListCard;
