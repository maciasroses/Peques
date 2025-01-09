import Link from "next/link";
import Image from "next/image";
import { StarRating } from "@/app/shared/components";
import type { IProduct } from "@/app/shared/interfaces";

interface IReviewCard {
  lng: string;
  product: IProduct;
}

const ReviewCard = ({ lng, product }: IReviewCard) => {
  return (
    <div className="w-full h-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <Link href={`/${lng}/${product.key}`}>
        <Image
          width={500}
          height={300}
          alt={product.name}
          className="size-auto rounded-t-lg"
          src={product.files[0]?.url || "/assets/images/profilepic.webp"}
        />
        <div className="flex flex-col gap-2 items-center p-5">
          <StarRating rating={product.reviews[0].rating} />
          <p
            className="text-lg md:text-2xl font-bold mt-2 text-center line-clamp-1"
            title={
              product.reviews[0].user.firstName ||
              product.reviews[0].user.lastName
                ? `${product.reviews[0].user.firstName} ${product.reviews[0].user.lastName}`
                : product.reviews[0].user.username
            }
          >
            {product.reviews[0].user.firstName ||
            product.reviews[0].user.lastName
              ? `${product.reviews[0].user.firstName} ${product.reviews[0].user.lastName}`
              : product.reviews[0].user.username}
          </p>
          <p className="line-clamp-3" title={product.reviews[0].content!}>
            {product.reviews[0].content}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ReviewCard;
