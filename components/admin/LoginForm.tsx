"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const password = new FormData(e.currentTarget).get("password");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setPending(false);
    if (res.ok) router.refresh();
    else setError((await res.json().catch(() => ({}))).error ?? "로그인에 실패했습니다.");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-surface px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-line bg-white p-8">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-sky-50 text-brand">
          <Lock size={22} />
        </span>
        <h1 className="mt-5 text-xl font-black text-navy">관리자 로그인</h1>
        <label className="mt-6 block text-sm font-bold">
          비밀번호
          <input
            name="password"
            type="password"
            required
            autoFocus
            autoComplete="current-password"
            className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-3 focus:border-brand focus:outline-none"
          />
        </label>
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        <button
          disabled={pending}
          className="mt-6 w-full rounded-lg bg-brand py-3.5 font-bold text-white hover:bg-brand-600 disabled:opacity-60"
        >
          로그인
        </button>
      </form>
    </main>
  );
}
