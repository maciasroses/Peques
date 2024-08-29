"use client";

import clsx from "clsx";
import Loading from "../Loading";

const colorMap: { [key: string]: string } = {
  red: "bg-red-500 hover:bg-red-600 focus:ring-red-500",
  blue: "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500",
  green: "bg-green-500 hover:bg-green-600 focus:ring-green-500",

  primary: "bg-primary hover:bg-primary-dark focus:ring-primary",
  accent: "bg-accent hover:bg-accent-dark focus:ring-accent",
};

interface ISubmitButton {
  title: string;
  pending: boolean;
  color?: string;
}

const SubmitButton: React.FC<ISubmitButton> = ({
  title,
  pending,
  color = "blue",
}) => {
  return (
    <button
      type="submit"
      disabled={pending}
      className={clsx(
        "px-4 py-2 text-white rounded-md w-auto transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2",
        pending ? `${colorMap[color]}/50` : colorMap[color]
      )}
    >
      {pending ? <Loading color={color} /> : title}
    </button>
  );
};

export default SubmitButton;
