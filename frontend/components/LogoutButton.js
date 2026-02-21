"use client";

import { useRouter } from "next/navigation";
import { fetchAPI } from "../lib/api.client";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetchAPI("/api/auth/logout", {
        method: "POST",
      });

      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: "8px 16px",
        background: "#ef4444",
        color: "#fff",
        border: "none",
        borderRadius: 8,
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  );
}