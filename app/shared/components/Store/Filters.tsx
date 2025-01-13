"use client";

import { cn } from "@/app/shared/utils/cn";
import { CATEGORIES_FILTERS } from "@/app/shared/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { LanguageTypeForSchemas } from "@/app/shared/interfaces";
import { useEffect, useState } from "react";

interface IFiltersComp {
  lng: string;
}

const Filters = ({ lng }: IFiltersComp) => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const [salePriceMXNFrom, setSalePriceMXNFrom] = useState(
    searchParams.get("salePriceMXNFrom") || ""
  );
  const [salePriceMXNTo, setSalePriceMXNTo] = useState(
    searchParams.get("salePriceMXNTo") || ""
  );

  useEffect(() => {
    // Sincroniza los valores cuando cambian los searchParams
    setSalePriceMXNFrom(searchParams.get("salePriceMXNFrom") || "");
    setSalePriceMXNTo(searchParams.get("salePriceMXNTo") || "");
  }, [searchParams]);

  const handleCategory = (category: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete("page");
    params.set("category", category);
    replace(`${pathname}?${params.toString()}`);
  };

  const handlePrice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams(searchParams);
    params.delete("page");

    const fromValue = formData.get("salePriceMXNFrom") as string;
    const toValue = formData.get("salePriceMXNTo") as string;

    if (fromValue) {
      params.set("salePriceMXNFrom", fromValue);
    } else {
      params.delete("salePriceMXNFrom");
    }

    if (toValue) {
      params.set("salePriceMXNTo", toValue);
    } else {
      params.delete("salePriceMXNTo");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <ul className="flex flex-col gap-4">
      <li>
        <h1 className="font-medium text-lg">Categorías</h1>
        <ul className="flex flex-col">
          {CATEGORIES_FILTERS[lng as LanguageTypeForSchemas].map(
            ({ label, category }) => (
              <li key={category}>
                <ButtonCategoryComponent
                  label={label}
                  category={category}
                  searchParams={searchParams}
                  handleCategory={handleCategory}
                />
              </li>
            )
          )}
        </ul>
      </li>
      <li>
        <h2 className="font-medium text-lg">Precio</h2>
        <form onSubmit={handlePrice} className="flex gap-2 flex-col ml-5 mt-2">
          <div className="flex gap-2 items-center">
            <InputField
              placeholder="Desde"
              name="salePriceMXNFrom"
              value={salePriceMXNFrom}
              onChange={(e) => setSalePriceMXNFrom(e.target.value)}
            />
            {" - "}
            <InputField
              placeholder="Hasta"
              name="salePriceMXNTo"
              value={salePriceMXNTo}
              onChange={(e) => setSalePriceMXNTo(e.target.value)}
            />
          </div>
          <button type="submit" className="link-button-blue">
            Aplicar
          </button>
        </form>
      </li>
    </ul>
  );
};

const ButtonCategoryComponent = ({
  label,
  category,
  searchParams,
  handleCategory,
}: {
  label: string;
  category: string;
  searchParams: URLSearchParams;
  handleCategory: (category: string) => void;
}) => (
  <button
    onClick={() => handleCategory(category)}
    className={cn(
      "text-sm text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-300 ml-5",
      searchParams.get("category") === category &&
        "text-blue-600 dark:text-blue-300"
    )}
  >
    {label}
  </button>
);

const InputField = ({
  name,
  placeholder,
  value,
  onChange,
}: {
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <input
    type="number"
    step="0.01"
    name={name}
    min="0"
    max="19999999"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full p-2 rounded-lg focus:outline-none border bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white dark:placeholder-gray-400 border-gray-300 focus:border-gray-500 dark:focus:border-gray-100"
  />
);

export default Filters;
