"use client";

import { ReactNode } from "react";
import { useSearchFilter } from "@/hooks";
import { GenericSearchInput } from "@/components";

const Searchbar = () => {
  const defaultFilters = {
    q: "",
    quantityPerCartonFrom: "",
    quantityPerCartonTo: "",
    orderDateFrom: "",
    orderDateTo: "",
  };

  const { filters, handleSearch, clearFilters } =
    useSearchFilter(defaultFilters);

  return (
    <search className="min-w-full mx-auto mt-6 mb-4">
      <div className="flex flex-col gap-2">
        <GenericParentDiv>
          <GenericDiv>
            <FlexComponent>
              <GenericSearchInput
                type="date"
                id="orderDateFrom"
                ariaLabel="Fecha de orden desde"
                value={filters.orderDateFrom}
                onChange={(value: string) =>
                  handleSearch("orderDateFrom", value)
                }
              />
            </FlexComponent>
            <FlexComponent>
              <GenericSearchInput
                type="date"
                id="orderDateTo"
                ariaLabel="Fecha de orden hasta"
                value={filters.orderDateTo}
                onChange={(value: string) => handleSearch("orderDateTo", value)}
              />
            </FlexComponent>
          </GenericDiv>
          <GenericDiv>
            <FlexComponent>
              <GenericSearchInput
                type="number"
                placeholder="5"
                id="quantityPerCartonFrom"
                ariaLabel="Cantidad por caja desde"
                value={filters.quantityPerCartonFrom}
                onChange={(value: string) =>
                  handleSearch("quantityPerCartonFrom", value)
                }
              />
            </FlexComponent>
            <FlexComponent>
              <GenericSearchInput
                type="number"
                placeholder="20"
                id="quantityPerCartonTo"
                ariaLabel="Cantidad por caja hasta"
                value={filters.quantityPerCartonTo}
                onChange={(value: string) =>
                  handleSearch("quantityPerCartonTo", value)
                }
              />
            </FlexComponent>
          </GenericDiv>
        </GenericParentDiv>
        <GenericDiv>
          <GenericSearchInput
            type="text"
            placeholder="Buscar..."
            value={filters.q}
            onChange={(value: string) => handleSearch("q", value)}
          />
          <button
            type="button"
            onClick={clearFilters}
            className="bg-red-500 text-white text-sm p-2.5 w-full sm:w-1/3 border border-red-300 focus:ring-red-500 focus:border-red-500 dark:bg-red-500 dark:border-red-500 dark:text-white dark:focus:border-red-500"
          >
            Limpiar filtros
          </button>
        </GenericDiv>
      </div>
    </search>
  );
};

export default Searchbar;

const GenericParentDiv = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-col xl:flex-row gap-2">{children}</div>;
};

const GenericDiv = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col md:flex-row items-center w-full gap-2">
      {children}
    </div>
  );
};

const FlexComponent = ({ children }: { children: ReactNode }) => {
  return <div className="flex w-full items-center">{children}</div>;
};
