"use client";

import { ReactNode } from "react";
import { useSearchFilter } from "@/app/shared/hooks";
import { GenericSearchInput } from "@/app/shared/components";

const Searchbar = () => {
  const defaultFilters = {
    client: "",
    deliveryStatus: "",
    paymentMethod: "",
    discountFrom: "",
    discountTo: "",
    subtotalFrom: "",
    subtotalTo: "",
    totalFrom: "",
    totalTo: "",
  };

  const { filters, handleSearch, clearFilters } =
    useSearchFilter(defaultFilters);

  return (
    <search className="min-w-full mx-auto mt-6 mb-4">
      <div className="flex flex-col gap-2">
        <GenericDiv>
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
              onChange={(value: string) =>
                handleSearch("deliveryStatus", value)
              }
            />
          </FlexComponent>
          <FlexComponent>
            <GenericSearchInput
              type="text"
              ariaLabel="Método de pago"
              id="paymentMethod"
              value={filters.paymentMethod}
              placeholder="Buscar por método de pago..."
              onChange={(value: string) => handleSearch("paymentMethod", value)}
            />
          </FlexComponent>
        </GenericDiv>
        <GenericDiv>
          <FlexComponent>
            <GenericSearchInput
              type="number"
              id="discountFrom"
              placeholder="15"
              ariaLabel="Descuento desde"
              value={filters.discountFrom}
              onChange={(value: string) => handleSearch("discountFrom", value)}
            />
          </FlexComponent>
          <FlexComponent>
            <GenericSearchInput
              type="number"
              id="discountTo"
              placeholder="50"
              ariaLabel="Descuento hasta"
              value={filters.discountTo}
              onChange={(value: string) => handleSearch("discountTo", value)}
            />
          </FlexComponent>
        </GenericDiv>
        <GenericDiv>
          <FlexComponent>
            <GenericSearchInput
              type="number"
              id="subtotalFrom"
              placeholder="100"
              ariaLabel="Subtotal desde"
              value={filters.subtotalFrom}
              onChange={(value: string) => handleSearch("subtotalFrom", value)}
            />
          </FlexComponent>
          <FlexComponent>
            <GenericSearchInput
              type="number"
              id="subtotalTo"
              placeholder="500"
              ariaLabel="Subtotal hasta"
              value={filters.subtotalTo}
              onChange={(value: string) => handleSearch("subtotalTo", value)}
            />
          </FlexComponent>
        </GenericDiv>
        <GenericDiv>
          <FlexComponent>
            <GenericSearchInput
              type="number"
              id="totalFrom"
              placeholder="250"
              ariaLabel="Total desde"
              value={filters.totalFrom}
              onChange={(value: string) => handleSearch("totalFrom", value)}
            />
          </FlexComponent>
          <FlexComponent>
            <GenericSearchInput
              type="number"
              id="totalTo"
              placeholder="900"
              ariaLabel="Total hasta"
              value={filters.totalTo}
              onChange={(value: string) => handleSearch("totalTo", value)}
            />
          </FlexComponent>
        </GenericDiv>
        <GenericDiv>
          <FlexComponent>
            <GenericSearchInput
              type="text"
              value={filters.client}
              placeholder="Buscar por cliente..."
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
