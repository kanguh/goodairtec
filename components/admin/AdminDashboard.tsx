"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Phone, Plus, Trash2 } from "lucide-react";
import { formatKoreanDate, monthRange, todayKST } from "@/lib/dates";
import { ALL_DAY, site, slotLabel } from "@/lib/site";
import type { Schedule, Status } from "@/lib/store";
import MonthGrid from "../MonthGrid";

const STATUS_LABEL: Record<Status, string> = { pending: "확인 대기", confirmed: "확정", cancelled: "취소" };
const STATUS_STYLE: Record<Status, string> = {
  pending: "bg-amber-50 text-amber",
  confirmed: "bg-sky-50 text-brand",
  cancelled: "bg-surface text-muted line-through",
};

const input = "mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm focus:border-brand focus:outline-none";

export default function AdminDashboard({ demo }: { demo: boolean }) {
  const router = useRouter();
  const [today] = useState(todayKST);
  const [ym, setYm] = useState(() => ({ y: Number(today.slice(0, 4)), m: Number(today.slice(5, 7)) }));
  const [items, setItems] = useState<Schedule[]>([]);
  const [date, setDate] = useState(today);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { first, last } = monthRange(ym.y, ym.m);
    const res = await fetch(`/api/admin/schedules?from=${first}&to=${last}`, { cache: "no-store" });
    if (res.status === 401) return router.refresh();
    setItems((await res.json()).items ?? []);
  }, [ym, router]);

  useEffect(() => {
    load();
  }, [load]);

  const active = useMemo(() => items.filter((s) => s.status !== "cancelled"), [items]);
  const pending = items.filter((s) => s.kind === "booking" && s.status === "pending");
  const ofDay = items.filter((s) => s.date === date);

  async function call(method: string, body?: object, query = "") {
    setError(null);
    const res = await fetch(`/api/admin/schedules${query}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) setError((await res.json().catch(() => ({}))).error ?? "처리 중 오류가 발생했습니다.");
    await load();
    return res.ok;
  }

  async function addSchedule(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const f = new FormData(formEl);
    const ok = await call("POST", {
      date,
      slot: f.get("slot"),
      kind: f.get("kind"),
      title: f.get("title"),
      memo: f.get("memo"),
    });
    if (ok) formEl.reset();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-surface">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <p className="font-black text-navy">{site.name} · 일정 관리</p>
          <button onClick={logout} className="flex items-center gap-1.5 text-sm text-muted hover:text-ink">
            <LogOut size={16} /> 로그아웃
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {demo && (
          <p className="mb-6 rounded-lg border border-amber/40 bg-amber-50 px-4 py-3 text-sm">
            데모 모드입니다. Supabase를 연결하기 전에는 변경 사항이 저장되지 않습니다.
          </p>
        )}

        {pending.length > 0 && (
          <section className="mb-6 rounded-2xl border border-amber/40 bg-white p-5">
            <h2 className="font-black text-navy">확인 대기 예약 {pending.length}건</h2>
            <ul className="mt-3 divide-y divide-line">
              {pending.map((s) => (
                <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
                  <button onClick={() => setDate(s.date)} className="text-left hover:text-brand">
                    <b>{formatKoreanDate(s.date)}</b> {slotLabel(s.slot)} · {s.name} · {s.service}
                  </button>
                  <a href={`tel:${s.phone}`} className="flex items-center gap-1 font-bold text-brand">
                    <Phone size={14} /> {s.phone}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl border border-line bg-white p-4 sm:p-6">
            <MonthGrid
              year={ym.y}
              month={ym.m}
              onMonthChange={(y, m) => setYm({ y, m })}
              selected={date}
              onSelect={setDate}
              renderDay={(d) => {
                const day = active.filter((s) => s.date === d);
                if (!day.length) return null;
                const bookings = day.filter((s) => s.kind === "booking").length;
                const jobs = day.length - bookings;
                return (
                  <span className="mt-auto flex flex-col text-[10px] leading-tight sm:text-[11px]">
                    {bookings > 0 && <span>예약 {bookings}</span>}
                    {jobs > 0 && <span className={date === d ? "" : "text-amber"}>작업 {jobs}</span>}
                  </span>
                );
              }}
            />
          </div>

          <div className="space-y-6">
            <section className="rounded-2xl border border-line bg-white p-5">
              <h2 className="font-black text-navy">{formatKoreanDate(date)}</h2>
              {ofDay.length === 0 ? (
                <p className="mt-3 text-sm text-muted">일정이 없습니다.</p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {ofDay.map((s) => (
                    <li key={s.id} className="rounded-lg border border-line p-3.5 text-sm">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold">
                          {slotLabel(s.slot)} ·{" "}
                          {s.kind === "booking" ? "고객 예약" : s.kind === "job" ? "작업 일정" : "휴무"}
                        </p>
                        <span className={`rounded px-2 py-0.5 text-xs font-bold ${STATUS_STYLE[s.status]}`}>
                          {STATUS_LABEL[s.status]}
                        </span>
                      </div>
                      <p className="mt-1.5 text-ink">{s.service}</p>
                      {s.kind === "booking" && (
                        <div className="mt-1.5 space-y-0.5 text-muted">
                          <p>
                            {s.name} ·{" "}
                            <a href={`tel:${s.phone}`} className="font-bold text-brand">
                              {s.phone}
                            </a>
                          </p>
                          <p>{s.address}</p>
                        </div>
                      )}
                      {s.memo && <p className="mt-1.5 rounded bg-surface px-2.5 py-2 text-muted">{s.memo}</p>}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {s.kind === "booking" && s.status !== "confirmed" && (
                          <button
                            onClick={() => call("PATCH", { id: s.id, status: "confirmed" })}
                            className="rounded-md bg-brand px-3 py-1.5 text-xs font-bold text-white"
                          >
                            확정
                          </button>
                        )}
                        {s.kind === "booking" && s.status !== "cancelled" && (
                          <button
                            onClick={() => confirm("이 예약을 취소할까요?") && call("PATCH", { id: s.id, status: "cancelled" })}
                            className="rounded-md border border-line px-3 py-1.5 text-xs font-bold"
                          >
                            예약 취소
                          </button>
                        )}
                        {s.kind !== "booking" && (
                          <button
                            onClick={() => confirm("이 일정을 삭제할까요?") && call("DELETE", undefined, `?id=${s.id}`)}
                            className="flex items-center gap-1 rounded-md border border-line px-3 py-1.5 text-xs font-bold text-red-500"
                          >
                            <Trash2 size={13} /> 삭제
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <form onSubmit={addSchedule} className="rounded-2xl border border-line bg-white p-5">
              <h2 className="font-black text-navy">이 날짜에 일정 추가</h2>
              <p className="mt-1 text-xs text-muted">
                작업명은 고객 달력에도 표시됩니다. 고객 이름·주소는 메모에만 적어 주세요.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <label className="text-sm font-bold">
                  종류
                  <select name="kind" className={input}>
                    <option value="job">작업 일정</option>
                    <option value="blocked">휴무 · 예약 막기</option>
                  </select>
                </label>
                <label className="text-sm font-bold">
                  시간
                  <select name="slot" className={input}>
                    <option value={ALL_DAY}>종일</option>
                    {site.slots.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="mt-3 block text-sm font-bold">
                작업명
                <input name="title" maxLength={40} placeholder="예: 시스템 에어컨 설치" className={input} />
              </label>
              <label className="mt-3 block text-sm font-bold">
                메모 (관리자만 보임)
                <textarea name="memo" rows={2} className={`${input} resize-none`} />
              </label>
              {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
              <button className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-navy py-3 text-sm font-bold text-white">
                <Plus size={16} /> 일정 추가
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
