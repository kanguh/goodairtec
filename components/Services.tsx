import { AirVent, Building2, MoveRight, Sparkles, Thermometer, Truck } from "lucide-react";
import SectionTitle from "./SectionTitle";

const services = [
  { icon: AirVent, title: "신규 설치", body: "벽걸이 · 스탠드 · 2in1. 구매처와 상관없이 설치해 드립니다." },
  { icon: Building2, title: "시스템 에어컨", body: "아파트 · 상가 · 사무실 천장형 에어컨 설계부터 시공까지." },
  { icon: Truck, title: "이전 설치", body: "이사 날짜에 맞춰 철거, 운반, 재설치를 한 번에 진행합니다." },
  { icon: Sparkles, title: "분해 세척", body: "완전 분해 후 고압 세척으로 곰팡이와 냄새를 제거합니다." },
  { icon: Thermometer, title: "수리 · 가스 충전", body: "냉방 불량, 누수, 에러 코드 점검과 냉매 충전." },
];

export default function Services() {
  return (
    <section id="services" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionTitle eyebrow="SERVICES" title="필요한 작업을 선택하세요" />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, body }) => (
            <li key={title} className="rounded-2xl border border-line p-7 transition-shadow hover:shadow-lg">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-sky-50 text-brand">
                <Icon size={24} />
              </span>
              <h3 className="mt-5 text-lg font-bold text-navy">{title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{body}</p>
            </li>
          ))}
          <li className="flex flex-col justify-between rounded-2xl bg-brand p-7 text-white">
            <div>
              <h3 className="text-lg font-bold">어떤 작업인지 모르겠다면</h3>
              <p className="mt-2 leading-relaxed text-white/80">방문 견적으로 예약하시면 현장을 보고 안내해 드립니다.</p>
            </div>
            <a href="#booking" className="mt-6 inline-flex items-center gap-2 font-bold">
              방문 견적 예약 <MoveRight size={18} />
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
