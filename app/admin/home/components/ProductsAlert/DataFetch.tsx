import { Card404 } from "@/components";
import { IProduct } from "@/interfaces";
import { getProducts } from "@/services/product/controller";
import clsx from "clsx";

const DataFetch = async () => {
  const products = (await getProducts({})) as unknown as IProduct[];

  const productsAtRisk = products.filter(
    (product) =>
      product.availableQuantity > 0 &&
      product.availableQuantity <= product.minimumAcceptableQuantity
  );
  const productsToReorder = products.filter(
    (product) => product.availableQuantity === 0
  );

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {productsAtRisk.length === 0 && productsToReorder.length === 0 ? (
        <div className="w-full">
          <Card404
            title="No hay productos en riesgo ni para reordenar"
            description="Todos los productos tienen suficiente cantidad en inventario."
          />
        </div>
      ) : (
        <>
          {productsToReorder.length > 0 && (
            <ProductAlertCard
              products={productsToReorder}
              isJustOne={productsAtRisk.length === 0}
            />
          )}
          {productsAtRisk.length > 0 && (
            <ProductAlertCard
              isAtRisk
              products={productsAtRisk}
              isJustOne={productsToReorder.length === 0}
            />
          )}
        </>
      )}
    </div>
  );
};

export default DataFetch;

const ProductAlertCard = ({
  products,
  isAtRisk,
  isJustOne,
}: {
  products: IProduct[];
  isAtRisk?: boolean;
  isJustOne?: boolean;
}) => {
  return (
    <div
      className={clsx(
        "w-full rounded-lg shadow border border-gray-200 dark:border-gray-500 flex flex-col items-center justify-center p-4 space-y-4 text-white",
        isAtRisk
          ? "bg-yellow-400 dark:bg-yellow-900"
          : "bg-red-400 dark:bg-red-900",
        !isJustOne && "md:w-1/2"
      )}
    >
      <h1 className="text-2xl font-black">
        {isAtRisk ? "Productos en riesgo" : "Productos para reordenar"}
      </h1>
      <ul className=" list-disc">
        {products.map((product) => (
          <li key={product.id}>
            {product.name}{" "}
            {isAtRisk && (
              <span className=" font-bold">
                ({product.availableQuantity}u disponible)
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
