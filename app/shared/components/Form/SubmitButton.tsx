"use client";

import clsx from "clsx";
import Loading from "@/app/shared/components/Loading";

const colorMap: { [key: string]: string } = {
  red: "bg-red-500 hover:bg-red-600 focus:ring-red-500",
  blue: "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500",
  green: "bg-green-500 hover:bg-green-600 focus:ring-green-500",

  primary:
    "text-gray-600 hover:text-white bg-primary hover:bg-primary-dark border-gray-600 hover:border-white",
  accent: "bg-accent hover:bg-accent-dark focus:ring-accent",
};

interface ISubmitButton {
  title: string;
  pending: boolean;
  color?: string;
  finish?: boolean;
}

const SubmitButton: React.FC<ISubmitButton> = ({
  title,
  pending,
  finish,
  color = "blue",
}) => {
  return (
    <button
      type="submit"
      disabled={pending || finish}
      className={clsx(
        "px-4 py-2 rounded-md w-auto transition-colors duration-300 border",
        pending ? `${colorMap[color]}/50` : colorMap[color]
      )}
    >
      {pending ? <Loading color={color} /> : title}
    </button>
  );
};

export default SubmitButton;
