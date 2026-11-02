import { ChevronDown } from "lucide-react";
import { site } from "@/lib/site";
import SectionTitle from "./SectionTitle";

const faqs = [
  {
    q: "온라인 예약하면 바로 확정되나요?",
    a: "예약을 접수하면 해당 시간이 먼저 잡히고, 담당 기사가 전화로 현장 상황을 확인한 뒤 최종 확정해 드립니다.",
  },
  {
    q: "다른 곳에서 산 에어컨도 설치해 주나요?",
    a: `네. 온라인·매장 구매 제품 모두 설치 가능합니다. 취급 브랜드: ${site.brands.join(", ")}.`,
  },
  {
    q: "추가 비용은 어떤 경우에 생기나요?",
    a: "기본 배관 길이를 넘는 경우, 실외기 앵글·위험 작업이 필요한 경우, 벽 타공이 추가되는 경우 등입니다. 모두 작업 전에 안내드립니다.",
  },
  {
    q: "예약을 변경하거나 취소하고 싶어요.",
    a: `${site.phone}으로 전화 주시면 변경·취소해 드립니다. 방문 전날까지 연락 주시면 비용이 발생하지 않습니다.`,
  },
  { q: "서비스 지역이 어디인가요?", a: `${site.serviceAreas.join(", ")} 지역에 방문합니다. 그 외 지역은 전화로 문의해 주세요.` },
];

export default function Faq() {
  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <SectionTitle eyebrow="FAQ" title="자주 묻는 질문" center />
        <div className="mt-12 divide-y divide-line border-y border-line">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-navy">
                {f.q}
                <ChevronDown size={20} className="shrink-0 text-muted transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
