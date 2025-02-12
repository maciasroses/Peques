import { getMe } from "@/app/shared/services/user/controller";
import { getHeroes } from "@/app/shared/services/hero/controller";
import { getAllCollections } from "@/app/shared/services/collection/controller";
import {
  getTheBestReviews,
  getTheNewestProducts,
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
  IUser,
  IHero,
  IProduct,
  ICollection,
  IBaseLangPage,
} from "@/app/shared/interfaces";

export default async function Home({ params: { lng } }: IBaseLangPage) {
  const me = (await getMe()) as IUser;
  const heroes = (await getHeroes({})) as IHero[];
  const bestReviews = (await getTheBestReviews({})) as IProduct[];
  const collections = (await getAllCollections()) as ICollection[];
  const newestProducts = (await getTheNewestProducts({})) as IProduct[];

  const [first, second, ...rest] = collections;

  return (
    <>
      {(!me || (me.orders && me.orders.length === 0)) && (
        <InitialModal lng={lng} />
      )}
      <article className="flex flex-col gap-8">
        <HeroSlider lng={lng} heroes={heroes} />
        <ProductList lng={lng} title="NEW IN" products={newestProducts} />
        <FullCollection lng={lng} collection={first} imageSide="left" />
        <CollectionsList lng={lng} collections={rest} layDown />
        <ReviewList lng={lng} title="Testimonios" products={bestReviews} />
        <FullCollection lng={lng} collection={second} imageSide="right" />
      </article>
    </>
  );
}
