import Link from "next/link";
import { site, telHref } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-navy pb-24 text-white/60 sm:pb-0">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div>
            <p className="text-lg font-black text-white">{site.name}</p>
            <p className="mt-1 text-sm">{site.tagline}</p>
            <a href={telHref} className="mt-5 block text-2xl font-black text-sky">
              {site.phone}
            </a>
            <p className="mt-1 text-sm">{site.hours}</p>
          </div>
          <div className="text-sm leading-7">
            <p className="font-bold text-white">서비스 지역</p>
            <p>{site.serviceAreas.join(" · ")}</p>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-xs leading-6">
          <p>
            상호 {site.name} · 대표 {site.owner} · 사업자등록번호 {site.bizNo}
          </p>
          <p>
            주소 {site.address} · 이메일 {site.email}
          </p>
          <div className="mt-3 flex flex-wrap gap-4">
            <Link href="/privacy" className="font-bold text-white/80 hover:text-white">
              개인정보처리방침
            </Link>
            <span>© {new Date().getFullYear()} {site.name}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
