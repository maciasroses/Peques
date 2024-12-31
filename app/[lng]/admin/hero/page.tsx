import { ListDnd } from "./components";
import { getHeroes } from "@/app/shared/services/hero/controller";
import type { IHero } from "@/app/shared/interfaces";

const AdminHeroPage = async () => {
  const heroes = (await getHeroes()) as IHero[];

  return <ListDnd heroes={heroes} />;
};

export default AdminHeroPage;
