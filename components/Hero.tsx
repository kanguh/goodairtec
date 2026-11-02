import { BadgeCheck, CalendarCheck, Phone, ShieldCheck, Wrench } from "lucide-react";
import { site, telHref } from "@/lib/site";

const trust = [
  { icon: BadgeCheck, text: "전문 기사 직접 시공" },
  { icon: ShieldCheck, text: "설치 후 무상 A/S" },
  { icon: Wrench, text: "정품 동배관 사용" },
];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-navy text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgb(59_178_240/0.25),transparent_55%)]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-sky">
            <span className="h-1.5 w-1.5 rounded-full bg-sky" />
            {site.serviceAreas[0]} 외 출장 시공
          </p>
          <h1 className="mt-6 text-4xl leading-[1.2] font-black tracking-tight sm:text-5xl lg:text-[3.5rem]">
            에어컨 설치,
            <br />
            <span className="text-sky">한 번에 제대로.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/75">
            신규 설치부터 이전, 분해 세척까지. 원하는 날짜와 시간을 달력에서 바로 확인하고 예약하세요.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#booking"
              className="flex items-center justify-center gap-2 rounded-lg bg-brand px-6 py-4 font-bold hover:bg-brand-600"
            >
              <CalendarCheck size={20} />
              예약 가능한 날짜 보기
            </a>
            <a
              href={telHref}
              className="flex items-center justify-center gap-2 rounded-lg border border-white/25 px-6 py-4 font-bold hover:bg-white/10"
            >
              <Phone size={20} />
              전화 상담 {site.phone}
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
            {trust.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2 text-sm text-white/80">
                <Icon size={18} className="text-sky" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="placeholder-photo flex aspect-[4/3] items-end rounded-2xl p-5 ring-1 ring-white/10">
            <span className="rounded bg-black/30 px-2 py-1 text-xs text-white/70">시공 현장 사진 (4:3)</span>
          </div>
          <div className="absolute -bottom-6 left-4 rounded-xl bg-white p-4 text-ink shadow-xl sm:left-auto sm:-right-4">
            <p className="text-xs text-muted">취급 브랜드</p>
            <p className="mt-1 text-sm font-bold">{site.brands.slice(0, 4).join(" · ")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
