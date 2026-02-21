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
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
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

    if (data.requires2FA) {
      router.push("/webauthn/login");
      return;
    }

    router.push("/");
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}

return (
<div
  style={{
    minHeight: "100vh",
    background: "#f4f6f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  }}
>
  <div
    style={{
      width: 420,
      background: "#ffffff",
      borderRadius: 16,
      padding: 36,
      boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    }}
  >
    {/* Header */}
    <div style={{ marginBottom: 28 }}>
      <h1 style={{ margin: 0 }}>
        Sign In
      </h1>
      <p
        style={{
          marginTop: 8,
          fontSize: 14,
          color: "#6b7280",
        }}
      >
        Access your dashboard securely
      </p>
    </div>

    {/* Form */}
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 20 }}>
        <label
          style={{
            display: "block",
            fontSize: 14,
            fontWeight: 500,
            marginBottom: 6,
            color: "#374151",
          }}
        >
          Email Address
        </label>

        <input
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #d1d5db",
            fontSize: 14,
          }}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <label
          style={{
            display: "block",
            fontSize: 14,
            fontWeight: 500,
            marginBottom: 6,
            color: "#374151",
          }}
        >
          Password
        </label>

        <input
          name="password"
          type="password"
          required
          placeholder="Enter your password"
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #d1d5db",
            fontSize: 14,
          }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          padding: "10px 16px",
          background: "#111827",
          color: "#ffffff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          opacity: loading ? 0.6 : 1,
          fontWeight: 500,
        }}
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>

    {/* Error */}
    {error && (
      <div
        style={{
          marginTop: 20,
          padding: "12px 14px",
          background: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: 8,
          fontSize: 14,
          color: "#b91c1c",
        }}
      >
        {error}
      </div>
    )}

    <div
      style={{
        marginTop: 24,
        fontSize: 12,
        color: "#9ca3af",
        textAlign: "center",
      }}
    >
      Secure authentication with password & fingerprint
    </div>
  </div>
</div>
);
}