"use client";

import Image from "next/image";
import { cn } from "@/app/shared/utils/cn";
import { PlayIcon } from "@/app/shared/icons";
import type { IProductFile } from "@/app/shared/interfaces";
import { useState } from "react";

const MediaPreview = ({
  alt,
  file,
  isAllGallery,
  onMouseEnter,
}: {
  alt: string;
  file: IProductFile;
  isAllGallery?: boolean;
  onMouseEnter?: () => void;
}) => {
  const [loading, setLoading] = useState(true);

  if (file.type === "IMAGE") {
    return (
      <>
        {loading && (
          <div className="absolute inset-0 rounded-2xl bg-primary-light animate-pulse"></div>
        )}
        <Image
          priority
          alt={alt}
          src={file.url}
          onMouseEnter={onMouseEnter}
          width={isAllGallery ? 64 : 500}
          onLoad={() => setLoading(false)}
          height={isAllGallery ? 64 : 300}
          className={cn(
            "object-contain size-full transition-opacity duration-300",
            isAllGallery && "rounded-2xl",
            loading ? "opacity-0" : "opacity-100"
          )}
        />
      </>
    );
  }
  if (file.type === "VIDEO") {
    if (isAllGallery) {
      return (
        <div
          className="flex items-center justify-center w-full h-full"
          onMouseEnter={onMouseEnter}
        >
          <PlayIcon size="size-8" />
        </div>
      );
    } else {
      return (
        <>
          {loading && (
            <div className="absolute inset-0 rounded-2xl bg-primary-light animate-pulse"></div>
          )}
          <video
            muted
            autoPlay
            width={500}
            height={300}
            src={file.url}
            onMouseEnter={onMouseEnter}
            onLoadedData={() => setLoading(false)}
            className={cn(
              "size-auto object-contain transition-opacity duration-300",
              loading ? "opacity-0" : "opacity-100"
            )}
          />
        </>
      );
    }
  }
  return null;
};

export default MediaPreview;
