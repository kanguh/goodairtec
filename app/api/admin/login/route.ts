import { NextResponse } from "next/server";
import { ADMIN_COOKIE, checkPassword, sessionToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  if (typeof password !== "string" || !checkPassword(password)) {
    // 무작위 대입을 늦추기 위한 지연
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ error: "비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return res;
}
