"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

import { LeftChevron, RightChevron, XMark } from "@/app/shared/icons";
import type { IProduct } from "@/app/shared/interfaces";

interface IImageGallery {
  product: IProduct;
  onClose: () => void;
  selectedImageId: string;
  setSelectedImageId: (id: string) => void;
}

const ImageGallery = ({
  product,
  onClose,
  selectedImageId,
  setSelectedImageId,
}: IImageGallery) => {
  const leftArrowRef = useRef(null);
  const rightArrowRef = useRef(null);

  const selectedImage = product.files.find(
    (file) => file.id === selectedImageId
  ) ??
    product.files[0] ?? {
      type: "IMAGE",
      url: "/assets/images/landscape-placeholder.webp",
    };

  const handleNextImage = () => {
    const currentIndex = product.files.findIndex(
      (file) => file === selectedImage
    );
    const nextIndex = currentIndex + 1;
    setSelectedImageId(
      nextIndex < product.files.length
        ? product.files[nextIndex].id
        : product.files[0].id
    );
  };

  const handlePreviousImage = () => {
    const currentIndex = product.files.findIndex(
      (file) => file === selectedImage
    );
    const previousIndex = currentIndex - 1;
    setSelectedImageId(
      previousIndex >= 0
        ? product.files[previousIndex].id
        : product.files[product.files.length - 1].id
    );
  };

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        leftArrowRef.current &&
        !(leftArrowRef.current as HTMLElement).contains(event.target as Node) &&
        rightArrowRef.current &&
        !(rightArrowRef.current as HTMLElement).contains(event.target as Node)
      ) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="fixed top-0 left-0 z-50 w-screen h-screen bg-black/80 p-5 md:p-10 flex justify-center">
      <div className="size-full relative">
        <div className="absolute w-full flex justify-between items-start">
          <p className="text-gray-200 bg-black/50 py-1 px-3 rounded-full">
            {product.files.findIndex((file) => file === selectedImage) + 1}
            {" / "}
            {product.files.length}
          </p>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <XMark />
          </button>
        </div>
        <div className="size-full flex gap-2 justify-between items-center">
          <button
            ref={leftArrowRef}
            onClick={handlePreviousImage}
            className="text-white hover:text-gray-200"
          >
            <LeftChevron />
          </button>
          <div className="h-[80%] flex items-center">
            {selectedImage.type === "IMAGE" ? (
              <Image
                width={600}
                height={600}
                src={selectedImage.url}
                alt={product.name}
                className="size-full object-contain"
              />
            ) : (
              <video
                width={600}
                height={600}
                src={selectedImage.url}
                className="size-full object-contain"
                autoPlay
              />
            )}
          </div>
          <button
            ref={rightArrowRef}
            onClick={handleNextImage}
            className="text-white hover:text-gray-200"
          >
            <RightChevron />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
