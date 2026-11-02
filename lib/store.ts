import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { addDays, todayKST } from "./dates";
import { ALL_DAY } from "./site";

export type Kind = "booking" | "job" | "blocked";
export type Status = "pending" | "confirmed" | "cancelled";

export type Schedule = {
  id: string;
  date: string;
  slot: string;
  kind: Kind;
  status: Status;
  name: string | null;
  phone: string | null;
  address: string | null;
  service: string | null;
  memo: string | null;
  created_at: string;
};

export type NewSchedule = Pick<Schedule, "date" | "slot" | "kind"> &
  Partial<Pick<Schedule, "status" | "name" | "phone" | "address" | "service" | "memo">>;

export type CreateResult = { ok: true; item: Schedule } | { ok: false; reason: "taken" };

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** Supabase 키가 없으면 메모리에 임시 저장하는 데모 모드로 동작 */
export const isDemo = !url || !key;

let client: SupabaseClient | null = null;
function db() {
  client ??= createClient(url!, key!, { auth: { persistSession: false } });
  return client;
}

// ---------- 데모용 메모리 저장소 ----------

const memory = globalThis as unknown as { __schedules?: Schedule[] };

function demoData(): Schedule[] {
  if (memory.__schedules) return memory.__schedules;
  const t = todayKST();
  const seed: [number, string, Kind, string][] = [
    [1, "09:00", "job", "시스템 에어컨 설치"],
    [1, "14:00", "booking", "벽걸이 신규 설치"],
    [2, ALL_DAY, "job", "상가 단체 설치"],
    [3, "11:00", "booking", "분해 세척"],
    [3, "16:00", "booking", "이전 설치"],
    [5, "09:00", "booking", "스탠드 신규 설치"],
    [5, "11:00", "job", "배관 공사"],
    [5, "14:00", "booking", "2in1 신규 설치"],
    [5, "16:00", "booking", "수리 · 가스 충전"],
    [8, "14:00", "job", "아파트 단지 점검"],
  ];
  memory.__schedules = seed.map(([offset, slot, kind, service], i) => ({
    id: `demo-${i}`,
    date: addDays(t, offset),
    slot,
    kind,
    status: "confirmed",
    name: kind === "booking" ? "데모 고객" : null,
    phone: kind === "booking" ? "010-0000-0000" : null,
    address: null,
    service,
    memo: null,
    created_at: new Date().toISOString(),
  }));
  return memory.__schedules;
}

// ---------- 공통 API ----------

export async function listSchedules(from: string, to: string, includeCancelled = false) {
  if (isDemo) {
    return demoData()
      .filter((s) => s.date >= from && s.date <= to && (includeCancelled || s.status !== "cancelled"))
      .sort((a, b) => a.date.localeCompare(b.date) || a.slot.localeCompare(b.slot));
  }
  let q = db().from("bookings").select("*").gte("date", from).lte("date", to);
  if (!includeCancelled) q = q.neq("status", "cancelled");
  const { data, error } = await q.order("date").order("slot");
  if (error) throw error;
  return data as Schedule[];
}

function conflicts(existing: Schedule[], slot: string) {
  return existing.some((s) => s.slot === slot || s.slot === ALL_DAY || slot === ALL_DAY);
}

/** 고객 예약은 겹치면 거절. 관리자 일정은 같은 슬롯만 아니면 허용 */
export async function createSchedule(input: NewSchedule): Promise<CreateResult> {
  const sameDay = await listSchedules(input.date, input.date);
  const taken =
    input.kind === "booking" ? conflicts(sameDay, input.slot) : sameDay.some((s) => s.slot === input.slot);
  if (taken) return { ok: false, reason: "taken" };

  const row = {
    status: "pending" as Status,
    name: null,
    phone: null,
    address: null,
    service: null,
    memo: null,
    ...input,
  };

  if (isDemo) {
    const item: Schedule = { ...row, id: crypto.randomUUID(), created_at: new Date().toISOString() };
    demoData().push(item);
    return { ok: true, item };
  }

  const { data, error } = await db().from("bookings").insert(row).select().single();
  // 동시에 같은 슬롯을 잡으려 한 경우 DB 유니크 인덱스가 막아줌
  if (error?.code === "23505") return { ok: false, reason: "taken" };
  if (error) throw error;
  return { ok: true, item: data as Schedule };
}

export async function updateStatus(id: string, status: Status) {
  if (isDemo) {
    const item = demoData().find((s) => s.id === id);
    if (item) item.status = status;
    return;
  }
  const { error } = await db().from("bookings").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function deleteSchedule(id: string) {
  if (isDemo) {
    memory.__schedules = demoData().filter((s) => s.id !== id);
    return;
  }
  const { error } = await db().from("bookings").delete().eq("id", id);
  if (error) throw error;
}
