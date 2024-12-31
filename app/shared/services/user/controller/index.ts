"use server";

import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { create, read } from "../model";
import { redirect } from "next/navigation";
import { validateSchema } from "../schema";
import {
  getSession,
  isAuthenticated,
  createUserSession,
} from "@/app/shared/services/auth";
import type { IUser } from "@/app/shared/interfaces";

export async function login(formData: FormData) {
  const dataToValidate = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const errors = validateSchema("login", dataToValidate);

  if (Object.keys(errors).length !== 0) {
    return {
      errors,
      success: false,
    };
  }

  try {
    const user = await read({ email: dataToValidate.email as string });

    if (
      !user ||
      !(await bcrypt.compare(
        dataToValidate.password as string,
        (user as IUser).password
      ))
    ) {
      return {
        message: "Correo electrónico o contraseña incorrecto.",
        success: false,
      };
    }

    await createUserSession((user as IUser).id, (user as IUser).role);
    // return { message: "Successfully logged in", success: true };
  } catch (error) {
    console.error(error);
    // throw new Error("Ocurrió un error interno.");
    return { message: "Ocurrió un error interno.", success: false };
  }
  const session = await getSession();
  // const lng = cookies().get("i18next")?.value ?? "es";
  // redirect(session?.role === "ADMIN" ? `/${lng}/admin/home` : `/${lng}`);
  redirect(session?.role === "ADMIN" ? "/admin/home" : "/");
}

export async function register(formData: FormData) {
  const dataToValidate = {
    lastName: formData.get("lastName") ?? "",
    firstName: formData.get("firstName") ?? "",
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    wantsNewsletter: formData.get("wantsNewsletter") ? true : false,
  };

  const errors = validateSchema("register", dataToValidate);

  if (Object.keys(errors).length !== 0) {
    return {
      errors,
      success: false,
    };
  }

  if (dataToValidate.password !== dataToValidate.confirmPassword)
    return { message: "Las contraseñas no coinciden.", success: false };

  try {
    const userAlreadyExists = await read({
      email: dataToValidate.email as string,
    });
    if (userAlreadyExists)
      return { message: "El usuario ya existe.", success: false };

    const { confirmPassword, ...data } = dataToValidate;

    const newUser = await create({ data });

    await createUserSession((newUser as IUser).id, (newUser as IUser).role);
    // return { message: "Successfully registered", success: true };
  } catch (error) {
    console.error(error);
    // throw new Error("An internal error occurred");
    return { message: "An internal error occurred", success: false };
  }
  // const lng = cookies().get("i18next")?.value ?? "es";
  // redirect(`/${lng}`);
  redirect("/");
}

export async function logout() {
  cookies().set("session", "", { expires: new Date(0) });
  // const lng = cookies().get("i18next")?.value ?? "es";
  // redirect(`/${lng}`);
  redirect("/");
}

export async function getMe() {
  try {
    const session = await isAuthenticated();
    return await read({
      id: session.userId as string,
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}
