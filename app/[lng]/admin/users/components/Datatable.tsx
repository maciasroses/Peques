"use client";

import EmailEditor from "./EmailEditor";
import { cn } from "@/app/shared/utils/cn";
import { Email } from "@/app/shared/icons";
import { useEffect, useState } from "react";
import { useModal, useRowSelection } from "@/app/shared/hooks";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import {
  Modal,
  Card404,
  DatatableSkeleton,
  Datatable as CustomDatatable,
} from "@/app/shared/components";
import type { IUser } from "@/app/shared/interfaces";

const Datatable = ({ users }: { users: IUser[] }) => {
  const { isOpen, onClose, onOpen } = useModal();
  const [isClient, setIsClient] = useState(false);
  const { selectedRows, handleSelectRows, showMultiActions } =
    useRowSelection<IUser>();

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
      selector: (row: { createdAt: Date }) => row.createdAt,
      sortable: true,
      format: (row: { createdAt: Date }) =>
        formatDateLatinAmerican(row.createdAt),
    },
    {
      name: "Actualizado en",
      selector: (row: { updatedAt: Date }) => row.updatedAt,
      sortable: true,
      format: (row: { updatedAt: Date }) =>
        formatDateLatinAmerican(row.updatedAt),
    },
  ];

  // react-hydration-error SOLUTION
  useEffect(() => {
    setIsClient(true);
  }, []);
  // react-hydration-error SOLUTION

  return (
    <>
      {users.length > 0 ? (
        <>
          {isClient ? (
            <>
              <Modal isOpen={isOpen} onClose={onClose}>
                <EmailEditor
                  onClose={() => onClose()}
                  emailUsers={selectedRows.map((row) => row.email)}
                />
              </Modal>
              {showMultiActions && (
                <div className="flex justify-end gap-2 mb-4">
                  <button
                    onClick={onOpen}
                    disabled={selectedRows.some(
                      (row) => row.wantsNewsletter === false
                    )}
                    className={cn(
                      selectedRows.some(
                        (row) => row.wantsNewsletter === false
                      ) && "cursor-not-allowed text-gray-500"
                    )}
                  >
                    <Email size="size-8" />
                  </button>
                </div>
              )}
              <CustomDatatable
                data={users}
                columns={columns}
                onSelectedRowsChange={handleSelectRows}
              />
            </>
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
