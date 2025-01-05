import { HeroSlider } from "@/app/shared/components";
import { getHeroes } from "@/app/shared/services/hero/controller";
import type { IBaseLangPage, IHero } from "@/app/shared/interfaces";

export default async function Home({ params: { lng } }: IBaseLangPage) {
  const heroes = (await getHeroes()) as IHero[];

  return (
    // <div className="w-full h-screen flex flex-col gap-2 items-center justify-center px-4 pt-20">
    <HeroSlider lng={lng} heroes={heroes} />
    // </div>
  );
}
