"use client";

import { useSearchFilter } from "@/app/shared/hooks";
import { GenericSearchInput } from "@/app/shared/components";

const Searchbar = () => {
  const defaultFilters = { q: "" };

  const { filters, handleSearch } = useSearchFilter(defaultFilters);

  return (
    <search className="max-w-lg mx-auto mt-6 mb-4">
      <div className="flex flex-col md:flex-row">
        <GenericSearchInput
          type="text"
          placeholder="Busca por título o descripción..."
          value={filters.q}
          onChange={(value: string) => handleSearch("q", value)}
        />
      </div>
    </search>
  );
};

export default Searchbar;
