import { CollectionsList, HeroSlider } from "@/app/shared/components";
import { getMe } from "@/app/shared/services/user/controller";
import { getHeroes } from "@/app/shared/services/hero/controller";
import { getMyLists } from "@/app/shared/services/customList/controller";
import { getAllProducts } from "@/app/shared/services/product/controller";
import { getAllCollections } from "@/app/shared/services/collection/controller";
import type {
  IUser,
  IHero,
  IProduct,
  ICustomList,
  ICollection,
  IBaseLangPage,
} from "@/app/shared/interfaces";

export default async function Home({ params: { lng } }: IBaseLangPage) {
  const me = (await getMe()) as IUser;
  const heroes = (await getHeroes({})) as IHero[];
  const products = (await getAllProducts()) as IProduct[];
  const collections = (await getAllCollections()) as ICollection[];
  const myLists = (await getMyLists({ isForFav: true })) as ICustomList[];

  return (
    <article className="pt-[156px] md:pt-20 flex flex-col gap-8">
      <HeroSlider lng={lng} heroes={heroes} />
      <CollectionsList lng={lng} collections={collections} />
    </article>
  );
}
