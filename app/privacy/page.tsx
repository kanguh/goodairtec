import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: `개인정보처리방침 | ${site.name}` };

// 기본 양식입니다. 실제 운영 전 내용(보관 기간, 위탁 업체 등)을 업체 상황에 맞게 확인해 주세요.
const sections = [
  {
    title: "1. 수집하는 개인정보 항목",
    body: "온라인 예약 시 성함, 연락처, 방문 주소, 요청 사항을 수집합니다.",
  },
  {
    title: "2. 수집 및 이용 목적",
    body: "예약 확인 및 일정 안내, 방문 시공, 견적 안내, 사후 A/S 처리에만 이용합니다.",
  },
  {
    title: "3. 보유 및 이용 기간",
    body: "작업 완료 후 1년간 A/S 대응을 위해 보관하며, 기간이 지나면 지체 없이 파기합니다. 관련 법령에 따라 보관이 필요한 경우 해당 기간 동안 보관합니다.",
  },
  {
    title: "4. 제3자 제공 및 처리 위탁",
    body: "수집한 개인정보는 제3자에게 제공하지 않습니다. 예약 정보 저장을 위해 클라우드 데이터베이스 서비스(Supabase)와 웹 호스팅 서비스(Vercel)를 이용합니다.",
  },
  {
    title: "5. 정보주체의 권리",
    body: `언제든지 개인정보 열람, 정정, 삭제, 처리 정지를 요청할 수 있으며, ${site.phone} 또는 ${site.email}로 요청하시면 지체 없이 처리합니다.`,
  },
  {
    title: "6. 개인정보 보호책임자",
    body: `성명 ${site.owner} · 연락처 ${site.phone} · 이메일 ${site.email}`,
  },
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 md:py-24">
      <Link href="/" className="text-sm text-brand">
        ← 홈으로
      </Link>
      <h1 className="mt-6 text-3xl font-black text-navy">개인정보처리방침</h1>
      <p className="mt-3 text-muted">
        {site.name}(이하 “회사”)는 고객의 개인정보를 소중히 다루며, 「개인정보 보호법」을 준수합니다.
      </p>
      <div className="mt-10 space-y-8">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-lg font-bold text-navy">{s.title}</h2>
            <p className="mt-2 leading-relaxed text-ink/80">{s.body}</p>
          </section>
        ))}
      </div>
      <p className="mt-12 text-sm text-muted">시행일: 2026년 11월 2일</p>
    </main>
  );
}
