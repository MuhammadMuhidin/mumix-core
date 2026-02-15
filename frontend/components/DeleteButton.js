"use client";

export default function DeleteButton({ action }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Yakin ingin menghapus user ini?")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        style={{
          padding: "12px",
          borderRadius: 10,
          border: "none",
          background: "#dc2626",
          color: "#fff",
          fontWeight: 600,
          cursor: "pointer",
          width: "100%",
        }}
      >
        Delete User
      </button>
    </form>
  );
}