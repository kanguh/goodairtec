// 날짜는 모두 한국 시간 기준 "YYYY-MM-DD" 문자열로 다룹니다.

const DAY = 86_400_000;

export function todayKST() {
  return new Date(Date.now() + 9 * 3_600_000).toISOString().slice(0, 10);
}

function toUTC(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

export function addDays(date: string, n: number) {
  return new Date(toUTC(date) + n * DAY).toISOString().slice(0, 10);
}

export function weekday(date: string) {
  return new Date(toUTC(date)).getUTCDay();
}

export function isValidDate(date: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && new Date(toUTC(date)).toISOString().slice(0, 10) === date;
}

/** 해당 월의 첫날과 마지막 날 */
export function monthRange(year: number, month: number) {
  const first = new Date(Date.UTC(year, month - 1, 1)).toISOString().slice(0, 10);
  const last = new Date(Date.UTC(year, month, 0)).toISOString().slice(0, 10);
  return { first, last };
}

/** 달력 그리드에 들어갈 날짜 (앞쪽 빈칸은 null) */
export function monthGrid(year: number, month: number) {
  const { first, last } = monthRange(year, month);
  const cells: (string | null)[] = Array(weekday(first)).fill(null);
  for (let d = first; d <= last; d = addDays(d, 1)) cells.push(d);
  while (cells.length % 7) cells.push(null);
  return cells;
}

export function formatKoreanDate(date: string) {
  const [, m, d] = date.split("-").map(Number);
  return `${m}월 ${d}일 (${"일월화수목금토"[weekday(date)]})`;
}
