"use server";

import { cookies } from "next/headers";
import { JWTPayload, SignJWT, jwtVerify } from "jose";

const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) throw new Error("SESSION_SECRET is not set");
const SESSION_SECRET_ENCODED = new TextEncoder().encode(SESSION_SECRET);

async function encrypt(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .setJti(crypto.randomUUID())
    .sign(SESSION_SECRET_ENCODED);
}

async function decrypt(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, SESSION_SECRET_ENCODED, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function createUserSession(userId: string, role: string) {
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  const session = await encrypt({ userId, role, expires });
  cookies().set("session", session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

export async function getSession() {
  try {
    const session = cookies().get("session")?.value;
    if (!session) return null;
    return await decrypt(session);
  } catch (error) {
    console.error("Error retrieving session:", error);
    return null;
  }
}

export async function isAuthenticated() {
  try {
    const session = await getSession();
    if (!session || !session.userId) return false;
    return true;
  } catch (error) {
    console.error("Error verifying session:", error);
    return false;
  }
}

export async function isAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("Unauthorized access.");
  }
  return session;
}
