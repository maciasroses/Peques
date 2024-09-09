"use client";

import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { IOrder } from "@/interfaces";
import formatCurrency from "@/utils/format-currency";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const processData = (data: IOrder[]) => {
  const groupedData: { [key: string]: { subtotal: number; total: number } } =
    data.reduce(
      (acc: { [key: string]: { subtotal: number; total: number } }, curr) => {
        const month = new Date(curr.createdAt).toLocaleString("es-ES", {
          month: "long",
          year: "numeric",
        });

        if (!acc[month]) {
          acc[month] = { subtotal: 0, total: 0 };
        }

        acc[month].subtotal += curr.subtotal;
        acc[month].total += curr.total;

        return acc;
      },
      {}
    );

  const labels = Object.keys(groupedData);
  const subtotals = labels.map((label) => groupedData[label].subtotal);
  const totals = labels.map((label) => groupedData[label].total);

  return { labels, subtotals, totals };
};

const LineChart = ({ sales }: { sales: IOrder[] }) => {
  const chartData = useMemo(() => processData(sales), [sales]);
  const chartConfig = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Subtotal",
        data: chartData.subtotals,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
      {
        label: "Total",
        data: chartData.totals,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
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
          label: (context: { dataset: { label: string }; raw: number }) => {
            const datasetLabel = context.dataset.label;
            const value = context.raw;
            return `${datasetLabel}: ${formatCurrency(value, "MXN")}`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full md:w-2/3 bg-black bg-opacity-5 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-500 flex flex-col justify-center gap-2">
      <h1 className="text-center text-2xl font-extrabold">Ventas por mes</h1>
      {/* @ts-ignore */}
      <Line data={chartConfig} options={options} />
      <p className="text-center text-lg">
        Ventas Esperadas:{" "}
        {formatCurrency(
          sales.reduce((acc, order) => acc + order.subtotal, 0),
          "MXN"
        )}
      </p>
      <p className="text-center text-xl font-bold">
        Ventas Reales:{" "}
        {formatCurrency(
          sales.reduce((acc, order) => acc + order.total, 0),
          "MXN"
        )}
      </p>
    </div>
  );
};

export default LineChart;
