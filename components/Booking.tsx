"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { formatKoreanDate, monthRange, todayKST, weekday } from "@/lib/dates";
import { ALL_DAY, site, slotLabel, telHref } from "@/lib/site";
import { bookableRange, isBookableDate } from "@/lib/validate";
import MonthGrid from "./MonthGrid";
import SectionTitle from "./SectionTitle";

type Busy = { date: string; slot: string; kind: "booking" | "job" | "blocked"; label: string | null };
type Done = { date: string; slot: string; service: string };

const field =
  "mt-1.5 w-full rounded-lg border border-line bg-white px-3.5 py-3 text-ink placeholder:text-muted/60 focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none";

function busyText(b: Busy) {
  if (b.kind === "booking") return "예약 완료";
  if (b.kind === "blocked") return "휴무";
  return b.label ? `작업 일정 · ${b.label}` : "작업 일정";
}

export default function Booking({ demo }: { demo: boolean }) {
  const [today] = useState(todayKST);
  const range = useMemo(() => bookableRange(), []);
  const [ym, setYm] = useState(() => ({ y: Number(today.slice(0, 4)), m: Number(today.slice(5, 7)) }));
  const [busy, setBusy] = useState<Busy[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<Done | null>(null);

  const load = useCallback(async () => {
    const { first, last } = monthRange(ym.y, ym.m);
    setLoading(true);
    try {
      const res = await fetch(`/api/availability?from=${first}&to=${last}`, { cache: "no-store" });
      const json = await res.json();
      setBusy(json.items ?? []);
    } finally {
      setLoading(false);
    }
  }, [ym]);

  useEffect(() => {
    load();
  }, [load]);

  const byDate = useMemo(() => {
    const map = new Map<string, Busy[]>();
    for (const b of busy) map.set(b.date, [...(map.get(b.date) ?? []), b]);
    return map;
  }, [busy]);

  const freeSlots = (d: string) => {
    const items = byDate.get(d) ?? [];
    if (items.some((b) => b.slot === ALL_DAY)) return 0;
    return site.slots.filter((s) => !items.some((b) => b.slot === s.id)).length;
  };

  const dayInfo = (d: string) => {
    const items = byDate.get(d) ?? [];
    const closed = site.closedWeekdays.includes(weekday(d)) || items.some((b) => b.kind === "blocked" && b.slot === ALL_DAY);
    const free = freeSlots(d);
    const hasJob = items.some((b) => b.kind === "job");
    return { closed, free, hasJob, bookable: isBookableDate(d) && !closed && free > 0 };
  };

  const minYm = today.slice(0, 7);
  const maxYm = range.max.slice(0, 7);
  const curYm = `${ym.y}-${String(ym.m).padStart(2, "0")}`;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!date || !slot) return;
    const form = new FormData(e.currentTarget);
    setSubmitting(true);
    setError(null);
    setFieldErrors({});
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          slot,
          name: form.get("name"),
          phone: form.get("phone"),
          address: form.get("address"),
          service: form.get("service"),
          memo: form.get("memo"),
          agree: form.get("agree") === "on",
          website: form.get("website"),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setDone({ date, slot, service: String(form.get("service")) });
        setSlot(null);
        load();
        return;
      }
      setError(json.error ?? "예약 중 문제가 생겼습니다. 전화로 문의해 주세요.");
      setFieldErrors(json.fields ?? {});
      if (res.status === 409) {
        setSlot(null);
        load();
      }
    } catch {
      setError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  const selectedItems = date ? (byDate.get(date) ?? []) : [];

  return (
    <section id="booking" className="bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionTitle
          eyebrow="ONLINE BOOKING"
          title="원하는 날짜와 시간을 바로 예약하세요"
          description="달력에서 이미 잡힌 예약과 작업 일정을 확인하고, 비어 있는 시간을 선택하면 됩니다. 접수 후 담당 기사가 전화로 최종 확정해 드립니다."
        />

        {demo && (
          <p className="mt-6 rounded-lg border border-amber/40 bg-amber-50 px-4 py-3 text-sm text-ink">
            <b>데모 모드</b> · 예약 저장소(Supabase)가 아직 연결되지 않아 예시 일정이 표시되며, 예약은 서버를 다시
            시작하면 사라집니다.
          </p>
        )}

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          {/* 달력 */}
          <div className="rounded-2xl border border-line bg-white p-4 sm:p-6">
            <MonthGrid
              year={ym.y}
              month={ym.m}
              onMonthChange={(y, m) => setYm({ y, m })}
              canPrev={curYm > minYm}
              canNext={curYm < maxYm}
              selected={date}
              onSelect={(d) => {
                setDate(d);
                setSlot(null);
                setDone(null);
                setError(null);
              }}
              isDisabled={(d) => !dayInfo(d).bookable}
              dayClassName={(d) => (dayInfo(d).bookable ? "bg-white" : "bg-surface")}
              renderDay={(d) => {
                if (d < today) return null;
                const info = dayInfo(d);
                if (info.closed) return <span className="mt-auto text-[10px] sm:text-[11px]">휴무</span>;
                if (!isBookableDate(d)) return null;
                return (
                  <span className="mt-auto flex flex-col items-center gap-0.5 text-[10px] leading-tight sm:text-[11px]">
                    {info.free === 0 ? (
                      <span className="font-bold text-red-500">마감</span>
                    ) : (
                      <span className={date === d ? "text-white" : "text-brand"}>{info.free}자리</span>
                    )}
                    {info.hasJob && <span className="h-1 w-4 rounded-full bg-amber" title="작업 일정 있음" />}
                  </span>
                );
              }}
            />
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-4 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <span className="font-bold text-brand">N자리</span> 남은 시간대
              </span>
              <span className="flex items-center gap-1.5">
                <span className="font-bold text-red-500">마감</span> 예약 불가
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-4 rounded-full bg-amber" /> 작업 일정 있음
              </span>
              {loading && <Loader2 size={14} className="animate-spin" />}
            </div>
          </div>

          {/* 시간 선택 + 예약 폼 */}
          <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
            {done ? (
              <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                <CheckCircle2 size={52} className="text-brand" />
                <p className="mt-5 text-xl font-black text-navy">예약이 접수되었습니다</p>
                <p className="mt-3 font-bold text-ink">
                  {formatKoreanDate(done.date)} {slotLabel(done.slot)}
                </p>
                <p className="text-muted">{done.service}</p>
                <p className="mt-5 text-sm leading-relaxed text-muted">
                  담당 기사가 확인 후 전화로 최종 확정해 드립니다.
                  <br />
                  급하신 경우{" "}
                  <a href={telHref} className="font-bold text-brand">
                    {site.phone}
                  </a>
                  으로 연락 주세요.
                </p>
              </div>
            ) : !date ? (
              <div className="flex h-full min-h-48 flex-col items-center justify-center text-center text-muted">
                <Clock size={36} className="text-line" />
                <p className="mt-4">달력에서 날짜를 먼저 선택해 주세요.</p>
                <p className="mt-1 text-sm">
                  {formatKoreanDate(range.min)}부터 {formatKoreanDate(range.max)}까지 예약할 수 있습니다.
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted">선택한 날짜</p>
                <p className="mt-1 text-xl font-black text-navy">{formatKoreanDate(date)}</p>

                <ul className="mt-5 grid gap-2">
                  {site.slots.map((s) => {
                    const taken = selectedItems.find((b) => b.slot === s.id || b.slot === ALL_DAY);
                    const active = slot === s.id;
                    return (
                      <li key={s.id}>
                        <button
                          type="button"
                          disabled={!!taken}
                          onClick={() => setSlot(s.id)}
                          aria-pressed={active}
                          className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors ${
                            active
                              ? "border-brand bg-brand text-white"
                              : taken
                                ? "cursor-not-allowed border-line bg-surface text-muted"
                                : "border-line hover:border-brand"
                          }`}
                        >
                          <span className="font-bold">{s.label}</span>
                          <span
                            className={`text-sm ${
                              active ? "text-white" : taken?.kind === "job" ? "text-amber" : taken ? "" : "text-brand"
                            }`}
                          >
                            {taken ? busyText(taken) : active ? "선택됨" : "예약 가능"}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {slot && (
                  <form onSubmit={handleSubmit} className="mt-6 grid gap-4 border-t border-line pt-6" noValidate>
                    {/* 스팸 봇 방지용 숨은 칸 */}
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="text-sm font-bold text-ink">
                        성함 *
                        <input name="name" required autoComplete="name" placeholder="홍길동" className={field} />
                        {fieldErrors.name && <span className="mt-1 block font-normal text-red-500">{fieldErrors.name}</span>}
                      </label>
                      <label className="text-sm font-bold text-ink">
                        연락처 *
                        <input
                          name="phone"
                          type="tel"
                          required
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder="010-1234-5678"
                          className={field}
                        />
                        {fieldErrors.phone && <span className="mt-1 block font-normal text-red-500">{fieldErrors.phone}</span>}
                      </label>
                    </div>
                    <label className="text-sm font-bold text-ink">
                      방문 주소 *
                      <input
                        name="address"
                        required
                        autoComplete="street-address"
                        placeholder="동·호수까지 입력해 주세요"
                        className={field}
                      />
                      {fieldErrors.address && <span className="mt-1 block font-normal text-red-500">{fieldErrors.address}</span>}
                    </label>
                    <label className="text-sm font-bold text-ink">
                      서비스 *
                      <select name="service" required defaultValue={site.services[0]} className={field}>
                        {site.services.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </label>
                    <label className="text-sm font-bold text-ink">
                      요청 사항
                      <textarea
                        name="memo"
                        rows={3}
                        maxLength={500}
                        placeholder="모델명, 대수, 실외기 위치 등을 적어 주시면 더 정확히 안내해 드립니다."
                        className={`${field} resize-none`}
                      />
                    </label>
                    <label className="flex items-start gap-2.5 text-sm text-muted">
                      <input type="checkbox" name="agree" required className="mt-1 h-4 w-4 accent-brand" />
                      <span>
                        예약 상담을 위한 개인정보(성함, 연락처, 주소) 수집·이용에 동의합니다.{" "}
                        <Link href="/privacy" target="_blank" className="underline">
                          자세히
                        </Link>
                      </span>
                    </label>
                    {fieldErrors.agree && <p className="-mt-2 text-sm text-red-500">{fieldErrors.agree}</p>}

                    {error && (
                      <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center justify-center gap-2 rounded-lg bg-brand py-4 font-bold text-white hover:bg-brand-600 disabled:opacity-60"
                    >
                      {submitting && <Loader2 size={18} className="animate-spin" />}
                      {formatKoreanDate(date)} {slotLabel(slot)} 예약하기
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
