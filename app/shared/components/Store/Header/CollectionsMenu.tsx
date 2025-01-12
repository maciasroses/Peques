import Link from "next/link";
import { cn } from "@/app/shared/utils/cn";
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
  };

  const renderCollectionLink = (collection: ICollection) => (
    <li key={collection.id}>
      <Link
        onClick={handleClick}
        href={`/${lng}/collections/${collection.link}`}
        className="py-2 px-4 text-white hover:bg-neutral dark:hover:bg-primary dark:hover:text-gray-600 block"
      >
        {collection.name}
      </Link>
    </li>
  );

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
          {collections.map(renderCollectionLink)}
          <li>
            <Link
              href={`/${lng}/collections`}
              onClick={handleClick}
              className="py-2 px-4 text-white hover:bg-neutral dark:hover:bg-primary dark:hover:text-gray-600 block border-t border-black"
            >
              Todas las colecciones
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default CollectionsMenu;
