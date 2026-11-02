import { site } from "@/lib/site";
import SectionTitle from "./SectionTitle";

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionTitle
          eyebrow="PRICING"
          title="기본 설치비 안내"
          description="현장 상황(배관 길이, 실외기 위치, 타공 등)에 따라 추가 비용이 생길 수 있으며, 작업 전에 먼저 안내해 드립니다."
        />
        <div className="mt-10 overflow-hidden rounded-2xl border border-line">
          <table className="w-full text-left">
            <thead className="bg-navy text-sm text-white">
              <tr>
                <th className="px-5 py-4 font-medium">항목</th>
                <th className="px-5 py-4 text-right font-medium">기본 비용</th>
                <th className="hidden px-5 py-4 font-medium sm:table-cell">포함 내용</th>
              </tr>
            </thead>
            <tbody>
              {site.prices.map((p) => (
                <tr key={p.name} className="border-t border-line">
                  <td className="px-5 py-4">
                    <p className="font-bold text-navy">{p.name}</p>
                    <p className="mt-0.5 text-sm text-muted sm:hidden">{p.note}</p>
                  </td>
                  <td className="px-5 py-4 text-right text-lg font-black text-brand">{p.price}</td>
                  <td className="hidden px-5 py-4 text-muted sm:table-cell">{p.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted">* 부가세 별도 여부, 추가 배관 1m당 비용 등은 상담 시 안내해 드립니다.</p>
      </div>
    </section>
  );
}
