import { getMe } from "@/app/shared/services/user/controller";
import { getHeroes } from "@/app/shared/services/hero/controller";
import { getMyLists } from "@/app/shared/services/customList/controller";
import { getAllCollections } from "@/app/shared/services/collection/controller";
import {
  getTheNewestProducts,
  getTheFavoritesProducts,
} from "@/app/shared/services/product/controller";
import {
  HeroSlider,
  ProductList,
  FullCollection,
  CollectionsList,
} from "@/app/shared/components";
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
  const collections = (await getAllCollections()) as ICollection[];
  const { selected, part1, part2 } = splitCollections(collections);
  const newestProducts = (await getTheNewestProducts({})) as IProduct[];
  const myLists = (await getMyLists({ isForFav: true })) as ICustomList[];
  const favoriteProducts = (await getTheFavoritesProducts({})) as IProduct[];

  return (
    <article className="pt-[156px] md:pt-20 flex flex-col gap-8">
      <HeroSlider lng={lng} heroes={heroes} />
      <CollectionsList lng={lng} collections={part1} layDown />
      <ProductList
        title="Nuevos productos"
        lng={lng}
        myLists={myLists}
        products={newestProducts}
        userId={me?.id}
      />
      <FullCollection lng={lng} collection={selected[0]} imageSide="left" />
      {favoriteProducts.length > 0 && (
        <ProductList
          title="Los favoritos"
          lng={lng}
          myLists={myLists}
          products={favoriteProducts}
          userId={me?.id}
        />
      )}
      <CollectionsList lng={lng} collections={part2} />
      <FullCollection lng={lng} collection={selected[1]} imageSide="right" />
    </article>
  );
}

function splitCollections(collections: ICollection[]) {
  // Clonar el array para no modificar el original
  const remainingCollections = [...collections];

  // Seleccionar dos al azar
  const randomIndices: number[] = [];
  while (randomIndices.length < 2) {
    const randomIndex = Math.floor(Math.random() * remainingCollections.length);
    if (!randomIndices.includes(randomIndex)) {
      randomIndices.push(randomIndex);
    }
  }

  // Sacar los seleccionados
  const selected = randomIndices.map(
    (index) => remainingCollections.splice(index, 1)[0]
  );

  // Dividir el resto en dos partes
  const middleIndex = Math.ceil(remainingCollections.length / 2);
  const part1 = remainingCollections.slice(0, middleIndex);
  const part2 = remainingCollections.slice(middleIndex);

  return {
    selected,
    part1,
    part2,
  };
}
