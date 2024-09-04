import Datatable from "./Datatable";
import { getProducts } from "@/services/product/controller";
import type { IProduct, IProvider } from "@/interfaces";

interface IDatatable {
  providers: IProvider[];
  searchParams: {
    q?: string;
    quantityPerCartonFrom?: string;
    quantityPerCartonTo?: string;
    orderDateFrom?: string;
    orderDateTo?: string;
  };
}

const DataFetch = async ({ searchParams, providers }: IDatatable) => {
  const products = (await getProducts(searchParams)) as unknown as IProduct[];

  return <Datatable products={products} providers={providers} />;
};

export default DataFetch;