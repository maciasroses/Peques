"use client";

import { ProductCard } from "@/app/shared/components";
import type { ICustomList, IProduct } from "@/app/shared/interfaces";

interface IRecentList {
  lng: string;
  userId: string;
  category: string;
  products: IProduct[];
  myLists: ICustomList[];
}

const RecentList = ({
  lng,
  userId,
  myLists,
  category,
  products,
}: IRecentList) => {
  const productsFilteredByCategory = products.filter(
    (product) => product.category === category.toUpperCase()
  );
  return (
    <section>
      <h1 className="text-2xl sm:text-4xl md:text-6xl text-center lg:text-left mb-2 md:mb-4">
        {category}
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <ProductCard
            lng={lng}
            key={index}
            userId={userId}
            myLists={myLists}
            product={productsFilteredByCategory[index]}
          />
        ))}
      </div>
    </section>
  );
};

export default RecentList;
