"use client";

import { useEffect, useState } from "react";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import {
  Card404,
  DatatableSkeleton,
  Datatable as CustomDatatable,
} from "@/app/shared/components";
import type { IUser } from "@/app/shared/interfaces";

const columns = [
  {
    name: "Nombre de usuario",
    maxwidth: "200px",
    selector: (row: { username: string }) => row.username,
    sortable: true,
    cell: (row: { username: string }) => row.username,
  },
  {
    name: "Correo electrónico",
    maxwidth: "200px",
    selector: (row: { email: string }) => row.email,
    sortable: true,
    cell: (row: { email: string }) => row.email,
  },
  {
    name: "Nombre(s)",
    maxwidth: "200px",
    selector: (row: { firstName: string }) => row.firstName,
    sortable: true,
    cell: (row: { firstName: string }) => row.firstName,
  },
  {
    name: "Apellido(s)",
    maxwidth: "200px",
    selector: (row: { lastName: string }) => row.lastName,
    sortable: true,
    cell: (row: { lastName: string }) => row.lastName,
  },
  {
    name: "¿Quiere recibir boletín?",
    selector: (row: { wantsNewsletter: boolean }) => row.wantsNewsletter,
    sortable: true,
    cell: (row: { wantsNewsletter: boolean }) =>
      row.wantsNewsletter ? "Sí" : "No",
  },
  {
    name: "Creado en",
    selector: (row: { createdAt: Date }) => row.createdAt.toString(),
    sortable: true,
    format: (row: { createdAt: Date }) =>
      formatDateLatinAmerican(row.createdAt),
  },
  {
    name: "Actualizado en",
    selector: (row: { updatedAt: Date }) => row.updatedAt.toString(),
    sortable: true,
    format: (row: { updatedAt: Date }) =>
      formatDateLatinAmerican(row.updatedAt),
  },
];

const Datatable = ({ users }: { users: IUser[] }) => {
  // react-hydration-error SOLUTION
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  // react-hydration-error SOLUTION

  return (
    <>
      {users.length > 0 ? (
        <>
          {isClient ? (
            <CustomDatatable columns={columns} data={users} />
          ) : (
            <DatatableSkeleton />
          )}
        </>
      ) : (
        <Card404
          title="No se encontraron usuarios"
          description="No se encontraron usuarios con los filtros aplicados"
        />
      )}
    </>
  );
};

export default Datatable;
