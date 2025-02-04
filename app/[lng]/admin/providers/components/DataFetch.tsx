import Datatable from "./Datatable";
import { getProviders } from "@/app/shared/services/provider/controller";
import type { IProvider } from "@/app/shared/interfaces";

interface IDatatable {
  searchParams: {
    q?: string;
  };
}

const DataFetch = async ({ searchParams }: IDatatable) => {
  const providers = (await getProviders(searchParams)) as IProvider[];

  return <Datatable providers={providers} />;
};

export default DataFetch;
