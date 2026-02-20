"use client";

import { useState } from "react";

export default function WebAuthnPage() {
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

      // 1. Ambil register options
      const res = await fetch(
        "http://localhost:4000/api/auth/webauthn/register/options",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to get register options");
      }

      const options = await res.json();

      // 2. Convert challenge + user id
      options.challenge = base64ToUint8Array(options.challenge);
      options.user.id = base64ToUint8Array(options.user.id);

      // 3. Trigger biometric
      const credential = await navigator.credentials.create({
        publicKey: options,
      });

      if (!credential) {
        throw new Error("Credential creation failed");
      }

      // 4. Prepare payload untuk backend
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

      // 5. Kirim ke verify endpoint
      const verifyRes = await fetch(
        "http://localhost:4000/api/auth/webauthn/register/verify",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ credential: credentialPayload }),
        }
      );

      if (!verifyRes.ok) {
        throw new Error("Verification failed");
      }

      setMessage("Fingerprint berhasil diaktifkan.");
    } catch (err) {
      console.error(err);
      setMessage("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Enable Fingerprint (2FA)</h2>

      <button
        onClick={handleEnroll}
        disabled={loading}
        style={{
          padding: "10px 20px",
          fontSize: 16,
          cursor: "pointer",
        }}
      >
        {loading ? "Processing..." : "Enable Fingerprint"}
      </button>

      {message && (
        <p style={{ marginTop: 20 }}>
          {message}
        </p>
      )}
    </div>
  );
}