"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
  e.preventDefault();
  setError(null);
  setLoading(true);

  const formData = new FormData(e.target);
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ email, password })
      }
    );

    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Server error. Response is not valid JSON.");
    }

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    router.push("/");
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}

return (
  <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
    <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-10">
      <h1 className="text-3xl font-semibold text-slate-800">
        Sign In
      </h1>
      <p className="text-sm text-slate-500 mt-2 mb-8">
        Access your dashboard
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition"
          />
        </div>

        <div>
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {error && (
        <p style={{ color: "red", marginTop: "8px" }}>
          {error}
        </p>
      )}
    </div>
  </div>
);
}