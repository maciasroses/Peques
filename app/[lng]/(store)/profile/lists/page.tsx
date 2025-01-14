import { Suspense } from "react";
import { ListsList } from "./components";
import { getMyLists } from "@/app/shared/services/customList/controller";
import { CustomListsListSkeleton, Pagination } from "@/app/shared/components";
import type {
  IBaseLangPage,
  ICustomListList,
  ICustomListSearchParams,
} from "@/app/shared/interfaces";

interface IProfileListsPage extends IBaseLangPage {
  searchParams?: ICustomListSearchParams;
}

const ProfileListsPage = async ({
  searchParams,
  params: { lng },
}: IProfileListsPage) => {
  const { page = "1" } = searchParams || {};

  const searchParamsForList = {
    page,
  };

  const { totalPages } = (await getMyLists(
    searchParamsForList
  )) as ICustomListList;

  return (
    <>
      <h1 className="text-4xl">Mis listas</h1>
      <Suspense key={page} fallback={<CustomListsListSkeleton />}>
        <ListsList lng={lng} searchParams={searchParamsForList} />
      </Suspense>
      <Pagination totalPages={totalPages} />
    </>
  );
};

export default ProfileListsPage;
