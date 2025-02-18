import Link from "next/link";
import { notFound } from "next/navigation";
import { LeftArrow } from "@/app/shared/icons";
import { Card404, ProductCard } from "@/app/shared/components";
import { getMyListByName } from "@/app/shared/services/customList/controller";
import type { Metadata } from "next";
import type { ICustomList } from "@/app/shared/interfaces";

interface IListPage {
  params: {
    lng: string;
    name: string;
  };
}

export async function generateMetadata({
  params: { name },
}: IListPage): Promise<Metadata> {
  try {
    const customList = (await getMyListByName({ name })) as ICustomList;
    if (!customList) notFound();

    return {
      title: customList.name,
    };
  } catch {
    return {
      title: "Listas",
    };
  }
}

const ListPage = async ({ params: { lng, name } }: IListPage) => {
  const customList = (await getMyListByName({ name })) as ICustomList;
  if (!customList) notFound();

  return (
    <>
      <div className="flex items-start gap-4">
        <Link
          aria-label="Go back"
          href={`/${lng}/profile/lists`}
          className="text-blue-600 hover:text-blue-700 mt-1"
        >
          <LeftArrow size="size-6 md:size-8" />
        </Link>
        <div>
          <h1 className="text-xl md:text-4xl">{customList.name}</h1>
          <p className="text-base md:text-2xl text-gray-500 ml-1">
            {customList.description}
          </p>
          <p className="text-xs md:text-base text-gray-500 mt-2 ml-1">
            {customList.products.length}{" "}
            {customList.products.length === 1 ? "producto" : "productos"}
          </p>
        </div>
      </div>
      {customList.products.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {customList.products.map((product) => (
            <ProductCard
              lng={lng}
              isForCustomList
              key={product.productId}
              product={product.product}
              customListId={customList.id}
            />
          ))}
        </div>
      ) : (
        <Card404
          title="No products in this list"
          description="Add products to this list to see them here"
        />
      )}
    </>
  );
};

export default ListPage;
