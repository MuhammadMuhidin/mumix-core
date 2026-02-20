import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Welcome</h1>
      <p>This is the main page.</p>

      <Link
        href="/users"
        style={{
          display: "inline-block",
          marginTop: 16,
          padding: "10px 16px",
          backgroundColor: "#111827",
          color: "#ffffff",
          textDecoration: "none",
          borderRadius: 6,
        }}
      >
        Go to User Dashboard
      </Link>
    </div>
  );
}