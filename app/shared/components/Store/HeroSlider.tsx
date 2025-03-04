"use client";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { LeftChevron, RightChevron } from "@/app/shared/icons";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { IHero } from "@/app/shared/interfaces";
import { useEffect, useState } from "react";
import { cn } from "../../utils/cn";

interface IHeroSlider {
  lng: string;
  heroes: IHero[];
}

const HeroSlider = ({ lng, heroes }: IHeroSlider) => {
  if (heroes.length === 0) return null;
  return (
    <div>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
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
        speed={1000}
      >
        {heroes.map((hero, index) => (
          <SwiperSlide key={index}>
            <HeroSwiper lng={lng} hero={hero} />
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

const HeroSwiper = ({ lng, hero }: { lng: string; hero: IHero }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = hero.imageUrl;
    img.onload = () => setImageLoaded(true);
  }, [hero.imageUrl]);

  return (
    <div className="relative w-screen h-screen">
      {!imageLoaded && (
        <div className="absolute inset-0 bg-primary-light animate-pulse"></div>
      )}
      <div
        className={cn(
          "absolute inset-0 bg-cover bg-center transition-opacity duration-500",
          imageLoaded ? "opacity-100" : "opacity-0"
        )}
        style={{
          backgroundImage: imageLoaded ? `url(${hero.imageUrl})` : "none",
        }}
      />
      <div className="relative w-full h-full flex flex-col gap-4 items-center justify-center px-12 pt-32 pb-5 md:px-20 md:pt-40 md:pb-10 text-white text-center">
        <p className="text-base md:text-lg xl:text-2xl font-thin animate-fade-up">
          {hero.title}
        </p>
        <p className="text-xl md:text-3xl xl:text-5xl font-bold animate-fade-up animate-delay-500">
          {hero.subtitle}
        </p>
        <p className="text-lg md:text-2xl xl:text-4xl font-extralight animate-fade-up animate-delay-1000">
          {hero.description}
        </p>
        {hero.buttonLink && (
          <Link
            aria-label="Ver colección"
            href={`/${lng}/collections/${hero.collection.link}`}
          >
            <div className="text-base md:text-lg xl:text-2xl bg-white/20 hover:bg-white/40 p-4 rounded-xl animate-fade-up animate-delay-1000">
              {hero.buttonLink}
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};
