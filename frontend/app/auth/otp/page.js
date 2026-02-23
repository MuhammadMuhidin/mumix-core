"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAPI } from "../../../lib/api.client";

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
<div className="min-h-screen flex items-center justify-center bg-slate-100 px-6 py-12">
  <div className="w-[480px] bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.06)] p-10">
    
    <div className="mb-7">
      <h2 className="text-xl font-semibold text-slate-900 m-0">
        Verify One-Time Password
      </h2>
      <p className="mt-2 text-sm text-slate-500 leading-relaxed">
        We’ve sent a 6-digit code to your registered WhatsApp number.
        Enter it below to complete your login.
      </p>
    </div>

    <div className="space-y-4">
      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        placeholder="••••••"
        className="
          w-full
          border border-slate-300
          focus:border-slate-900
          focus:ring-2 focus:ring-slate-900/10
          rounded-lg
          px-4 py-3
          text-center
          tracking-widest
          text-lg
          outline-none
          transition
        "
      />

      <button
        onClick={handleSubmit}
        disabled={loading || otp.length !== 6}
        className={`
          w-full py-3 rounded-lg text-white font-medium transition
          ${
            loading || otp.length !== 6
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-slate-900 hover:bg-slate-800"
          }
        `}
      >
        {loading ? "Verifying..." : "Verify & Continue"}
      </button>
    </div>

    {error && (
      <div className="mt-6 rounded-lg px-4 py-3 border border-red-200 bg-red-50">
        <p className="text-sm text-red-700">
          {error}
        </p>
      </div>
    )}

    <div className="mt-7 text-xs text-slate-400 text-center">
      Code expires in 3 minutes.
    </div>
  </div>
</div>
  );
}