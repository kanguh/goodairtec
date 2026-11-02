import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "admin_session";

const password = process.env.ADMIN_PASSWORD ?? "";

function token() {
  return createHmac("sha256", password).update("aircon-admin-v1").digest("hex");
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function checkPassword(input: string) {
  return password.length > 0 && safeEqual(input, password);
}

export function sessionToken() {
  return token();
}

export async function isAdmin() {
  if (!password) return false;
  const value = (await cookies()).get(ADMIN_COOKIE)?.value;
  return !!value && safeEqual(value, token());
}

export const adminConfigured = password.length > 0;
