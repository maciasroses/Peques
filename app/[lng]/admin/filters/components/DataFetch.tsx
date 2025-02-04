import Datatable from "./Datatable";
import type {
  ICollection,
  IFilterGroup,
  IProduct,
} from "@/app/shared/interfaces";
import { getFilters } from "@/app/shared/services/filter/controller";

interface IDatatable {
  searchParams: {
    q?: string;
  };
  products: IProduct[];
  collections: ICollection[];
}

const DataFetch = async ({
  searchParams,
  products,
  collections,
}: IDatatable) => {
  const filters = (await getFilters(searchParams)) as IFilterGroup[];

  return (
    <Datatable
      filters={filters}
      products={products}
      collections={collections}
    />
  );
};

export default DataFetch;
