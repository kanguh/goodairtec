"use client";

import { useState } from "react";
import { Menu, Phone, Snowflake, X } from "lucide-react";
import { site, telHref } from "@/lib/site";

const links = [
  { href: "#services", label: "서비스" },
  { href: "#pricing", label: "가격 안내" },
  { href: "#booking", label: "예약하기" },
  { href: "#process", label: "진행 과정" },
  { href: "#faq", label: "자주 묻는 질문" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <a href="#top" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-white">
            <Snowflake size={20} strokeWidth={2.4} />
          </span>
          <span className="text-lg font-black tracking-tight text-navy">{site.name}</span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-muted hover:text-brand">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={telHref}
            className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-navy hover:bg-surface sm:flex"
          >
            <Phone size={16} className="text-brand" />
            {site.phone}
          </a>
          <a
            href="#booking"
            className="hidden rounded-lg bg-brand px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-600 sm:block"
          >
            온라인 예약
          </a>
          <button
            type="button"
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-lg text-navy hover:bg-surface lg:hidden"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-white px-4 pb-4 lg:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block border-b border-line py-3.5 font-medium text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
