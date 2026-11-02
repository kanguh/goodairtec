import { CalendarCheck, ClipboardCheck, PhoneCall, Wrench } from "lucide-react";
import SectionTitle from "./SectionTitle";

const steps = [
  { icon: CalendarCheck, title: "온라인 예약", body: "달력에서 원하는 날짜와 시간을 고르고 정보를 남깁니다." },
  { icon: PhoneCall, title: "확인 전화", body: "담당 기사가 전화로 현장 상황과 예상 비용을 확인합니다." },
  { icon: Wrench, title: "방문 시공", body: "약속한 시간에 방문해 설치하고 냉방 테스트까지 마칩니다." },
  { icon: ClipboardCheck, title: "사후 관리", body: "작업 내역을 안내드리고, 문제가 생기면 다시 방문합니다." },
];

export default function Process() {
  return (
    <section id="process" className="bg-navy py-20 text-white md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <p className="text-sm font-bold tracking-wide text-sky">PROCESS</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">예약부터 시공까지</h2>
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title, body }, i) => (
            <li key={title} className="rounded-2xl bg-navy-800 p-7 ring-1 ring-white/10">
              <div className="flex items-center justify-between">
                <Icon size={26} className="text-sky" />
                <span className="text-sm font-bold text-white/40">STEP {i + 1}</span>
              </div>
              <h3 className="mt-6 text-lg font-bold">{title}</h3>
              <p className="mt-2 leading-relaxed text-white/70">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
