"use client";

import { ReactNode, useState } from "react";

import { cn } from "@/app/shared/utils/cn";
import { GenericInput, Toast } from "@/app/shared/components";
import { PencilIcon, Check, XMark } from "@/app/shared/icons";
import { useAuth, useResolvedTheme } from "@/app/shared/hooks";
import { INITIAL_STATE_RESPONSE } from "@/app/shared/constants";
import { updateMyMainInfo } from "@/app/shared/services/user/controller";
import type { IUpdateMyMainInfo } from "@/app/shared/interfaces";

const Form = ({ lng }: { lng: string }) => {
  const { user } = useAuth();
  const theme = useResolvedTheme();
  const [isPending, setIsPending] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [badResponse, setBadResponse] = useState<IUpdateMyMainInfo>(
    INITIAL_STATE_RESPONSE
  );

  const submitAction: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    setIsPending(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await updateMyMainInfo(formData);
    if (res && !res.success) {
      setBadResponse(res);
    } else {
      Toast({
        theme,
        type: "success",
        message:
          lng === "en"
            ? "User updated successfully"
            : "Usuario actualizado con éxito",
      });
      handleEdit();
    }
    setIsPending(false);
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
    setBadResponse(INITIAL_STATE_RESPONSE);
  };

  return (
    <>
      {isEditing ? (
        <>
          <form onSubmit={submitAction}>
            <fieldset disabled={isPending}>
              <CustomBtn icon={<Check />} isEditing={isEditing} />
              <CustomBtn icon={<XMark />} isCancelAction onClick={handleEdit} />
              <div className="flex flex-col gap-2">
                <GenericInput
                  type="text"
                  id="username"
                  ariaLabel="Nombre de usuario"
                  placeholder="user123"
                  defaultValue={user?.username}
                  error={badResponse.errors?.username}
                />
                <GenericInput
                  type="email"
                  id="email"
                  ariaLabel="Correo electrónico"
                  placeholder="user@mail.com"
                  defaultValue={user?.email}
                  error={badResponse.errors?.email}
                />
                <GenericInput
                  type="text"
                  id="firstName"
                  ariaLabel="Nombre (s)"
                  placeholder="John"
                  defaultValue={user?.firstName ?? ""}
                  error={badResponse.errors?.firstName}
                />
                <GenericInput
                  type="text"
                  id="lastName"
                  ariaLabel="Apellido (s)"
                  placeholder="Doe"
                  defaultValue={user?.lastName ?? ""}
                  error={badResponse.errors?.lastName}
                />
                {badResponse.message && (
                  <p className="text-red-600 dark:text-red-300">
                    {badResponse.message}
                  </p>
                )}
              </div>
            </fieldset>
          </form>
        </>
      ) : (
        <>
          <CustomBtn
            onClick={handleEdit}
            isEditing={isEditing}
            icon={<PencilIcon />}
          />
          <p className="mb-1 mt-3 text-lg font-semibold">{user?.username}</p>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {user?.email}
          </p>
          <p className="text-2xl">{`${user?.firstName} ${user?.lastName}`}</p>
        </>
      )}
    </>
  );
};

export default Form;

interface ICustomBtn {
  icon: ReactNode;
  isEditing?: boolean;
  onClick?: () => void;
  isCancelAction?: boolean;
}

const CustomBtn = ({
  icon,
  isEditing,
  onClick,
  isCancelAction,
}: ICustomBtn) => {
  return (
    <button
      onClick={onClick}
      type={isEditing ? "submit" : "button"}
      className={cn(
        "absolute top-0 hover:bg-black/10 dark:hover:bg-white/10 p-2 rounded-full",
        isEditing
          ? "text-green-600 dark:text-green-300 hover:text-green-700 dark:hover:text-green-400 border border-transparent hover:border-green-700 dark:hover:border-green-400 right-14"
          : isCancelAction
            ? "text-red-600 dark:text-red-300 hover:text-red-700 dark:hover:text-red-400 border border-transparent hover:border-red-700 dark:hover:border-red-400 right-5"
            : "text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-400 border border-transparent hover:border-blue-700 dark:hover:border-blue-400 right-5"
      )}
    >
      {icon}
    </button>
  );
};
