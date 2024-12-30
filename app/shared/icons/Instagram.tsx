import { cn } from "@/app/shared/utils/cn";
import type { IGenericIcon } from "@/app/shared/interfaces";

const Instagram = ({
  size = "size-6",
  customClass = "",
  strokeWidth = 1.5,
}: IGenericIcon) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(size, customClass)}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37a4 4 0 1 1-4.63-4.63 4 4 0 0 1 4.63 4.63z"></path>
      <line x1="17.5" y1="6.5" x2="17.5" y2="6.5"></line>
    </svg>
  );
};

export default Instagram;
