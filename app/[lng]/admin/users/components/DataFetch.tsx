import Datatable from "./Datatable";
import { IUser } from "@/app/shared/interfaces";
import { getUsers } from "@/app/shared/services/user/controller";

interface IDatatable {
  searchParams: {
    q?: string;
  };
}

const DataFetch = async ({ searchParams }: IDatatable) => {
  const users = (await getUsers(searchParams)) as IUser[];
  const usersWithoutAdmins = users.filter((user) => user.role !== "ADMIN");

  return <Datatable users={usersWithoutAdmins} />;
};

export default DataFetch;
