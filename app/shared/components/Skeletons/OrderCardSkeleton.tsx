import { randomInt } from "crypto";

const OrderCardSkeleton = () => {
  return (
    <div
      role="status"
      className="p-4 border border-gray-200 rounded shadow animate-pulse md:p-6"
    >
      <div className="flex justify-between mb-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="h-2.5 w-64 bg-gray-200 rounded-full"
          ></div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
        {Array.from({ length: randomInt(1, 3) }).map((_, index) => (
          <div key={index} className="flex items-center">
            <svg
              className="w-20 h-20 text-gray-200"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 20"
            >
              <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
              <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
            </svg>
            <div>
              <div className="h-2.5 w-28 bg-gray-200 rounded-full mb-2"></div>
              <div className="h-2.5 w-14 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full flex justify-end mt-4">
        <div className="h-2 w-20 bg-gray-200 rounded-full"></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default OrderCardSkeleton;
