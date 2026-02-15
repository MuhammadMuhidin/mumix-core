"use client";

export default function Error({ error, reset }) {
  return (
    <div style={{ padding: 40 }}>
      <h2>Something went wrong</h2>
      <button onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}