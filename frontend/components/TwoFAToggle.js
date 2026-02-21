"use client";

import { useEffect, useState } from "react";
import Disable2FAModal from "./Disable2FAModal";

export default function TwoFAToggle() {
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDisableModal, setShowDisableModal] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      const res = await fetch(`${API}/api/auth/me`, {
        credentials: "include"
      });

      const data = await res.json();
      setEnabled(data.data.user.webauthn_enabled);
      setLoading(false);
    };

    fetchStatus();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
<div
  style={{
    background: "#ffffff",
    padding: 24,
    borderRadius: 16,
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  }}
>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 24,
    }}
  >
    <div>
      <h3 style={{ margin: 0 }}>
        Two-Factor Authentication
      </h3>

      <p
        style={{
          marginTop: 6,
          fontSize: 14,
          color: "#6b7280",
          maxWidth: 420,
        }}
      >
        Add an extra layer of security to your account using fingerprint authentication.
      </p>

      <div style={{ marginTop: 12 }}>
        {enabled ? (
          <span
            style={{
              background: "#dcfce7",
              color: "#166534",
              padding: "4px 10px",
              borderRadius: 20,
              fontSize: 12,
            }}
          >
            Enabled
          </span>
        ) : (
          <span
            style={{
              background: "#e5e7eb",
              color: "#374151",
              padding: "4px 10px",
              borderRadius: 20,
              fontSize: 12,
            }}
          >
            Disabled
          </span>
        )}
      </div>
    </div>

    <div>
      {enabled ? (
        <button
          onClick={() => setShowDisableModal(true)}
          style={{
            padding: "8px 16px",
            background: "#ef4444",
            color: "#ffffff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Disable
        </button>
      ) : (
        <button
          onClick={() => (window.location.href = "/webauthn")}
          style={{
            padding: "8px 16px",
            background: "#111827",
            color: "#ffffff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Enable
        </button>
      )}
    </div>
  </div>

  {showDisableModal && (
    <Disable2FAModal
      onClose={() => setShowDisableModal(false)}
      onSuccess={() => {
        setEnabled(false);
        setShowDisableModal(false);
      }}
    />
  )}
</div>
  );
}