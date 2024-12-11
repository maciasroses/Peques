"use client";

import { ReactNode } from "react";
import { useSearchFilter } from "@/app/shared/hooks";
import { GenericSearchInput } from "@/app/shared/components";
import { IProvider } from "@/app/shared/interfaces";

const Searchbar = ({ providers }: { providers: IProvider[] }) => {
  const defaultFilters = {
    q: "",
    availableQuantityFrom: "",
    availableQuantityTo: "",
    salePriceMXNFrom: "",
    salePriceMXNTo: "",
    provider: "",
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
                type="number"
                step="1"
                id="availableQuantityFrom"
                placeholder="5"
                ariaLabel="Cantidad desde"
                value={filters.availableQuantityFrom}
                onChange={(value: string) =>
                  handleSearch("availableQuantityFrom", value)
                }
              />
            </FlexComponent>
            <FlexComponent>
              <GenericSearchInput
                type="number"
                step="1"
                id="availableQuantityTo"
                placeholder="20"
                ariaLabel="Cantidad hasta"
                value={filters.availableQuantityTo}
                onChange={(value: string) =>
                  handleSearch("availableQuantityTo", value)
                }
              />
            </FlexComponent>
          </GenericDiv>
          <GenericDiv>
            <FlexComponent>
              <GenericSearchInput
                type="number"
                placeholder="100"
                id="salePriceMXNFrom"
                ariaLabel="Precio desde"
                value={filters.salePriceMXNFrom}
                onChange={(value: string) =>
                  handleSearch("salePriceMXNFrom", value)
                }
              />
            </FlexComponent>
            <FlexComponent>
              <GenericSearchInput
                type="number"
                placeholder="500"
                id="salePriceMXNTo"
                ariaLabel="Precio hasta"
                value={filters.salePriceMXNTo}
                onChange={(value: string) =>
                  handleSearch("salePriceMXNTo", value)
                }
              />
            </FlexComponent>
          </GenericDiv>
        </GenericParentDiv>
        <GenericDiv>
          <GenericSearchInput
            type="select"
            placeholder="Selecciona un proveedor"
            value={filters.provider}
            onChange={(value: string) => handleSearch("provider", value)}
            options={providers?.map((provider) => ({
              label: provider.name,
              value: provider.alias,
            }))}
          />
          <GenericSearchInput
            type="text"
            placeholder="Busca por nombre o clave..."
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
