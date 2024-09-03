"use server";

import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { create, read } from "./model";
import { validateUser } from "./schema";
import { redirect } from "next/navigation";
import { JWTPayload, SignJWT, jwtVerify } from "jose";
import type { IUser } from "@/interfaces";

const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) throw new Error("SESSION_SECRET is not set");
const SESSION_SECRET_ENCODED = new TextEncoder().encode(SESSION_SECRET);

async function encrypt(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SESSION_SECRET_ENCODED);
}

async function decrypt(token: string): Promise<any> {
  const { payload } = await jwtVerify(token, SESSION_SECRET_ENCODED, {
    algorithms: ["HS256"],
  });
  return payload;
}

async function createUserSession(userId: string, role: string) {
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  const session = await encrypt({ userId, role, expires });
  cookies().set("session", session, { expires, httpOnly: true });
}

export async function login(formData: FormData) {
  const dataToValidate = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const errors = validateUser("login", dataToValidate);

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
      return { message: "Invalid mail or password", success: false };
    }

    await createUserSession((user as IUser).id, (user as IUser).role);
    // return { message: "Successfully logged in", success: true };
  } catch (error) {
    console.error(error);
    // throw new Error("An internal error occurred");
    return { message: "An internal error occurred", success: false };
  }
  redirect("/admin/home");
}

export async function register(formData: FormData) {
  const dataToValidate = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const errors = validateUser("register", dataToValidate);

  if (Object.keys(errors).length !== 0) {
    return {
      errors,
      success: false,
    };
  }

  if (dataToValidate.password !== dataToValidate.confirmPassword)
    return { message: "Passwords do not match", success: false };

  try {
    const userAlreadyExists = await read({
      email: dataToValidate.email as string,
    });
    if (userAlreadyExists)
      return { message: "User already exists", success: false };

    const { confirmPassword, ...data } = dataToValidate;

    const newUser = await create({ data });

    await createUserSession((newUser as IUser).id, (newUser as IUser).role);
    // return { message: "Successfully registered", success: true };
  } catch (error) {
    console.error(error);
    // throw new Error("An internal error occurred");
    return { message: "An internal error occurred", success: false };
  }
  redirect("/admin/home");
}

export async function logout() {
  cookies().set("session", "", { expires: new Date(0) });
  redirect("/");
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function getUsers() {
  try {
    return await read({});
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get users");
  }
}

export async function getUserById({ id }: { id: string }) {
  try {
    const user = await read({ id });
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get user");
  }
}

export async function getUserByEmail({ email }: { email: string }) {
  try {
    const user = await read({ email });
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get user");
  }
}
