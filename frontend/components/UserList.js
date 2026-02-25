import DeleteButton from "./DeleteButton";
import Link from "next/link";
import { deleteUser } from "@/lib/actions";

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
      {users.map((u) => {
        const isActive = u.is_active === true || u.is_active === "true";

        return (
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
                href={`/users/${u.id}/edit`}
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
                    background: isActive ? "#dcfce7" : "#fee2e2",
                    color: isActive ? "#166534" : "#991b1b",
                  }}
                >
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <DeleteButton action={deleteUser.bind(null, u.id)} />
          </div>
        );
      })}
    </div>
  );
}
