import { NextResponse } from "next/server";
import { createSchedule } from "@/lib/store";
import { validateBooking } from "@/lib/validate";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const { errors, spam, value } = validateBooking(body);
  // 봇이 숨은 필드를 채운 경우 성공한 척만 함
  if (spam) return NextResponse.json({ ok: true });
  if (Object.keys(errors).length) {
    return NextResponse.json({ error: "입력값을 확인해 주세요.", fields: errors }, { status: 422 });
  }

  const result = await createSchedule({ ...value, kind: "booking", status: "pending" });
  if (!result.ok) {
    return NextResponse.json(
      { error: "방금 다른 고객이 이 시간을 예약했습니다. 다른 시간을 선택해 주세요." },
      { status: 409 },
    );
  }
  return NextResponse.json({ ok: true });
}
