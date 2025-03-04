"use client";

import Link from "next/link";
import { cn } from "@/app/shared/utils/cn";
import type { ICollection } from "@/app/shared/interfaces";
import { useEffect, useRef, useState } from "react";
import { LeftChevron, RightChevron } from "../../icons";

interface ICollectionsList {
  lng: string;
  layDown?: boolean;
  collections: ICollection[];
}

const CollectionsList = ({ lng, layDown, collections }: ICollectionsList) => {
  const listRef = useRef<HTMLUListElement>(null);
  const [cardWidth, setCardWidth] = useState(layDown ? 250 : 150);

  useEffect(() => {
    const updateCardWidth = () => {
      setCardWidth(
        window.innerWidth >= 768 ? (layDown ? 500 : 300) : layDown ? 250 : 150
      );
    };

    updateCardWidth();
    window.addEventListener("resize", updateCardWidth);

    return () => window.removeEventListener("resize", updateCardWidth);
  }, [layDown]);

  if (collections.length === 0) return null;

  const scroll = (direction: "left" | "right" = "right") => {
    if (listRef.current) {
      listRef.current.scrollBy({
        left: direction === "left" ? -cardWidth : cardWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative w-full flex items-center">
      <button
        className="absolute left-5 z-10 bg-white p-2 shadow-lg rounded-full opacity-50 hover:opacity-100 transition-opacity duration-300"
        onClick={() => scroll("left")}
      >
        <LeftChevron />
      </button>
      <ul
        ref={listRef}
        className="flex pr-5 overflow-x-auto items-start w-full max-w-min mx-auto scroll-smooth"
      >
        {collections.map((collection) => (
          <CollectionLi
            lng={lng}
            layDown={layDown}
            key={collection.id}
            collection={collection}
          />
        ))}
      </ul>
      <button
        className="absolute right-5 z-10 bg-white p-2 shadow-lg rounded-full opacity-50 hover:opacity-100 transition-opacity duration-300"
        onClick={() => scroll("right")}
      >
        <RightChevron />
      </button>
    </section>
  );
};

export default CollectionsList;

const CollectionLi = ({
  lng,
  layDown,
  collection,
}: {
  lng: string;
  layDown?: boolean;
  collection: ICollection;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = collection.imageUrl;
    img.onload = () => setImageLoaded(true);
  }, [collection.imageUrl]);

  return (
    <li
      key={collection.id}
      className={cn(
        "bg-gray-300 relative rounded-md text-center ml-5",
        layDown
          ? "w-[250px] md:w-[500px] h-[150px] md:h-[300px]"
          : "w-[150px] md:w-[300px] h-[250px] md:h-[500px] "
      )}
    >
      <Link href={`/${lng}/collections/${collection.link}`} className="group">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-primary-light animate-pulse rounded-md"></div>
        )}

        <div
          className={cn(
            "bg-cover rounded-md transition-opacity duration-300",
            imageLoaded ? "opacity-100" : "opacity-0",
            layDown
              ? "w-[250px] md:w-[500px] h-[150px] md:h-[300px]"
              : "w-[150px] md:w-[300px] h-[250px] md:h-[500px] "
          )}
          style={{
            backgroundImage: imageLoaded
              ? `url(${collection.imageUrl})`
              : "none",
          }}
        />
        <div
          className={cn(
            "absolute size-full top-0 left-0 py-10 px-4 group-hover:bg-opacity-30 transition-all duration-500 flex flex-col justify-end items-center rounded-md",
            imageLoaded && "bg-black/50"
          )}
        >
          <p className="font-bold text-lg md:text-2xl text-white">
            {collection.name}
          </p>
          <p className="opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 text-white bg-white/20 hover:bg-white/40 px-4 py-2 rounded-md text-xs md:text-base mt-2">
            Ver colección
          </p>
        </div>
      </Link>
    </li>
  );
};
