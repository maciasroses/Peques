"use client";

import { Search } from "@/app/shared/icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

interface IMainSearch {
  id: string;
  lng: string;
  onParentClose?: () => void;
}

const MainSearch = forwardRef(
  ({ id, lng, onParentClose }: IMainSearch, ref) => {
    const { push } = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleQChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
    };

    const handleSearch = () => {
      if (query) {
        const params = new URLSearchParams();
        params.set("q", query);

        const isSpecificCollection = new RegExp(
          `^/${lng}/collections/[a-z-]+$`
        ).test(pathname);

        if (isSpecificCollection) {
          push(`${pathname}?${params.toString()}`);
        } else {
          push(`/${lng}/search?${params.toString()}`);
        }
      } else {
        if (pathname.includes("search")) {
          push(`/${lng}`);
        } else {
          push(pathname);
        }
      }
      if (onParentClose) {
        onParentClose();
      }
    };

    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    };

    useImperativeHandle(ref, () => ({
      focusInput: () => {
        inputRef.current?.focus();
      },
    }));

    return (
      <search>
        <label
          htmlFor={id}
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Buscar
        </label>
        <div className="relative">
          <input
            id={id}
            type="search"
            ref={inputRef}
            autoComplete="on"
            placeholder="Buscar"
            onKeyDown={handleEnter}
            onChange={handleQChange}
            defaultValue={searchParams.get("q") || ""}
            className="block w-full p-4 focus:outline-none text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:border-gray-500 dark:focus:border-gray-400 dark:text-white"
          />
          <button
            aria-label="Search"
            onClick={handleSearch}
            className="link-button-primary absolute top-2 end-2 font-medium text-sm"
          >
            <Search size="size-5" />
          </button>
        </div>
      </search>
    );
  }
);

MainSearch.displayName = "MainSearch";

export default MainSearch;
