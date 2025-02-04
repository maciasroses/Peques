import Datatable from "./Datatable";
import { getCollections } from "@/app/shared/services/collection/controller";
import type {
  ICollection,
  IProduct,
  IPromotion,
} from "@/app/shared/interfaces";
import { getPromotions } from "@/app/shared/services/promotion/controller";

interface IDatatable {
  searchParams: {
    q?: string;
  };
  products: IProduct[];
  collections: ICollection[];
}

const DataFetch = async ({
  products,
  collections,
  searchParams,
}: IDatatable) => {
  const promotions = (await getPromotions(searchParams)) as IPromotion[];

  return (
    <Datatable
      products={products}
      promotions={promotions}
      collections={collections}
    />
  );
};

export default DataFetch;
