// 업체 정보는 이 파일 한 곳에서 관리합니다. ○○ 표시된 값을 실제 정보로 바꿔 주세요.
export const site = {
  name: "굿에어텍",
  tagline: "에어컨 설치 · 이전 · 세척 전문",
  phone: "010-4690-1900",
  hours: "평일 08:00–19:00 · 토요일 09:00–17:00 · 일요일 휴무",
  serviceAreas: ["서울 전 지역", "경기 ○○시", "경기 ○○시", "인천 ○○구"],
  brands: ["삼성", "LG", "캐리어", "위니아", "기타 브랜드"],

  // 푸터 사업자 정보
  owner: "강준의",
  bizNo: "000-00-00000",
  address: "○○시 ○○구 ○○로 00",
  email: "contact@example.com",

  // 예약 설정
  slots: [
    { id: "09:00", label: "09:00 – 11:00" },
    { id: "11:00", label: "11:00 – 13:00" },
    { id: "14:00", label: "14:00 – 16:00" },
    { id: "16:00", label: "16:00 – 18:00" },
  ],
  closedWeekdays: [0], // 0 = 일요일
  minLeadDays: 1, // 오늘로부터 며칠 뒤부터 예약 가능
  maxDays: 60, // 오늘로부터 며칠 뒤까지 예약 가능

  services: [
    "벽걸이 신규 설치",
    "스탠드 신규 설치",
    "2in1 신규 설치",
    "시스템 에어컨 설치",
    "이전 설치",
    "분해 세척",
    "수리 · 가스 충전",
    "방문 견적",
  ],

  // 가격 안내 (예시 값 — 실제 단가로 바꿔 주세요)
  prices: [
    { name: "벽걸이 기본 설치", price: "○○,000원~", note: "배관 5m 포함" },
    { name: "스탠드 기본 설치", price: "○○,000원~", note: "배관 5m 포함" },
    { name: "2in1 기본 설치", price: "○○○,000원~", note: "배관 각 5m 포함" },
    { name: "분해 세척", price: "○○,000원~", note: "벽걸이 기준" },
  ],
};

export type Slot = (typeof site.slots)[number];
export const ALL_DAY = "all";

export function slotLabel(id: string) {
  if (id === ALL_DAY) return "종일";
  return site.slots.find((s) => s.id === id)?.label ?? id;
}

export const telHref = `tel:${site.phone.replace(/[^0-9]/g, "")}`;
