import { IUser } from "@/app/shared/interfaces";
import Datatable from "./Datatable";
// import { getMe } from "@/app/shared/services/user/controller";
import { getUsers } from "@/app/shared/services/user/controller/admin";

interface IDatatable {
  searchParams: {
    q?: string;
  };
}

const DataFetch = async ({ searchParams }: IDatatable) => {
  // const me = (await getMe()) as IUser;
  const users = (await getUsers(searchParams)) as IUser[];

  // const usersWithoutMe = users.filter((user) => user.id !== me.id);
  const usersWithoutAdmins = users.filter((user) => user.role !== "ADMIN");

  return <Datatable users={usersWithoutAdmins} />;
};

export default DataFetch;
