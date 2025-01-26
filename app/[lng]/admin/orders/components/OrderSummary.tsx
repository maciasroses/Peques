import formatCurrency from "@/app/shared/utils/format-currency";
import type { IProductInOrder } from "./Datatable";
import { roundUpNumber } from "@/app/shared/utils/roundUpNumber";

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
            <th className="p-1 border-r border-r-black">Personalización</th>
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
                {product.customRequest ? (
                  <div className="flex flex-col gap-0">
                    <div>
                      <span className="font-semibold">Nombre:</span>{" "}
                      {JSON.parse(product.customRequest).name}
                    </div>
                    <div>
                      <span className="font-semibold">Fuente:</span>{" "}
                      {JSON.parse(product.customRequest).font}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Color:</span>
                      <div
                        className="w-4 h-4 inline-block"
                        style={{
                          backgroundColor: JSON.parse(product.customRequest)
                            .color,
                          border: "1px solid black",
                        }}
                      />
                      {`(${JSON.parse(product.customRequest).color})`}
                    </div>
                  </div>
                ) : (
                  "-"
                )}
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
                  roundUpNumber(
                    product.costMXN *
                      product.quantity *
                      (1 - product.discount / 100)
                  ),
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
                  roundUpNumber(
                    order.products.reduce(
                      (acc, product) =>
                        acc +
                        product.costMXN *
                          product.quantity *
                          (1 - product.discount / 100),
                      0
                    )
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
