"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/app/shared//utils/cn";
import type { ICollection } from "@/app/shared/interfaces";

interface IFullCollection {
  lng: string;
  collection: ICollection;
  imageSide: "left" | "right";
}

const FullCollection = ({ lng, collection, imageSide }: IFullCollection) => {
  const [loading, setLoading] = useState(true);

  if (!collection) return null;
  const isTextLeft = imageSide === "left";

  return (
    <section className="w-full h-auto md:h-[400px] flex flex-col md:flex-row px-5 md:px-20 bg-primary-light text-black">
      <div
        className={cn(
          "w-full md:w-1/2 lg:w-2/3 md:pt-10 relative",
          isTextLeft ? "md:order-2" : "md:order-1"
        )}
      >
        {loading && (
          <div
            className={cn(
              "absolute inset-0 bg-black/30 animate-pulse",
              isTextLeft ? "rounded-t-full" : "rounded-se-full"
            )}
          ></div>
        )}
        <Image
          width={1920}
          height={1080}
          alt={collection.name}
          onLoad={() => setLoading(false)}
          src={collection.imageUrl}
          className={cn(
            "object-cover size-full transition-opacity duration-300",
            isTextLeft ? "rounded-t-full" : "rounded-se-full",
            loading ? "opacity-0" : "opacity-100"
          )}
        />
      </div>
      <div
        className={cn(
          "w-full md:w-1/2 lg:w-1/3 flex flex-col justify-center items-center gap-4 py-10",
          isTextLeft ? "md:order-1" : "md:order-2"
        )}
      >
        <h2 className="text-xl md:text-2xl">{collection.name}</h2>
        <Link
          href={`/${lng}/collections/${collection.link}`}
          className="bg-white/70 hover:bg-white/90 p-4 rounded-xl"
        >
          Ver colección
        </Link>
      </div>
    </section>
  );
};

export default FullCollection;
