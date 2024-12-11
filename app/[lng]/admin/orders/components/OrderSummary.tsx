import formatCurrency from "@/app/shared/utils/format-currency";
import type { IProductInOrder } from "./Datatable";

interface IOrderSummary {
  order: {
    products: IProductInOrder[];
  };
}

const OrderSummary = ({ order }: IOrderSummary) => {
  return (
    <div className="p-4 text-center overflow-x-auto">
      <table className="truncate mx-auto">
        <thead>
          <tr>
            <th className="p-1 border-r border-r-black">Producto</th>
            <th className="p-1 border-r border-r-black">Cantidad</th>
            <th className="p-1 border-r border-r-black">Precio Unitario</th>
            <th className="p-1 border-r border-r-black">Subtotal</th>
            <th className="p-1 border-r border-r-black">Descuento</th>
            <th className="p-1">Total</th>
          </tr>
        </thead>
        <tbody className="border-t border-t-black">
          {order.products.map((product, index) => (
            <tr key={index}>
              <td className="p-1 border-r border-r-black">
                {product.product.name}
              </td>
              <td className="p-1 border-r border-r-black">
                {product.quantity}
              </td>
              <td className="p-1 border-r border-r-black">
                {formatCurrency(product.costMXN, "MXN")}
              </td>
              <td className="p-1 border-r border-r-black">
                {formatCurrency(product.costMXN * product.quantity, "MXN")}
              </td>
              <td className="p-1 border-r border-r-black">
                {product.discount}%
              </td>
              <td className="p-1">
                {formatCurrency(
                  product.costMXN *
                    product.quantity *
                    (1 - product.discount / 100),
                  "MXN"
                )}
              </td>
            </tr>
          ))}
          <tr className="border-t border-t-black">
            <td className="p-1 border-r border-r-black font-semibold">
              Totales
            </td>
            <td className="p-1 border-r border-r-black">
              <span className="font-semibold">
                {order.products.reduce(
                  (acc, product) => acc + product.quantity,
                  0
                )}
              </span>
            </td>
            <td className="p-1 border-r border-r-black">
              <span className="font-semibold">
                {formatCurrency(
                  order.products.reduce(
                    (acc, product) => acc + product.costMXN,
                    0
                  ),
                  "MXN"
                )}
              </span>
            </td>
            <td className="p-1 border-r border-r-black">
              <span className="font-semibold">
                {formatCurrency(
                  order.products.reduce(
                    (acc, product) => acc + product.costMXN * product.quantity,
                    0
                  ),
                  "MXN"
                )}
              </span>
            </td>
            <td className="p-1 border-r border-r-black">-</td>
            <td className="p-1">
              <span className="font-semibold">
                {formatCurrency(
                  order.products.reduce(
                    (acc, product) =>
                      acc +
                      product.costMXN *
                        product.quantity *
                        (1 - product.discount / 100),
                    0
                  ),
                  "MXN"
                )}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OrderSummary;
