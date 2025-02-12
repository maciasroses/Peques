import Datatable from "./Datatable";
import { getCollections } from "@/app/shared/services/collection/controller";
import type { ICollection, IProduct } from "@/app/shared/interfaces";

interface IDatatable {
  searchParams: {
    q?: string;
  };
  products: IProduct[];
}

const DataFetch = async ({ searchParams, products }: IDatatable) => {
  const collections = (await getCollections(searchParams)) as ICollection[];

  return (
    <Datatable
      collections={collections.sort((a, b) => a.order - b.order)}
      products={products}
    />
  );
};

export default DataFetch;
