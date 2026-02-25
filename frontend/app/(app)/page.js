import Link from "next/link";
import { requireAuth } from "@/lib/auth";

export default async function HomePage() {
  const user = await requireAuth();

  return (
<div
  style={{
    minHeight: "100vh",
    background: "#f4f6f9",
    padding: 40,
    display: "flex",
    justifyContent: "center",
  }}
>
  <div style={{ width: 900 }}>

    {/* Header */}
    <div style={{ marginBottom: 32 }}>
      <h1 style={{ margin: 0 }}>Welcome</h1>
      <p
        style={{
          marginTop: 8,
          color: "#6b7280",
        }}
      >
        This is the main page.
      </p>
    </div>

    {/* Card */}
    <div
      style={{
        background: "#ffffff",
        padding: 24,
        borderRadius: 16,
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        display: "flex",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      {user?.role === "admin" && (
        <Link
          href="/users"
          style={{
            padding: "10px 16px",
            backgroundColor: "#111827",
            color: "#ffffff",
            textDecoration: "none",
            borderRadius: 8,
            display: "inline-block",
          }}
        >
          User Management
        </Link>
      )}

      <Link
        href="/profile"
        style={{
          padding: "10px 16px",
          backgroundColor: "#111827",
          color: "#ffffff",
          textDecoration: "none",
          borderRadius: 8,
          display: "inline-block",
        }}
      >
        Profile Dashboard
      </Link>
    </div>

  </div>
</div>
  );
}