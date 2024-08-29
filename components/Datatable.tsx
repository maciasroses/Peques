"use client";

import { useResolvedTheme } from "@/hooks";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import type {
  TableStyles,
  ConditionalStyles,
} from "react-data-table-component";

const customStyles = (theme: string): TableStyles => {
  return {
    headRow: {
      style: {
        backgroundColor: theme === "dark" ? "#AEB898" : "#EADA88",
        color: "#000000",
      },
    },
    rows: {
      style: {
        backgroundColor: theme === "dark" ? "#D2D8C0" : "#AEB898",
        color: theme === "dark" ? "#000000" : "#F7EDE6",
      },
    },
    pagination: {
      style: {
        backgroundColor: theme === "dark" ? "#8C9E8C" : "#EADA88",
        color: theme === "dark" ? "#F7EDE6" : "#000000",
      },
      pageButtonsStyle: {
        fill: theme === "dark" ? "#D2D8C0" : "#778586",
        "&:hover:not(:disabled)": {
          fill: theme === "dark" ? "#F7EDE6" : "#000000",
        },
      },
    },
  };
};

const Datatable = <T extends object>({
  columns,
  data,
  onSelectedRowsChange,
  conditionalRowStyles,
}: {
  columns: object[];
  data: T[];
  onSelectedRowsChange: (selected: { selectedRows: T[] }) => void;
  conditionalRowStyles?: (theme: string) => ConditionalStyles<T>[];
}) => {
  const [scrollHeight, setScrollHeight] = useState("75vh");
  const theme = useResolvedTheme();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerHeight < 768) {
        if (window.innerWidth > 600) {
          setScrollHeight("48vh");
        } else {
          setScrollHeight("70vh");
        }
      } else {
        setScrollHeight("75vh");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <DataTable
      columns={columns}
      data={data}
      pagination
      fixedHeader
      fixedHeaderScrollHeight={scrollHeight}
      selectableRows
      onSelectedRowsChange={onSelectedRowsChange}
      conditionalRowStyles={conditionalRowStyles && conditionalRowStyles(theme)}
      customStyles={customStyles(theme)}
    />
  );
};

export default Datatable;
