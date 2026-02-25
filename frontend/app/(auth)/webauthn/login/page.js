"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAPI } from "@/lib/api.client";

export default function WebAuthnLoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Verifying fingerprint...");

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

  useEffect(() => {
    const run2FA = async () => {
      try {
        // 1️⃣ cek apakah sudah login
        try {
          await fetchAPI("/auth/me", {
            method: "GET",
          });
          router.push("/");
          return;
        } catch {
          // lanjut ke 2FA
        }

        // 2️⃣ ambil challenge (CSRF otomatis)
        const options = await fetchAPI(
          "/auth/webauthn/login/options",
          {
            method: "POST",
          }
        );

        options.challenge = base64ToUint8Array(options.challenge);
        options.allowCredentials = options.allowCredentials.map((cred) => ({
          ...cred,
          id: base64ToUint8Array(cred.id),
        }));

        const assertion = await navigator.credentials.get({
          publicKey: options,
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
              : null,
          },
        };

        // 3️⃣ verifikasi credential (CSRF otomatis)
        const res = await fetchAPI(
          "/auth/webauthn/login/verify",
          {
            method: "POST",
            body: JSON.stringify({
              credential: credentialPayload,
            }),
          }
        );

        if (res.requiresOTP) {
          router.push("/otp");
          return;
        }
        
        router.push("/");
      } catch {
        setMessage("Fingerprint verification failed.");
      }
    };

    run2FA();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-white p-10 rounded-xl shadow-xl">
        <h2 className="text-xl font-semibold">
          {message}
        </h2>
      </div>
    </div>
  );
}