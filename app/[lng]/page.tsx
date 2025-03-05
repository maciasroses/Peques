import { getMe } from "@/app/shared/services/user/controller";
import { getHeroes } from "@/app/shared/services/hero/controller";
import { getTheBestReviews } from "@/app/shared/services/product/controller";
import { getAllCollections } from "@/app/shared/services/collection/controller";
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

  const firstOnes = collections.slice(0, 2);
  const newIn = collections.find((c) => c.name === "NEW IN");
  const rest = collections.filter(
    (c) => !firstOnes.includes(c) && c.name !== "NEW IN"
  );

  return (
    <>
      {(!me || (me.orders && me.orders.length === 0)) && (
        <InitialModal lng={lng} />
      )}
      <article className="flex flex-col gap-8">
        <HeroSlider lng={lng} heroes={heroes} />
        {newIn && (
          <ProductList
            lng={lng}
            title="NEW IN"
            products={newIn.products
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((p) => p.product)}
          />
        )}
        <FullCollection lng={lng} collection={firstOnes[0]} imageSide="left" />
        <CollectionsList lng={lng} collections={rest} layDown />
        <ReviewList lng={lng} title="Testimonios" products={bestReviews} />
        <FullCollection lng={lng} collection={firstOnes[1]} imageSide="right" />
      </article>
    </>
  );
}
