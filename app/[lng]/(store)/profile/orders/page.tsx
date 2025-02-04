import { Suspense } from "react";
import { OrdersList } from "./components";
import { getMyOrders } from "@/app/shared/services/order/controller";
import { OrdersListSkeleton, Pagination } from "@/app/shared/components";
import type { Metadata } from "next";
import type {
  IOrderList,
  IBaseLangPage,
  IOrderSearchParams,
} from "@/app/shared/interfaces";

export const metadata: Metadata = {
  title: "Mis pedidos",
};

interface IProfileOrdersPage extends IBaseLangPage {
  searchParams?: IOrderSearchParams;
}

const ProfileOrdersPage = async ({
  searchParams,
  params: { lng },
}: IProfileOrdersPage) => {
  const { page = "1" } = searchParams || {};

  const searchParamsForList = {
    page,
  };

  const { totalPages } = (await getMyOrders(searchParamsForList)) as IOrderList;

  return (
    <>
      <h1 className="text-4xl">Mis pedidos</h1>
      <Suspense key={page} fallback={<OrdersListSkeleton />}>
        <OrdersList lng={lng} searchParams={searchParamsForList} />
      </Suspense>
      <Pagination totalPages={totalPages} />
    </>
  );
};

export default ProfileOrdersPage;
