"use client";

import { useState } from "react";
import { Search } from "@/app/shared/icons";
import { useRouter, useSearchParams } from "next/navigation";

interface IMainSearch {
  id: string;
  lng: string;
}

const MainSearch = ({ id, lng }: IMainSearch) => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  const handleQChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    if (query) {
      const params = new URLSearchParams();
      params.set("q", query);
      push(`/${lng}/search?${params.toString()}`);
    } else {
      push(`/${lng}`);
    }
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

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
          type="search"
          id={id}
          autoComplete="on"
          onChange={handleQChange}
          onKeyDown={handleEnter}
          defaultValue={searchParams.get("q") || ""}
          className="block w-full p-4 focus:outline-none text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:border-gray-500 dark:focus:border-gray-400 dark:text-white"
          placeholder="Buscar"
        />
        <button
          onClick={handleSearch}
          className="link-button-primary absolute top-2 end-2 font-medium text-sm"
        >
          <Search size="size-5" />
        </button>
      </div>
    </search>
  );
};

export default MainSearch;
