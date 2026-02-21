"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function WebAuthnLoginPage() {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL;

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
        const meRes = await fetch(`${API}/api/auth/me`, {
          credentials: "include"
        });

        if (meRes.ok) {
          router.push("/");
          return;
        }

        const res = await fetch(
          `${API}/api/auth/webauthn/login/options`,
          {
            method: "POST",
            credentials: "include"
          }
        );
        
        if (!res.ok) {
          router.push("/login");
          return;
        }

        const options = await res.json();

        options.challenge = base64ToUint8Array(options.challenge);
        options.allowCredentials = options.allowCredentials.map((cred) => ({
          ...cred,
          id: base64ToUint8Array(cred.id)
        }));

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

        const verifyRes = await fetch(
          `${API}/api/auth/webauthn/login/verify`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ credential: credentialPayload })
          }
        );

        if (!verifyRes.ok) {
          throw new Error();
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