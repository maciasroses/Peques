"use client";

import { ProductCard } from "@/app/shared/components";
import type { ICustomList, IProduct } from "@/app/shared/interfaces";

interface IProductList {
  lng: string;
  title: string;
  userId: string;
  products: IProduct[];
  myLists: ICustomList[];
}

const ProductList = ({
  lng,
  title,
  userId,
  myLists,
  products,
}: IProductList) => {
  if (products.length === 0) return null;
  console.log(products);
  return (
    <section>
      <h1 className="text-2xl sm:text-4xl md:text-6xl text-center mb-2 md:mb-4">
        {title}
      </h1>
      <ul className="flex pr-5 overflow-x-auto items-start w-full max-w-min mx-auto">
        {products.map((product, index) => (
          <li key={index} className="min-w-[250px] md:min-w-[500px] ml-5">
            <ProductCard
              lng={lng}
              userId={userId}
              myLists={myLists}
              product={product}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ProductList;
