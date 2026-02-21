"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchAPI } from "../../lib/api.client";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAPI("/api/auth/me", { method: "GET" }).catch(() => {});
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const data = await fetchAPI("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (data.requires2FA) {
        router.push("/webauthn/login");
        return;
      }

      router.replace("/");
      router.refresh();
    } catch (err) {
      setError(err.message || "Login failed");
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