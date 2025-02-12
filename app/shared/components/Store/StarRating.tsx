import { Star } from "@/app/shared/icons";

interface IStarRating {
  rating: number;
  totalReviews?: number;
  ratingsDistribution?: { [key: number]: number }; // Ejemplo: { 5: 500, 4: 100, 3: 50, 2: 20, 1: 7 }
}

const StarRating = ({
  rating,
  totalReviews,
  ratingsDistribution,
}: IStarRating) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);

  const totalVotes = ratingsDistribution
    ? Object.values(ratingsDistribution).reduce((acc, count) => acc + count, 0)
    : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {ratingsDistribution && <p className="text-5xl">{rating}</p>}
        <div className="flex" title={`${rating} de 5`}>
          {Array.from({ length: fullStars }).map((_, index) => (
            <Star
              key={index}
              customClass="text-primary"
              isFilled
              size="size-4 sm:size-6"
            />
          ))}
          {halfStar && <Star isHalf customClass="text-primary" />}
          {Array.from({ length: emptyStars }).map((_, index) => (
            <Star
              key={index}
              customClass="text-gray-400"
              size="size-4 sm:size-6"
            />
          ))}
        </div>
        {totalReviews && (
          <span
            className="text-sm text-gray-500 dark:text-gray-400"
            title={`${totalReviews} reseñas`}
          >
            (
            {new Intl.NumberFormat("en", { notation: "compact" }).format(
              totalReviews
            )}
            )
          </span>
        )}
      </div>
      {ratingsDistribution && (
        <div className="space-y-1">
          {Array.from({ length: totalStars }, (_, index) => {
            const starCount = totalStars - index; // 5, 4, 3, 2, 1
            const count = ratingsDistribution[starCount] || 0;
            const percentage = totalVotes
              ? Math.round((count / totalVotes) * 100)
              : 0;

            return (
              <div key={starCount} className="flex items-center gap-2">
                <div className="w-8 text-sm text-gray-600 dark:text-gray-400 flex justify-between gap-2">
                  <p>{starCount}</p>★
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded">
                  <div
                    className="bg-primary h-2 rounded"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StarRating;
