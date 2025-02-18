"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

interface ISuggestion {
  label: string;
  value: string;
}

interface IAutocompleteInput {
  id: string;
  ariaLabel: string;
  labelCustomClassName?: string;
  placeholder: string;
  defaultValue?: string;
  error?: string;
  additionOnChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  suggestions: ISuggestion[];
  customClassName?: string;
}

const AutocompleteInput: React.FC<IAutocompleteInput> = ({
  id,
  ariaLabel,
  labelCustomClassName = "",
  placeholder,
  defaultValue,
  error,
  additionOnChange,
  suggestions,
  customClassName = "",
}) => {
  const wrapperRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<ISuggestion[]>(
    []
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        wrapperRef.current &&
        !(wrapperRef.current as HTMLElement).contains(event.target as Node)
      ) {
        if (
          !suggestions.some((suggestion) => suggestion.value === inputValue)
        ) {
          setInputValue("");
        }
        setFilteredSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [inputValue, suggestions]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setInputValue(value);

    const filtered = suggestions.filter((suggestion) =>
      suggestion.label.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSuggestions(filtered);
  };

  const handleSelect = (suggestion: ISuggestion) => {
    setInputValue(suggestion.value);
    setFilteredSuggestions([]);
    if (additionOnChange) {
      const event = {
        target: {
          value: suggestion.value,
        },
      } as React.ChangeEvent<HTMLInputElement>;
      additionOnChange(event);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label htmlFor={id} className={labelCustomClassName}>
        {ariaLabel}
      </label>
      <input
        id={id}
        name={id}
        type="text"
        value={inputValue}
        aria-label={ariaLabel}
        onChange={handleChange}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={clsx(
          "border w-full p-2.5 text-sm rounded-lg",
          customClassName,
          error
            ? "bg-[#F2AFAF] border-[#E38787] text-red-600 placeholder-red-500 focus:ring-[#E38787] focus:border-[#E38787]"
            : "bg-white border-neutral-dark text-neutral-dark placeholder-neutral focus:ring-accent focus:border-accent"
        )}
      />
      {filteredSuggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 max-h-40 overflow-y-auto bg-white border border-neutral-dark rounded-lg shadow-lg">
          {filteredSuggestions.map((suggestion) => (
            <li
              key={suggestion.value}
              onClick={() => handleSelect(suggestion)}
              className="p-2.5 cursor-pointer hover:bg-neutral-light"
            >
              {suggestion.label}
            </li>
          ))}
        </ul>
      )}
      {error && <small className="text-red-600">{error}</small>}
    </div>
  );
};

export default AutocompleteInput;
