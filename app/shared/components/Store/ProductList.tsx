"use client";

import { useEffect, useRef, useState } from "react";
import { ProductCard } from "@/app/shared/components";
import { LeftChevron, RightChevron } from "@/app/shared/icons";
import type { IProduct } from "@/app/shared/interfaces";

interface IProductList {
  lng: string;
  title: string;
  products: IProduct[];
}

const ProductList = ({ lng, title, products }: IProductList) => {
  const listRef = useRef<HTMLUListElement>(null);
  const [cardWidth, setCardWidth] = useState(150);

  useEffect(() => {
    const updateCardWidth = () => {
      setCardWidth(window.innerWidth >= 768 ? 300 : 150);
    };

    updateCardWidth();
    window.addEventListener("resize", updateCardWidth);

    return () => window.removeEventListener("resize", updateCardWidth);
  }, []);

  if (products.length === 0) return null;

  const scroll = (direction: "left" | "right" = "right") => {
    if (listRef.current) {
      listRef.current.scrollBy({
        left: direction === "left" ? -cardWidth : cardWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <section>
      <h1 className="text-2xl sm:text-4xl mb-2 md:mb-4 pl-4 text-gray-600">
        {title}
      </h1>
      <div className="relative w-full flex items-center">
        <button
          className="absolute left-2 z-10 bg-white p-2 shadow-lg rounded-full opacity-50 hover:opacity-100 transition-opacity duration-300"
          onClick={() => scroll("left")}
        >
          <LeftChevron />
        </button>
        <ul
          ref={listRef}
          className="flex pr-5 overflow-x-auto items-start w-full max-w-min mx-auto scroll-smooth"
        >
          {products.map((product, index) => (
            <li key={index} className="min-w-[150px] sm:min-w-[300px] ml-5">
              <ProductCard lng={lng} product={product} />
            </li>
          ))}
        </ul>
        <button
          className="absolute right-2 z-10 bg-white p-2 shadow-lg rounded-full opacity-50 hover:opacity-100 transition-opacity duration-300"
          onClick={() => scroll("right")}
        >
          <RightChevron />
        </button>
      </div>
    </section>
  );
};

export default ProductList;
