"use client";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { LeftChevron, RightChevron } from "@/app/shared/icons";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { IHero } from "@/app/shared/interfaces";

interface IHeroSlider {
  lng: string;
  heroes: IHero[];
}

const HeroSlider = ({ lng, heroes }: IHeroSlider) => {
  if (heroes.length === 0) return null;
  return (
    <div className="">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        autoplay={{
          delay: 4000,
          pauseOnMouseEnter: true,
        }}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        pagination={{
          clickable: true,
          el: ".custom-pagination",
          bulletClass: "custom-pagination-bullet",
          bulletActiveClass: "custom-pagination-bullet-active",
        }}
        loop
      >
        {heroes.map((hero, index) => (
          <SwiperSlide key={index}>
            <div
              className="w-screen h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h=[700px] bg-cover bg-center"
              style={{ backgroundImage: `url(${hero.imageUrl})` }}
            >
              <Link
                aria-label="Ver colección"
                href={`/${lng}/collections/${hero.collection.link}`}
              >
                <div className="w-full h-full bg-black bg-opacity-30 flex flex-col items-center justify-end p-10 md:p-20 text-white text-center">
                  <p className="text-base md:text-lg xl:text-2xl font-thin">
                    {hero.title}
                  </p>
                  <p className="text-xl md:text-3xl xl:text-5xl font-bold">
                    {hero.subtitle}
                  </p>
                  <p className="text-lg md:text-2xl xl:text-4xl font-extralight">
                    {hero.description}
                  </p>
                  {(hero.title || hero.subtitle || hero.description) && (
                    <div className="mt-2 text-base md:text-lg xl:text-2xl link-button-primary">
                      Ver colección
                    </div>
                  )}
                  {/* <Link
                    className="mt-2 px-4 py-2 bg-white text-black rounded-full text-base md:text-lg xl:text-2xl"
                    href={`/${lng}/collections/${hero.collection.link}`}
                  >
                    Ver colección
                  </Link> */}
                </div>
              </Link>
            </div>
          </SwiperSlide>
        ))}
        <div className="custom-prev">
          <LeftChevron size="size-6 md:size-8 xl:size-10" />
        </div>
        <div className="custom-next">
          <RightChevron size="size-6 md:size-8 xl:size-10" />
        </div>
        <div className="custom-pagination flex justify-center gap-2 absolute bottom-2 z-10">
          <span className="w-3 h-3 bg-black/50 rounded-full transition-transform duration-300 sm:w-4 sm:h-4 md:w-6 md:h-6"></span>
          <span className="w-3 h-3 bg-black/50 rounded-full transition-transform duration-300 transform scale-125 sm:w-4 sm:h-4 md:w-6 md:h-6"></span>
        </div>
      </Swiper>
    </div>
  );
};

export default HeroSlider;
