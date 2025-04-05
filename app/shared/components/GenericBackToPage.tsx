import Link from "next/link";
import { cn } from "@/app/shared/utils/cn";

interface IGenericBackToPage {
  link: string;
  title: string;
  linkText: string;
  description: string;
  isWithMDExtraPadding?: boolean;
}

const GenericBackToPage = ({
  link,
  title,
  linkText,
  description,
  isWithMDExtraPadding,
}: IGenericBackToPage) => {
  return (
    <section
      className={cn(
        "flex flex-col h-screen items-center justify-center px-4 pb-4 text-center",
        isWithMDExtraPadding ? "pt-40 md:pt-40" : "pt-40"
      )}
    >
      <h1 className="text-xl md:text-3xl font-bold">{title}</h1>
      <p className="text-gray-500 text-base md:text-lg">{description}</p>
      <Link
        href={link}
        className="bg-accent hover:bg-accent-dark focus:ring-accent rounded-lg text-base md:text-lg mt-4 px-4 py-2"
      >
        {linkText}
      </Link>
    </section>
  );
};

export default GenericBackToPage;
