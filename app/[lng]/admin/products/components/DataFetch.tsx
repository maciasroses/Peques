import Datatable from "./Datatable";
import { getProducts } from "@/app/shared/services/product/controller";
import type { IProduct, IProvider } from "@/app/shared/interfaces";

interface IDatatable {
  providers: IProvider[];
  searchParams: {
    q?: string;
    availableQuantityFrom?: string;
    availableQuantityTo?: string;
    salePriceMXNFrom?: string;
    salePriceMXNTo?: string;
    provider?: string;
  };
}

const DataFetch = async ({ searchParams, providers }: IDatatable) => {
  const products = (await getProducts(searchParams)) as unknown as IProduct[];

  return <Datatable products={products} providers={providers} />;
};

export default DataFetch;
