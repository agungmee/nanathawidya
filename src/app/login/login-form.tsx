"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export function LoginForm() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const error = searchParams.get("error") ? "Email atau password salah" : "";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);

    import("next-auth/react").then(({ signIn }) => {
      signIn("credentials", {
        email: form.get("email") as string,
        password: form.get("password") as string,
        callbackUrl: "/admin",
      });
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">{error}</div>
      )}

      <div>
        <label className="text-xs font-semibold text-muted block mb-1">Email</label>
        <input
          name="email"
          type="email"
          required
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
          placeholder="admin@email.com"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-muted block mb-1">Password</label>
        <input
          name="password"
          type="password"
          required
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
          placeholder="Password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent text-white font-semibold py-3.5 rounded-xl hover:bg-accent-hover transition-all disabled:opacity-50"
      >
        {loading ? "Memproses..." : "Masuk"}
      </button>
    </form>
  );
}
