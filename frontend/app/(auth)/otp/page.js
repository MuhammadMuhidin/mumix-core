"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAPI } from "@/lib/api.client";

export default function OtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      await fetchAPI("/auth/otp/verify", {
        method: "POST",
        body: JSON.stringify({ otp }),
      });

      router.push("/");
    } catch (err) {
      setError("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
<div
  style={{
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(to bottom, #f1f5f9, #e2e8f0)",
    padding: "64px 24px",
  }}
>
  <div
    style={{
      width: 480,
      background: "#ffffff",
      borderRadius: 20,
      padding: 48,
      border: "1px solid #e5e7eb",
      boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
      transition: "all 0.2s ease",
    }}
  >
    <div style={{ marginBottom: 32 }}>
      <h2
        style={{
          fontSize: 22,
          fontWeight: 600,
          margin: 0,
          color: "#0f172a",
          letterSpacing: "-0.3px",
        }}
      >
        Verify One-Time Password
      </h2>
      <p
        style={{
          marginTop: 12,
          fontSize: 14,
          color: "#64748b",
          lineHeight: 1.6,
        }}
      >
        We’ve sent a 6-digit code to your registered WhatsApp number.
        Enter it below to complete your login.
      </p>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        placeholder="••••••"
        style={{
          width: "100%",
          padding: "16px 20px",
          borderRadius: 14,
          border: "1px solid #cbd5e1",
          background: "#f8fafc",
          textAlign: "center",
          fontSize: 22,
          fontWeight: 500,
          letterSpacing: "8px",
          outline: "none",
          transition: "all 0.2s ease",
        }}
      />

      <button
        onClick={handleSubmit}
        disabled={loading || otp.length !== 6}
        style={{
          width: "100%",
          padding: "16px",
          borderRadius: 14,
          border: "none",
          fontSize: 15,
          fontWeight: 500,
          color: "#ffffff",
          background:
            loading || otp.length !== 6 ? "#94a3b8" : "#0f172a",
          cursor:
            loading || otp.length !== 6 ? "not-allowed" : "pointer",
          opacity: loading ? 0.8 : 1,
          transition: "all 0.2s ease",
        }}
      >
        {loading ? "Verifying..." : "Verify & Continue"}
      </button>
    </div>

    {error && (
      <div
        style={{
          marginTop: 28,
          padding: "14px 16px",
          borderRadius: 14,
          background: "#fef2f2",
          border: "1px solid #fecaca",
          color: "#b91c1c",
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        {error}
      </div>
    )}

    <div
      style={{
        marginTop: 32,
        fontSize: 12,
        color: "#94a3b8",
        textAlign: "center",
        letterSpacing: "0.4px",
      }}
    >
      Code expires in 3 minutes.
    </div>
  </div>
</div>
  );
}