import { Star } from "@/app/shared/icons";

interface IStarRating {
  rating: number;
  totalReviews?: number;
}

const StarRating = ({ rating, totalReviews }: IStarRating) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-2">
      <div className="flex" title={`${rating} de 5`}>
        {Array.from({ length: fullStars }).map((_, index) => (
          <Star key={index} customClass="text-yellow-500" isFilled />
        ))}
        {halfStar && <Star isHalf customClass="text-yellow-500" />}
        {Array.from({ length: emptyStars }).map((_, index) => (
          <Star key={index} customClass="text-gray-400" />
        ))}
      </div>
      {totalReviews && (
        <span
          className="text-sm text-gray-500 dark:text-gray-400"
          title={`${totalReviews} reseñas`}
        >
          ({totalReviews})
        </span>
      )}
    </div>
  );
};

export default StarRating;
