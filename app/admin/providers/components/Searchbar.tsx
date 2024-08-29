"use client";

import { useSearchFilter } from "@/hooks";
import { GenericSearchInput } from "@/components";

const Searchbar = () => {
  const defaultFilters = { q: "" };

  const { filters, handleSearch } = useSearchFilter(defaultFilters);

  return (
    <search className="max-w-lg mx-auto mt-6">
      <div className="flex flex-col md:flex-row">
        <GenericSearchInput
          type="text"
          placeholder="Buscar..."
          value={filters.q}
          onChange={(value: string) => handleSearch("q", value)}
        />
      </div>
    </search>
  );
};

export default Searchbar;
