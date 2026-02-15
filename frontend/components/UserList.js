import DeleteButton from "./DeleteButton";
import Link from "next/link";
import { deleteUser } from "../app/actions";

export default function UserList({ users }) {
  if (!users?.length) {
    return (
      <div style={{ color: "#6b7280" }}>
        No users found.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {users.map((u) => (
        <div
          key={u.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 16,
            borderRadius: 14,
            border: "1px solid #e5e7eb",
            background: "#ffffff",
          }}
        >
          <div>
            <Link
              href={`/users/${u.id}`}
              style={{
                fontWeight: 600,
                textDecoration: "none",
                color: "#111827",
              }}
            >
              {u.name}
            </Link>

            <div style={{ marginTop: 6 }}>
              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 500,
                  background: u.is_active ? "#dcfce7" : "#fee2e2",
                  color: u.is_active ? "#166534" : "#991b1b",
                }}
              >
                {u.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

        <DeleteButton action={deleteUser.bind(null, u.id)} />
        </div>
      ))}
    </div>
  );
}