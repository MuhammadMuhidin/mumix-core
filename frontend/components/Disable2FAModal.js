"use client";

import { useState } from "react";

export default function Disable2FAModal({ onClose, onSuccess }) {
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const base64ToUint8Array = (base64) => {
    const padding = "=".repeat((4 - (base64.length % 4)) % 4);
    const base64Safe = (base64 + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const raw = window.atob(base64Safe);
    return Uint8Array.from(raw, c => c.charCodeAt(0));
  };

  const arrayBufferToBase64Url = (buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return window
      .btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  };

  const handleDisable = async () => {
    try {
      setLoading(true);
      setError("");

      // 1️⃣ Ambil challenge re-auth
      const res = await fetch(
        `${API}/api/auth/webauthn/disable/options`,
        {
          method: "POST",
          credentials: "include"
        }
      );

      const options = await res.json();

      options.challenge = base64ToUint8Array(options.challenge);
      options.allowCredentials = options.allowCredentials.map((cred) => ({
        ...cred,
        id: base64ToUint8Array(cred.id)
      }));

      // 2️⃣ Trigger fingerprint
      const assertion = await navigator.credentials.get({
        publicKey: options
      });

      const credentialPayload = {
        id: assertion.id,
        rawId: arrayBufferToBase64Url(assertion.rawId),
        type: assertion.type,
        response: {
          authenticatorData: arrayBufferToBase64Url(
            assertion.response.authenticatorData
          ),
          clientDataJSON: arrayBufferToBase64Url(
            assertion.response.clientDataJSON
          ),
          signature: arrayBufferToBase64Url(
            assertion.response.signature
          ),
          userHandle: assertion.response.userHandle
            ? arrayBufferToBase64Url(assertion.response.userHandle)
            : null
        }
      };

      // 3️⃣ Kirim password + credential
      const verifyRes = await fetch(
        `${API}/api/auth/webauthn/disable/verify`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            password,
            credential: credentialPayload
          })
        }
      );

      if (!verifyRes.ok) {
        throw new Error("Re-authentication failed");
      }

      onSuccess();
    } catch (err) {
      setError("Password atau fingerprint salah.");
    } finally {
      setLoading(false);
    }
  };

return (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(17,24,39,0.45)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      zIndex: 1000,
    }}
  >
    <div
      style={{
        width: 480,
        background: "#ffffff",
        borderRadius: 16,
        padding: 36,
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 600,
          }}
        >
          Disable Two-Factor Authentication
        </h2>

        <p
          style={{
            marginTop: 10,
            color: "#6b7280",
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          You are about to remove fingerprint protection from your account.
          Please confirm your password and fingerprint to continue.
        </p>
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: "#e5e7eb",
          marginBottom: 24,
        }}
      />

      {/* Password Input */}
      <div>
        <label
          style={{
            fontSize: 14,
            fontWeight: 500,
            display: "block",
            marginBottom: 8,
            color: "#374151",
          }}
        >
          Account Password
        </label>

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 8,
            border: "1px solid #d1d5db",
            fontSize: 14,
          }}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            marginTop: 18,
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

      {/* Buttons */}
      <div
        style={{
          marginTop: 32,
          display: "flex",
          justifyContent: "flex-end",
          gap: 12,
        }}
      >
        <button
          onClick={onClose}
          style={{
            padding: "9px 18px",
            background: "#e5e7eb",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Cancel
        </button>

        <button
          onClick={handleDisable}
          disabled={loading || !password}
          style={{
            padding: "9px 18px",
            background: "#ef4444",
            color: "#ffffff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 500,
            opacity: loading || !password ? 0.6 : 1,
          }}
        >
          {loading ? "Verifying..." : "Confirm & Disable"}
        </button>
      </div>
    </div>
  </div>
);
}
