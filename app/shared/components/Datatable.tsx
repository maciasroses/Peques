"use client";

import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useResolvedTheme } from "@/app/shared/hooks";
import type {
  TableStyles,
  ConditionalStyles,
  ExpanderComponentProps,
} from "react-data-table-component";

const customStyles = (theme: string): TableStyles => {
  return {
    headRow: {
      style: {
        backgroundColor: "#EADA88",
        color: "#000000",
      },
    },
    rows: {
      style: {
        backgroundColor: "#F7EDE6",
        color: "#000000",
      },
    },
    pagination: {
      style: {
        backgroundColor: "#EADA88",
        color: "#000000",
      },
      pageButtonsStyle: {
        fill: "#778586",
        "&:hover:not(:disabled)": {
          fill: "#000000",
        },
      },
    },
  };
};

const Datatable = <T extends object>({
  data,
  columns,
  isExapandable = false,
  expandableRowsComponent,
  onSelectedRowsChange,
  conditionalRowStyles,
}: {
  data: T[];
  columns: object[];
  isExapandable?: boolean;
  expandableRowsComponent?: React.FC<ExpanderComponentProps<T>>;
  onSelectedRowsChange?: (selected: { selectedRows: T[] }) => void;
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

  const paginationComponentOptions = {
    rowsPerPageText: "Filas por página:",
    rangeSeparatorText: "de",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todo",
  };

  return (
    <DataTable
      columns={columns}
      data={data}
      pagination
      paginationComponentOptions={paginationComponentOptions}
      fixedHeader
      fixedHeaderScrollHeight={scrollHeight}
      selectableRows={onSelectedRowsChange ? true : false}
      onSelectedRowsChange={onSelectedRowsChange}
      expandableRows={isExapandable}
      expandableRowsComponent={expandableRowsComponent}
      conditionalRowStyles={conditionalRowStyles && conditionalRowStyles(theme)}
      customStyles={customStyles(theme)}
    />
  );
};

export default Datatable;
