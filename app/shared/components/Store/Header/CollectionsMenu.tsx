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
            "py-2 px-4 text-white hover:bg-neutral dark:hover:bg-primary dark:hover:text-gray-600 w-full text-left inline-flex justify-between items-center gap-2"
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
                className="py-2 pl-8 pr-4 text-white hover:bg-neutral dark:hover:bg-primary dark:hover:text-gray-600 block"
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
                  className="py-2 pl-8 pr-4 text-white hover:bg-neutral dark:hover:bg-primary dark:hover:text-gray-600 w-full text-left inline-flex justify-between items-center gap-2"
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
                          className="py-2 pl-12 pr-4 text-white hover:bg-neutral dark:hover:bg-primary dark:hover:text-gray-600 block"
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
        className="cursor-pointer text-gray-600 dark:text-white font-extralight hover:underline inline-flex items-center gap-1"
      >
        Colecciones
        <span
          className={cn(
            "transform transition-all duration-300",
            menuOpen ? "rotate-180" : "rotate-0"
          )}
        >
          <DownChevron size="size-5" />
        </span>
      </button>
      {menuOpen && (
        <ul className="mt-2 absolute bg-neutral-light dark:bg-primary-dark rounded-md shadow-md w-auto z-10 max-h-[200px] overflow-y-auto">
          <li>
            <Link
              href={`/${lng}/collections`}
              onClick={handleClick}
              className="py-2 px-4 text-white hover:bg-neutral dark:hover:bg-primary dark:hover:text-gray-600 block"
            >
              Ver todas
            </Link>
          </li>
          {collections.map(renderCollectionLink)}
        </ul>
      )}
    </div>
  );
};

export default CollectionsMenu;
