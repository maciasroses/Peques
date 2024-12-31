"use client";

import { useSearchFilter } from "@/app/shared/hooks";
import { GenericSearchInput } from "@/app/shared/components";

const Searchbar = () => {
  const defaultFilters = { q: "", wantsNewsletter: "" };

  const { filters, handleSearch } = useSearchFilter(defaultFilters);

  return (
    <search className="max-w-lg mx-auto mt-6 mb-4">
      <div className="inline-flex items-center w-auto gap-2 mb-2">
        <GenericSearchInput
          type="checkbox"
          id="wantsNewsletter"
          ariaLabel="¿Quiere recibir boletín?"
          value={filters.wantsNewsletter}
          onChange={(value: string) => handleSearch("wantsNewsletter", value)}
          inputClassName="size-4"
        />
      </div>
      <div className="flex flex-col md:flex-row">
        <GenericSearchInput
          type="text"
          placeholder="Busca por nombre de usuario, nombres, apellidos o email..."
          value={filters.q}
          onChange={(value: string) => handleSearch("q", value)}
        />
      </div>
    </search>
  );
};

export default Searchbar;
