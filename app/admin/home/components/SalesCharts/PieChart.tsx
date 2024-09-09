"use client";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { IOrder } from "@/interfaces";
import { COLORS_FOR_CHARTS } from "@/constants";
import formatCurrency from "@/utils/format-currency";

ChartJS.register(ArcElement, Tooltip, Legend);

interface IProductInOrder {
  productId: string;
  orderId: string;
  quantity: number;
  costMXN: number;
  product: {
    name: string;
  };
}

const processData = (orders: IOrder[]) => {
  const productTotals: { [key: string]: { total: number } } = {};
  let grandTotal = 0;

  orders.forEach((order) => {
    grandTotal += order.total; // Sumamos el total general
    (order.products as unknown as IProductInOrder[]).forEach((product) => {
      const productName = product.product.name;
      if (!productTotals[productName]) {
        productTotals[productName] = { total: 0 };
      }
      productTotals[productName].total +=
        product.costMXN - (product.costMXN * order.discount!) / 100;
    });
  });

  const productData = Object.keys(productTotals).map((productName) => {
    const costSum = productTotals[productName].total;
    return {
      product: productName,
      percentage: (costSum / grandTotal) * 100,
    };
  });

  return productData;
};

const PieChart = ({ sales }: { sales: IOrder[] }) => {
  const processedData = processData(sales);
  const data = {
    labels: processedData
      .filter((product) => product.percentage > 0)
      .map((product) => product.product),
    datasets: [
      {
        label: "Ventas por producto",
        data: processedData
          .filter((product) => product.percentage > 0)
          .map((product) => product.percentage),
        backgroundColor: processedData.map(
          () =>
            COLORS_FOR_CHARTS[
              Math.floor(Math.random() * COLORS_FOR_CHARTS.length)
            ]
        ),
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: { parsed: number }) => {
            const value = context.parsed || 0;
            return `${value.toFixed(2)}% | ${formatCurrency(
              (value * sales.reduce((acc, order) => acc + order.total, 0)) /
                100,
              "MXN"
            )}`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full md:w-1/3 bg-black bg-opacity-5 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-500 flex flex-col justify-center gap-2">
      <h1 className="text-center text-2xl font-extrabold">
        Ventas por producto
      </h1>
      <Pie data={data} options={options} />
      <p className="text-center text-xl font-bold">
        Total:{" "}
        {formatCurrency(
          sales.reduce((acc, order) => acc + order.total, 0),
          "MXN"
        )}
      </p>
    </div>
  );
};

export default PieChart;
