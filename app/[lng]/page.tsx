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
  FullCollection,
  CollectionsList,
} from "@/app/shared/components";
import type {
  IHero,
  IProduct,
  ICollection,
  IBaseLangPage,
} from "@/app/shared/interfaces";

export default async function Home({ params: { lng } }: IBaseLangPage) {
  const heroes = (await getHeroes({})) as IHero[];
  const bestReviews = (await getTheBestReviews({})) as IProduct[];
  const collections = (await getAllCollections()) as ICollection[];
  const { selected, part1, part2 } = splitCollections(collections);
  const newestProducts = (await getTheNewestProducts({})) as IProduct[];
  const favoriteProducts = (await getTheFavoritesProducts({})) as IProduct[];

  return (
    <article className="pt-20 flex flex-col gap-8">
      <HeroSlider lng={lng} heroes={heroes} />
      <CollectionsList lng={lng} collections={part1} layDown />
      <ProductList
        lng={lng}
        title="Nuevos productos"
        products={newestProducts}
      />
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
  );
}

function splitCollections(collections: ICollection[]) {
  // Si el array está vacío, retornar valores predeterminados
  if (collections.length === 0) {
    return {
      selected: [],
      part1: [],
      part2: [],
    };
  }

  // Si el array tiene menos de 3 elementos, ajustamos los resultados
  if (collections.length < 3) {
    const selected = collections.slice(0, 2); // Tomamos hasta 2 elementos como seleccionados
    const part1 = collections.length > 2 ? collections.slice(2) : []; // El resto queda como parte 1
    const part2 = [] as ICollection[]; // No hay parte 2
    return { selected, part1, part2 };
  }

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
