import Link from "next/link";
import { cn } from "@/app/shared/utils/cn";
import { useEffect, useState } from "react";
import { DownChevron } from "@/app/shared/icons";
import { useToggleMenu } from "@/app/shared/hooks";
import { useDisableScroll } from "@/app/shared/hooks";
import type { ICollection } from "@/app/shared/interfaces";

interface ICollectionsMenu {
  lng: string;
  collections: ICollection[];
  onParentClose?: () => void;
}

const CollectionsMenu = ({
  lng,
  collections,
  onParentClose,
}: ICollectionsMenu) => {
  const [tabSelected, setTabSelected] = useState(-1);
  const [subTabSelected, setSubTabSelected] = useState(-1);
  const {
    ref: menuRef,
    close: closeMenu,
    isOpen: menuOpen,
    toggle: toggleMenu,
  } = useToggleMenu<HTMLDivElement>();

  useDisableScroll(menuOpen);

  const handleClick = () => {
    if (onParentClose) {
      onParentClose();
    }
    closeMenu();
    setTabSelected(-1);
    setSubTabSelected(-1);
  };

  const handleTabClick = (index: number) => {
    tabSelected === index ? setTabSelected(-1) : setTabSelected(index);
    if (tabSelected !== index) {
      setSubTabSelected(-1);
    }
  };

  useEffect(() => {
    if (menuOpen) {
      setTabSelected(-1);
      setSubTabSelected(-1);
    }
  }, [menuOpen]);

  const renderCollectionLink = (collection: ICollection, index: number) => {
    return (
      <li key={collection.id}>
        <button
          onClick={() => handleTabClick(index)}
          className={cn(
            "py-2 px-4 md:hover:bg-neutral w-full text-left inline-flex justify-between items-center gap-2"
          )}
        >
          {collection.name}
          <span
            className={cn(
              "transform transition-all duration-300",
              tabSelected === index ? "rotate-180" : "rotate-0"
            )}
          >
            <DownChevron size="size-5" />
          </span>
        </button>
        {tabSelected === index && (
          <ul className="border-y border-black">
            <li>
              <Link
                href={`/${lng}/collections/${collection.link}`}
                onClick={handleClick}
                className="py-2 pl-8 pr-4 md:hover:bg-neutral block"
              >
                Ver todo
              </Link>
            </li>
            {collection.filters.map((filter, index) => (
              <li key={filter.groupId}>
                <button
                  onClick={() =>
                    subTabSelected === index
                      ? setSubTabSelected(-1)
                      : setSubTabSelected(index)
                  }
                  className="py-2 pl-8 pr-4 md:hover:bg-neutral w-full text-left inline-flex justify-between items-center gap-2"
                >
                  {filter.group.name}
                  <span
                    className={cn(
                      "transform transition-all duration-300",
                      subTabSelected === index ? "rotate-180" : "rotate-0"
                    )}
                  >
                    <DownChevron size="size-5" />
                  </span>
                </button>
                {subTabSelected === index && (
                  <ul className="border-y border-black">
                    {filter.group.filters.map((option, index) => (
                      <li key={option.id}>
                        <Link
                          onClick={handleClick}
                          href={`/${lng}/collections/${collection.link}?filters=${filter.group.key}_${option.key}`}
                          className="py-2 pl-12 pr-4 md:hover:bg-neutral block"
                        >
                          {option.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={toggleMenu}
        aria-haspopup="true"
        aria-expanded={menuOpen}
        className="cursor-pointer font-thin inline-flex items-center gap-1 text-lg"
      >
        COMPRA
        <span
          className={cn(
            "transform transition-all duration-300",
            menuOpen ? "rotate-180" : "rotate-0"
          )}
        >
          <DownChevron size="size-4" strokeWidth={2} />
        </span>
      </button>
      {menuOpen && (
        <ul className="z-10 w-52 md:w-auto max-h-[calc(100vh-200px)] md:max-h-[calc(100vh-100px)] overflow-y-auto mt-2 absolute md:bg-neutral-light md:rounded-md md:shadow-md text-gray-600 md:text-white">
          <li>
            <Link
              href={`/${lng}/collections`}
              onClick={handleClick}
              className="py-2 px-4 md:hover:bg-neutral block"
            >
              Ver todas las colecciones
            </Link>
          </li>
          {collections.map(renderCollectionLink)}
        </ul>
      )}
    </div>
  );
};

export default CollectionsMenu;
