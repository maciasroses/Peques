import { getMe } from "@/app/shared/services/user/controller";
import { getHeroes } from "@/app/shared/services/hero/controller";
import { getAllCollections } from "@/app/shared/services/collection/controller";
import {
  getTheBestReviews,
  getTheNewestProducts,
  getTheFavoritesProducts,
} from "@/app/shared/services/product/controller";
import {
  HeroSlider,
  ReviewList,
  ProductList,
  InitialModal,
  FullCollection,
  CollectionsList,
} from "@/app/shared/components";
import type {
  IHero,
  IProduct,
  ICollection,
  IBaseLangPage,
  IUser,
} from "@/app/shared/interfaces";

export default async function Home({ params: { lng } }: IBaseLangPage) {
  const me = (await getMe()) as IUser;
  const heroes = (await getHeroes({})) as IHero[];
  const bestReviews = (await getTheBestReviews({})) as IProduct[];
  const collections = (await getAllCollections()) as ICollection[];
  const { selected, part1, part2 } = splitCollections(collections);
  const newestProducts = (await getTheNewestProducts({})) as IProduct[];
  const favoriteProducts = (await getTheFavoritesProducts({})) as IProduct[];

  return (
    <>
      {(!me || (me.orders && me.orders.length === 0)) && (
        <InitialModal lng={lng} />
      )}
      <article className="flex flex-col gap-8">
        <HeroSlider lng={lng} heroes={heroes} />
        <CollectionsList lng={lng} collections={part1} layDown />
        <ProductList lng={lng} title="NEW IN" products={newestProducts} />
        <FullCollection lng={lng} collection={selected[0]} imageSide="left" />
        <ProductList
          lng={lng}
          title="Los favoritos"
          products={favoriteProducts}
        />
        <CollectionsList lng={lng} collections={part2} />
        <ReviewList lng={lng} title="Testimonios" products={bestReviews} />
        <FullCollection lng={lng} collection={selected[1]} imageSide="right" />
      </article>
    </>
  );
}

function splitCollections(collections: ICollection[]) {
  if (collections.length === 0) {
    return {
      selected: [],
      part1: [],
      part2: [],
    };
  }

  let selected: ICollection[] = [];
  let part1: ICollection[] = [];
  let part2: ICollection[] = [];

  if (collections.length === 1) {
    part1 = [collections[0]];
  } else if (collections.length === 2) {
    part1 = [collections[0]];
    part2 = [collections[1]];
  } else {
    selected = collections.slice(0, 2);
    const remaining = collections.slice(2);

    remaining.forEach((item, index) => {
      if (index % 2 === 0) {
        part1.push(item);
      } else {
        part2.push(item);
      }
    });
  }

  return {
    selected,
    part1,
    part2,
  };
}
