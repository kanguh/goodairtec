import { addDays, isValidDate, todayKST, weekday } from "./dates";
import { site } from "./site";

export type BookingInput = {
  date: string;
  slot: string;
  name: string;
  phone: string;
  address: string;
  service: string;
  memo: string;
  agree: boolean;
  website?: string; // 스팸 방지용 숨은 필드
};

export function bookableRange() {
  const today = todayKST();
  return { min: addDays(today, site.minLeadDays), max: addDays(today, site.maxDays) };
}

export function isBookableDate(date: string) {
  const { min, max } = bookableRange();
  return isValidDate(date) && date >= min && date <= max && !site.closedWeekdays.includes(weekday(date));
}

export function normalizePhone(phone: string) {
  const d = phone.replace(/[^0-9]/g, "");
  if (d.length === 11) return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
  if (d.length === 10) return d.startsWith("02") ? `02-${d.slice(2, 6)}-${d.slice(6)}` : `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  if (d.length === 9 && d.startsWith("02")) return `02-${d.slice(2, 5)}-${d.slice(5)}`;
  return null;
}

/** 오류가 있으면 필드별 메시지를, 없으면 정리된 값을 돌려줌 */
export function validateBooking(raw: Partial<BookingInput>) {
  const errors: Record<string, string> = {};
  const s = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  const date = s(raw.date);
  const slot = s(raw.slot);
  const name = s(raw.name);
  const phone = normalizePhone(s(raw.phone));
  const address = s(raw.address);
  const service = s(raw.service);
  const memo = s(raw.memo);

  if (!isBookableDate(date)) errors.date = "예약할 수 없는 날짜입니다.";
  if (!site.slots.some((x) => x.id === slot)) errors.slot = "시간을 선택해 주세요.";
  if (name.length < 2 || name.length > 20) errors.name = "성함을 2–20자로 입력해 주세요.";
  if (!phone) errors.phone = "연락 가능한 전화번호를 입력해 주세요.";
  if (address.length < 4 || address.length > 100) errors.address = "방문 주소를 입력해 주세요.";
  if (!site.services.includes(service)) errors.service = "서비스를 선택해 주세요.";
  if (memo.length > 500) errors.memo = "요청 사항은 500자 이내로 입력해 주세요.";
  if (raw.agree !== true) errors.agree = "개인정보 수집·이용에 동의해 주세요.";

  return {
    errors,
    spam: s(raw.website).length > 0,
    value: { date, slot, name, phone: phone ?? "", address, service, memo },
  };
}
