import clsx from "clsx";

interface IGenericInput {
  id: string;
  ariaLabel: string;
  type: string;
  step?: string;
  rows?: number;
  options?: { value: string; label: string }[];
  defaultValue?: string;
  defaultChecked?: boolean;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  error?: string;
  onChange?: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

const GenericInput: React.FC<IGenericInput> = ({
  id,
  ariaLabel,
  type,
  step,
  rows = 3,
  options,
  defaultValue,
  defaultChecked,
  placeholder,
  className = "",
  labelClassName = "",
  error,
  onChange,
}) => {
  const commonProps = {
    id,
    name: id,
    onChange,
    defaultValue,
    "aria-label": ariaLabel,
    className: clsx(
      "border w-full p-2.5 text-sm rounded-lg",
      className,
      error
        ? "bg-[#F2AFAF] border-[#E38787] text-red-600 placeholder-red-500 focus:ring-[#E38787] focus:border-[#E38787] dark:bg-red-900 dark:bg-opacity-25 dark:text-red-400 dark:placeholder-red-500 dark:focus:ring-red-400 dark:focus:border-red-400"
        : "bg-white dark:bg-neutral-light border-neutral-dark text-neutral-dark dark:text-primary-light placeholder-neutral dark:placeholder-primary-light focus:ring-accent focus:border-accent dark:focus:ring-primary-light dark:focus:border-primary-light"
    ),
  };

  return (
    <>
      <label htmlFor={id} className={labelClassName}>
        {ariaLabel}
      </label>
      {type === "textarea" ? (
        <textarea placeholder={placeholder} rows={rows} {...commonProps} />
      ) : type === "select" && options ? (
        <select {...commonProps}>
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          placeholder={placeholder}
          type={type}
          step={step}
          defaultChecked={defaultChecked}
          {...commonProps}
        />
      )}
      {error && <small className="text-red-600">{error}</small>}
    </>
  );
};

export default GenericInput;
