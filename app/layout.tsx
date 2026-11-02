import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const sans = Noto_Sans_KR({
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-sans-kr",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: `${site.name} | ${site.tagline}`,
  description: `${site.serviceAreas.join(", ")} 에어컨 신규 설치, 이전 설치, 분해 세척. 온라인으로 원하는 날짜와 시간을 바로 예약하세요.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={sans.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
