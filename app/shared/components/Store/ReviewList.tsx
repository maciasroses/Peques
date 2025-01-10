import { ReviewCard } from "@/app/shared/components";
import type { IProduct } from "@/app/shared/interfaces";

interface IReviewList {
  lng: string;
  title: string;
  products: IProduct[];
}

const ReviewList = ({ lng, title, products }: IReviewList) => {
  if (products.length === 0) return null;
  return (
    <section>
      <h1 className="text-2xl sm:text-4xl md:text-6xl text-center mb-2 md:mb-4">
        {title}
      </h1>
      <ul className="flex pr-10 overflow-x-auto items-start w-full max-w-min mx-auto">
        {products.map((product, index) => (
          <li
            key={index}
            className="min-w-[150px] h-[350px] md:min-w-[250px] md:h-[450px] ml-10"
          >
            <ReviewCard lng={lng} product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ReviewList;
