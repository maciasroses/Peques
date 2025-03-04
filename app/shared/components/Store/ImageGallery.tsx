"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LeftChevron, RightChevron, XMark } from "@/app/shared/icons";
import type { IProduct } from "@/app/shared/interfaces";
import { cn } from "../../utils/cn";

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
  const [loading, setLoading] = useState(true);

  const sortedFiles = useMemo(
    () => [...product.files].sort((a, b) => a.order - b.order),
    [product.files]
  );

  const selectedImage =
    product.files.find((file) => file.id === selectedImageId) ??
    product.files.find((file) => file.order === 1 && file.type === "IMAGE") ??
    product.files[0];

  const handleNextImage = () => {
    const currentIndex = sortedFiles.findIndex(
      (file) => file === selectedImage
    );
    const nextIndex = currentIndex + 1;
    setSelectedImageId(
      nextIndex < sortedFiles.length
        ? sortedFiles[nextIndex].id
        : sortedFiles[0].id
    );
  };

  const handlePreviousImage = () => {
    const currentIndex = sortedFiles.findIndex(
      (file) => file === selectedImage
    );
    const previousIndex = currentIndex - 1;
    setSelectedImageId(
      previousIndex >= 0
        ? sortedFiles[previousIndex].id
        : sortedFiles[sortedFiles.length - 1].id
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
    <div className="fixed top-0 left-0 z-50 w-screen h-screen bg-black/95 p-5 md:p-10 flex justify-center">
      <div className="size-full relative">
        <div className="absolute w-full flex justify-between items-start">
          <p className="text-gray-200 bg-black/50 py-1 px-3 rounded-full">
            {product.files
              .slice()
              .sort((a, b) => a.order - b.order)
              .findIndex((file) => file === selectedImage) + 1}
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
          <div className="h-[80%] flex items-center relative">
            {selectedImage.type === "IMAGE" ? (
              <>
                {loading && (
                  <div className="absolute inset-0 rounded-lg bg-primary-light animate-pulse"></div>
                )}
                <Image
                  width={600}
                  height={600}
                  alt={product.name}
                  src={selectedImage.url}
                  onLoad={() => setLoading(false)}
                  className={cn(
                    "size-full object-contain transition-opacity duration-300",
                    loading ? "opacity-0" : "opacity-100"
                  )}
                />
              </>
            ) : (
              <>
                {loading && (
                  <div className="absolute inset-0 rounded-lg bg-primary-light animate-pulse"></div>
                )}
                <video
                  width={600}
                  height={600}
                  src={selectedImage.url}
                  className={cn(
                    "size-full object-contain transition-opacity duration-300",
                    loading ? "opacity-0" : "opacity-100"
                  )}
                  autoPlay
                  onLoadedData={() => setLoading(false)}
                />
              </>
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
