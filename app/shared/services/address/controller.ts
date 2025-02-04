"use server";

import { validateSchema } from "./schema";
import { getSession } from "@/app/shared/services/auth";
import { readAddress, createAddress, updateManyAddresses } from "./model";
import type {
  IAddress,
  IAddressState,
  IAddressSearchParams,
} from "@/app/shared/interfaces";

export async function getMyAddresses({ page }: IAddressSearchParams) {
  try {
    const session = await getSession();
    if (!session || !session.userId) return null;

    return await readAddress({
      page,
      userId: session.userId as string,
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getMyAddressById({ id }: { id: string }) {
  try {
    const session = await getSession();
    if (!session || !session.userId) return null;
    return await readAddress({
      id,
      userId: session.userId as string,
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}

interface ICreateNewAddress {
  formData: FormData;
  isForCheckout?: boolean;
}

export async function createNewAddress({
  formData,
  isForCheckout,
}: ICreateNewAddress): Promise<IAddressState> {
  const session = await getSession();
  if (!session || !session.userId) return { success: false };

  const data = {
    country: "MX",
    userId: session.userId as string,
    city: formData.get("city") as string,
    state: formData.get("state") as string,
    zipCode: Number(formData.get("zipCode")),
    fullName: formData.get("fullName") as string,
    address1: formData.get("address1") as string,
    address2: formData.get("address2") as string,
    isDefault: formData.get("isDefault") === "on",
    phoneNumber: formData.get("phoneNumber") as string,
    additionalInfo: formData.get("additionalInfo") as string,
  };

  const errors = validateSchema("create", data);

  if (Object.keys(errors).length) {
    return {
      success: false,
      errors,
    };
  }

  try {
    if (data.isDefault) {
      await updateManyAddresses({
        userId: session.userId as string,
        data: {
          isDefault: false,
        },
      });
    }

    const newAddress = (await createAddress({
      data,
    })) as IAddress;

    if (isForCheckout) {
      return { success: true, address: newAddress };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error al crear la dirección",
    };
  }
  return { success: true };
}
