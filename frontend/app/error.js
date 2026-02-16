"use client";

export default function Error({ error }) {
  return (
    <div style={{ padding: 40 }}>
      <h2>Something went wrong</h2>
      <p style={{ color: "#6b7280" }}>
        {error.message}
      </p>
    </div>
  );
}