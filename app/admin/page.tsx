import type { Metadata } from "next";
import AdminDashboard from "@/components/admin/AdminDashboard";
import LoginForm from "@/components/admin/LoginForm";
import { adminConfigured, isAdmin } from "@/lib/auth";
import { isDemo } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "관리자",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!adminConfigured) {
    return (
      <main className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-xl font-black text-navy">관리자 비밀번호가 설정되지 않았습니다</h1>
        <p className="mt-3 text-muted">
          환경 변수 <code className="rounded bg-surface px-1.5 py-0.5">ADMIN_PASSWORD</code>를 설정한 뒤 서버를 다시
          시작해 주세요.
        </p>
      </main>
    );
  }

  return (await isAdmin()) ? <AdminDashboard demo={isDemo} /> : <LoginForm />;
}
