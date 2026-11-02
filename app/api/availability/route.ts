import { NextResponse } from "next/server";
import { isValidDate } from "@/lib/dates";
import { listSchedules } from "@/lib/store";

// 공개 달력용: 이름·연락처·주소 없이 날짜/시간/종류만 내려줌
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";
  if (!isValidDate(from) || !isValidDate(to) || from > to) {
    return NextResponse.json({ error: "잘못된 기간입니다." }, { status: 400 });
  }

  const items = await listSchedules(from, to);
  return NextResponse.json(
    {
      items: items.map((s) => ({
        date: s.date,
        slot: s.slot,
        kind: s.kind,
        // 작업 일정은 사장님이 적은 작업명만 공개, 고객 예약은 공개하지 않음
        label: s.kind === "job" ? s.service : null,
      })),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
