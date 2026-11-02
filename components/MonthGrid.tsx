"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { monthGrid } from "@/lib/dates";

type Props = {
  year: number;
  month: number;
  onMonthChange: (year: number, month: number) => void;
  canPrev?: boolean;
  canNext?: boolean;
  selected: string | null;
  onSelect: (date: string) => void;
  isDisabled?: (date: string) => boolean;
  renderDay?: (date: string) => React.ReactNode;
  dayClassName?: (date: string) => string;
};

const WEEK = ["일", "월", "화", "수", "목", "금", "토"];

/** 고객 예약 화면과 관리자 화면이 같이 쓰는 월간 달력 */
export default function MonthGrid({
  year,
  month,
  onMonthChange,
  canPrev = true,
  canNext = true,
  selected,
  onSelect,
  isDisabled,
  renderDay,
  dayClassName,
}: Props) {
  const move = (delta: number) => {
    const d = new Date(Date.UTC(year, month - 1 + delta, 1));
    onMonthChange(d.getUTCFullYear(), d.getUTCMonth() + 1);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="이전 달"
          disabled={!canPrev}
          onClick={() => move(-1)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-line text-navy hover:bg-surface disabled:opacity-30"
        >
          <ChevronLeft size={20} />
        </button>
        <p className="text-lg font-black text-navy" aria-live="polite">
          {year}년 {month}월
        </p>
        <button
          type="button"
          aria-label="다음 달"
          disabled={!canNext}
          onClick={() => move(1)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-line text-navy hover:bg-surface disabled:opacity-30"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="mt-5 grid grid-cols-7 text-center text-xs font-bold text-muted">
        {WEEK.map((w, i) => (
          <div key={w} className={`py-2 ${i === 0 ? "text-red-500" : i === 6 ? "text-brand" : ""}`}>
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {monthGrid(year, month).map((date, i) => {
          if (!date) return <div key={`blank-${i}`} />;
          const disabled = isDisabled?.(date) ?? false;
          const active = selected === date;
          return (
            <button
              key={date}
              type="button"
              disabled={disabled}
              aria-pressed={active}
              aria-label={date}
              onClick={() => onSelect(date)}
              className={`flex min-h-16 flex-col items-center rounded-lg border px-0.5 pt-1.5 pb-1 text-sm transition-colors sm:min-h-20 ${
                active
                  ? "border-brand bg-brand text-white"
                  : disabled
                    ? "cursor-not-allowed border-transparent text-muted/50"
                    : "border-line hover:border-brand"
              } ${active ? "" : (dayClassName?.(date) ?? "")}`}
            >
              <span className="font-bold">{Number(date.slice(8))}</span>
              {renderDay?.(date)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
