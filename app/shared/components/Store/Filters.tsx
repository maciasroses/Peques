"use client";

import { cn } from "@/app/shared/utils/cn";
import { useEffect, useState } from "react";
import { LeftChevron } from "@/app/shared/icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { IFilterGroup } from "@/app/shared/interfaces";

interface IFiltersComp {
  collection?: string;
  filters: IFilterGroup[];
}

const Filters = ({ filters, collection }: IFiltersComp) => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const [salePriceMXNTo, setSalePriceMXNTo] = useState(
    searchParams.get("salePriceMXNTo") || ""
  );
  const [salePriceMXNFrom, setSalePriceMXNFrom] = useState(
    searchParams.get("salePriceMXNFrom") || ""
  );

  useEffect(() => {
    setSalePriceMXNFrom(searchParams.get("salePriceMXNFrom") || "");
    setSalePriceMXNTo(searchParams.get("salePriceMXNTo") || "");
  }, [searchParams]);

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

  const handleClearPrice = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("page");
    params.delete("salePriceMXNTo");
    params.delete("salePriceMXNFrom");
    replace(`${pathname}?${params.toString()}`);
  };

  const handleFilter = (filter: string, group: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete("page"); // Reset pagination when changing filters

    // Obtener los filtros actuales
    const currentFilters = params.get("filters")?.split(",") || [];

    // Filtrar solo el filtro del grupo actual si ya existe y eliminarlo
    const updatedFilters = currentFilters.filter(
      (f) => !f.startsWith(`${group}_`) // Eliminar cualquier filtro del grupo actual
    );

    // Añadir el nuevo filtro para este grupo
    const newFilter = `${group}_${filter.toLowerCase().replace(/\s+/g, "-")}`;
    updatedFilters.push(newFilter);

    // Establecer los filtros actualizados en los parámetros de búsqueda
    params.set("filters", updatedFilters.join(","));
    replace(`${pathname}?${params.toString()}`);
  };

  const handleClearFilter = (group: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete("page"); // Reset pagination when changing filters

    // Obtener los filtros actuales
    const currentFilters = params.get("filters")?.split(",") || [];

    // Filtrar solo el filtro del grupo actual si ya existe y eliminarlo
    const updatedFilters = currentFilters.filter(
      (f) => !f.startsWith(`${group}_`) // Eliminar cualquier filtro del grupo actual
    );

    const filtersEmpty = updatedFilters.length === 0;

    if (filtersEmpty) {
      params.delete("filters");
    } else {
      // Establecer los filtros actualizados en los parámetros de búsqueda
      params.set("filters", updatedFilters.join(","));
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleClearAllFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("filters");
    params.delete("salePriceMXNTo");
    params.delete("salePriceMXNFrom");
    replace(`${pathname}?${params.toString()}`);
  };

  const FILTERS = collection
    ? filters.filter((filter) =>
        filter.collections.some((col) => col.collection.link === collection)
      )
    : filters;

  return (
    <ul className="flex flex-col gap-4">
      <li
        className={cn(
          "hidden",
          (searchParams.get("filters") ||
            searchParams.get("salePriceMXNTo") ||
            searchParams.get("salePriceMXNFrom")) &&
            "block text-lg text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-300"
        )}
      >
        <button
          title="Limpiar todos los filtros"
          onClick={() => handleClearAllFilters()}
          className="inline-flex items-center gap-1 mr-6"
        >
          <LeftChevron />
          <span className="line-clamp-1 text-left">
            Limpiar todos los filtros
          </span>
        </button>
      </li>
      {FILTERS.map((filter) => (
        <li key={filter.key}>
          <p className="font-medium text-lg">{filter.name}</p>
          <ul>
            {filter.filters.map((option) => (
              <li key={option.id}>
                <button
                  className={cn(
                    "text-sm text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-300 ml-5",
                    searchParams
                      .get("filters")
                      ?.includes(`${filter.key}_${option.key}`) &&
                      "text-blue-600 dark:text-blue-300"
                  )}
                  onClick={() => {
                    handleFilter(option.key, filter.key);
                  }}
                >
                  {option.name}
                </button>
              </li>
            ))}
            <li
              className={cn(
                "hidden",
                searchParams.get("filters")?.includes(filter.key) &&
                  "block mt-2 ml-5 text-sm text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-300"
              )}
            >
              <button
                title={`Limpiar filtro "${filter.name}"`}
                onClick={() => handleClearFilter(filter.key)}
                className="inline-flex items-center gap-1"
              >
                <LeftChevron size="size-4" />
                <span className="line-clamp-1 text-left">
                  Limpiar filtro {`"${filter.name}"`}
                </span>
              </button>
            </li>
          </ul>
        </li>
      ))}
      <li>
        <p className="font-medium text-lg">Precio</p>
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
          <button
            type="submit"
            className="px-4 py-2 bg-neutral text-white rounded-lg"
          >
            Aplicar
          </button>
          <button
            type="button"
            onClick={() => handleClearPrice()}
            className={cn(
              "hidden",
              (searchParams.get("salePriceMXNTo") ||
                searchParams.get("salePriceMXNFrom")) &&
                "block"
            )}
          >
            <p className="inline-flex items-center gap-1 line-clamp-1 text-left text-sm mt-2">
              <LeftChevron size="size-4" />
              <span>Limpiar filtro precio</span>
            </p>
          </button>
        </form>
      </li>
    </ul>
  );
};

export default Filters;

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
