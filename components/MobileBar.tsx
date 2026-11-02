import { CalendarCheck, Phone } from "lucide-react";
import { telHref } from "@/lib/site";

/** 모바일 하단 고정 버튼 */
export default function MobileBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-line bg-white p-3 sm:hidden">
      <a
        href={telHref}
        className="flex items-center justify-center gap-2 rounded-lg border border-line py-3.5 font-bold text-navy"
      >
        <Phone size={18} className="text-brand" />
        전화 상담
      </a>
      <a href="#booking" className="flex items-center justify-center gap-2 rounded-lg bg-brand py-3.5 font-bold text-white">
        <CalendarCheck size={18} />
        예약하기
      </a>
    </div>
  );
}
