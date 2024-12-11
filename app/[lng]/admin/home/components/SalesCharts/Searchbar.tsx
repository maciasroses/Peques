"use client";

import { useSearchFilter } from "@/app/shared/hooks";
import { GenericSearchInput } from "@/app/shared/components";

const Searchbar = () => {
  const defaultFilters = {
    yearOfData: "",
  };

  const { filters, handleSearch } = useSearchFilter(defaultFilters);

  return (
    <search className="w-full mt-6 mb-4 text-right">
      <div className="flex items-center gap-2">
        <GenericSearchInput
          type="number"
          step="1"
          min="2000"
          max="9999"
          placeholder={new Date().getFullYear().toString()}
          id="yearOfData"
          value={filters.yearOfData}
          ariaLabel="Año de los datos"
          inputClassName="w-20"
          onChange={(value: string) => handleSearch("yearOfData", value)}
        />
      </div>
    </search>
  );
};

export default Searchbar;
