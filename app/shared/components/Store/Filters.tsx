"use client";

import { cn } from "@/app/shared/utils/cn";
import { useEffect, useState } from "react";
import { NEW_FILTERS } from "@/app/shared/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CollectionKeys } from "../../interfaces";

interface IFiltersComp {
  lng?: string;
  collection?: CollectionKeys;
}

const Filters = ({ lng, collection }: IFiltersComp) => {
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

  const [activeTab, setActiveTab] = useState(1);

  const toggleTab = (index: number) => {
    setActiveTab(activeTab === index ? 1 : index);
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

  // const filteredByCollection = pathname.includes("collections")
  //   ? (pathname.split("/")[2] as CollectionKeys)
  //   : null;

  const isValidCollection = collection && collection in NEW_FILTERS;

  const FILTERS = isValidCollection
    ? NEW_FILTERS[collection]?.filters || []
    : Object.values(NEW_FILTERS).flatMap((collection) => collection.filters);

  return (
    <ul className="flex flex-col gap-4">
      {FILTERS.map((filter, index) => (
        <li key={filter.key} className="transition duration-200">
          <button onClick={() => toggleTab(index + 1)}>
            <p className="font-medium text-lg">{filter.group}</p>
          </button>
          <ul
            className={cn(
              "transition duration-200",
              activeTab === index + 1 ? "block" : "hidden"
            )}
          >
            {filter.options.map((option) => (
              <li key={option}>
                <button
                  className={cn(
                    "text-sm text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-300 ml-5",
                    searchParams
                      .get("filters")
                      ?.includes(
                        `${filter.key}_${option.toLowerCase().replace(/\s+/g, "-")}`
                      ) && "text-blue-600 dark:text-blue-300"
                  )}
                  onClick={() => {
                    handleFilter(option, filter.key);
                  }}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>

          {/* <select
                onChange={(e) => {
                  // Usar handleFilter con el grupo y la opción seleccionada
                  const selectedFilter = e.target.value;
                  handleFilter(selectedFilter, filter.key);
                }}
              >
                <option value="">Seleccionar</option>
                {filter.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select> */}
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
          <button type="submit" className="link-button-blue">
            Aplicar
          </button>
        </form>
      </li>
    </ul>
  );
};

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
