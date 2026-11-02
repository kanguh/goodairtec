import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { isValidDate } from "@/lib/dates";
import { ALL_DAY, site } from "@/lib/site";
import { createSchedule, deleteSchedule, listSchedules, updateStatus, type Status } from "@/lib/store";

const unauthorized = () => NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
const bad = (error: string) => NextResponse.json({ error }, { status: 400 });

export async function GET(req: Request) {
  if (!(await isAdmin())) return unauthorized();
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";
  if (!isValidDate(from) || !isValidDate(to)) return bad("잘못된 기간입니다.");
  return NextResponse.json({ items: await listSchedules(from, to, true) });
}

/** 작업 일정 또는 휴무 추가 */
export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized();
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const date = String(body.date ?? "");
  const slot = String(body.slot ?? "");
  const kind = body.kind === "blocked" ? "blocked" : "job";
  const title = String(body.title ?? "").trim().slice(0, 40);
  const memo = String(body.memo ?? "").trim().slice(0, 500);

  if (!isValidDate(date)) return bad("날짜를 확인해 주세요.");
  if (slot !== ALL_DAY && !site.slots.some((s) => s.id === slot)) return bad("시간을 확인해 주세요.");
  if (kind === "job" && !title) return bad("작업명을 입력해 주세요.");

  const result = await createSchedule({
    date,
    slot,
    kind,
    status: "confirmed",
    service: kind === "job" ? title : "휴무",
    memo: memo || null,
  });
  if (!result.ok) return NextResponse.json({ error: "이미 같은 시간에 일정이 있습니다." }, { status: 409 });
  return NextResponse.json({ item: result.item });
}

/** 예약 상태 변경 (확정/취소) */
export async function PATCH(req: Request) {
  if (!(await isAdmin())) return unauthorized();
  const { id, status } = (await req.json().catch(() => ({}))) as { id?: string; status?: Status };
  if (!id || !["pending", "confirmed", "cancelled"].includes(status ?? "")) return bad("잘못된 요청입니다.");
  await updateStatus(id, status!);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) return unauthorized();
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return bad("잘못된 요청입니다.");
  await deleteSchedule(id);
  return NextResponse.json({ ok: true });
}
