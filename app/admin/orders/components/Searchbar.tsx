"use client";

import { ReactNode } from "react";
import { useSearchFilter } from "@/hooks";
import { GenericSearchInput } from "@/components";

const Searchbar = () => {
  const defaultFilters = {
    client: "",
    deliveryStatus: "",
  };

  const { filters, handleSearch, clearFilters } =
    useSearchFilter(defaultFilters);

  return (
    <search className="min-w-full mx-auto mt-6 mb-4">
      <div className="flex flex-col gap-2">
        <FlexComponent>
          <GenericSearchInput
            type="select"
            id="deliveryStatus"
            value={filters.deliveryStatus}
            placeholder="Todos"
            ariaLabel="Estado de entrega"
            options={[
              { value: "PENDING", label: "Pendiente" },
              { value: "DELIVERED", label: "Entregado" },
              { value: "CANCELLED", label: "Cancelado" },
            ]}
            onChange={(value: string) => handleSearch("deliveryStatus", value)}
          />
        </FlexComponent>
        <GenericDiv>
          <FlexComponent>
            <GenericSearchInput
              type="text"
              value={filters.client}
              placeholder="Buscar por cliente"
              onChange={(value: string) => handleSearch("client", value)}
            />
          </FlexComponent>
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
