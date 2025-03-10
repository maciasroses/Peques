import { cn } from "@/app/shared/utils/cn";
import type { IGenericIcon } from "@/app/shared/interfaces";

interface IStar extends IGenericIcon {
  isHalf?: boolean;
}

const Star = ({
  isHalf = false,
  size = "size-6",
  isFilled = false,
  customClass = "",
  strokeWidth = 1.5,
}: IStar) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={isFilled ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className={cn(size, customClass)}
    >
      {isHalf ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3.5l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L12 3.5Z"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
        />
      )}
    </svg>
  );
};

export default Star;
