"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAPI } from "../../../lib/api.client";

export default function WebAuthnPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const base64ToUint8Array = (base64) => {
    const padding = "=".repeat((4 - (base64.length % 4)) % 4);
    const base64Safe = (base64 + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64Safe);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
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

  const handleEnroll = async () => {
    try {
      setLoading(true);
      setMessage("");

      // 1️⃣ Ambil register options (CSRF otomatis)
      const options = await fetchAPI(
        "/auth/webauthn/register/options",
        {
          method: "POST",
        }
      );

      // 2️⃣ Convert challenge + user id
      options.challenge = base64ToUint8Array(options.challenge);
      options.user.id = base64ToUint8Array(options.user.id);

      // 3️⃣ Trigger biometric
      const credential = await navigator.credentials.create({
        publicKey: options,
      });

      if (!credential) {
        throw new Error("Credential creation failed");
      }

      const credentialPayload = {
        id: credential.id,
        rawId: arrayBufferToBase64Url(credential.rawId),
        type: credential.type,
        response: {
          attestationObject: arrayBufferToBase64Url(
            credential.response.attestationObject
          ),
          clientDataJSON: arrayBufferToBase64Url(
            credential.response.clientDataJSON
          ),
        },
      };

      // 4️⃣ Verify ke backend (CSRF otomatis)
      await fetchAPI(
        "/auth/webauthn/register/verify",
        {
          method: "POST",
          body: JSON.stringify({
            credential: credentialPayload,
          }),
        }
      );

      setMessage("Success: Fingerprint berhasil diaktifkan.");
      router.push("/profile");
    } catch (err) {
      console.error(err);
      setMessage("Error: " + (err.message || "Enrollment failed"));
    } finally {
      setLoading(false);
    }
  };

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
          width: 480,
          background: "#ffffff",
          borderRadius: 16,
          padding: 40,
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ margin: 0 }}>
            Enable Fingerprint (2FA)
          </h2>
          <p
            style={{
              marginTop: 8,
              fontSize: 14,
              color: "#6b7280",
              lineHeight: 1.6,
            }}
          >
            Add an extra layer of security by enabling fingerprint authentication
            for your account.
          </p>
        </div>

        <button
          onClick={handleEnroll}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px 16px",
            background: "#111827",
            color: "#ffffff",
            border: "none",
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 500,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Processing..." : "Enable Fingerprint"}
        </button>

        {message && (
          <div
            style={{
              marginTop: 24,
              padding: "12px 14px",
              borderRadius: 8,
              background:
                message.toLowerCase().includes("success")
                  ? "#ecfdf5"
                  : "#fef2f2",
              border:
                message.toLowerCase().includes("success")
                  ? "1px solid #a7f3d0"
                  : "1px solid #fecaca",
              color:
                message.toLowerCase().includes("success")
                  ? "#065f46"
                  : "#b91c1c",
              fontSize: 14,
            }}
          >
            {message}
          </div>
        )}

        <div
          style={{
            marginTop: 28,
            fontSize: 12,
            color: "#9ca3af",
            textAlign: "center",
          }}
        >
          Your fingerprint data is securely stored and encrypted.
        </div>
      </div>
    </div>
  );
}