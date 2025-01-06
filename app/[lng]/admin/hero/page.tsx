import { ListDnd } from "./components";
import { getHeroes } from "@/app/shared/services/hero/controller";
import { getCollections } from "@/app/shared/services/collection/controller";
import type { Metadata } from "next";
import type { ICollection, IHero } from "@/app/shared/interfaces";

export const metadata: Metadata = {
  title: "Hero",
};

const AdminHeroPage = async () => {
  const collections = (await getCollections({})) as ICollection[];
  const heroes = (await getHeroes({ isAdminRequest: true })) as IHero[];

  return <ListDnd heroes={heroes} collections={collections} />;
};

export default AdminHeroPage;
