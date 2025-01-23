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
}

const DataFetch = async ({ searchParams }: IDatatable) => {
  const promotions = (await getPromotions()) as IPromotion[];

  return <Datatable promotions={promotions} />;
};

export default DataFetch;
