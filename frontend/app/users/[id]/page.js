import DeleteButton from "../../../components/DeleteButton";
import { updateUser, deleteUser } from "../../actions";
import { notFound } from "next/navigation";
import { fetchAPI } from "../../../lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getUser(id) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  return await fetchAPI(`/api/users/${id}`, {
    cache: "no-store",
    headers: {
      Cookie: `token=${token}`,
    },
  });
}


export default async function Page({ params }) {
  const resolvedParams = await params;

  const id = resolvedParams?.id;
  if (!id) notFound();

  const user = await getUser(id);
  if (!user) notFound();

  const inputStyle = {
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  fontSize: 14,
  outline: "none",
};

const primaryButton = {
  padding: "12px",
  borderRadius: 10,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};

const dangerButton = {
  padding: "12px",
  borderRadius: 10,
  border: "none",
  background: "#dc2626",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
  width: "100%",
};

return (
  <div
    style={{
      minHeight: "100vh",
      background: "#f4f6f9",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    }}
  >
    <div
      style={{
        width: 480,
        background: "#ffffff",
        padding: 32,
        borderRadius: 18,
        boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
      }}
    >
      <h2 style={{ marginBottom: 24 }}>Edit User</h2>

      <form
        action={updateUser.bind(null, user.id)}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        <input
          name="name"
          defaultValue={user.name}
          readOnly
          required
          placeholder="Full Name"
          style={inputStyle}
        />

        <input
          name="email"
          defaultValue={user.email}
          required
          placeholder="Email Address"
          style={inputStyle}
        />

        <input
          name="phone"
          defaultValue={user.phone}
          placeholder="Phone Number"
          style={inputStyle}
        />

        <input
          name="password"
          defaultValue={user.password}
          type="password"
          placeholder="Password"
          style={inputStyle}
        />

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
          }}
        >
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={Boolean(user.is_active)}
          />
          Active
        </label>

        <button type="submit" style={primaryButton}>
          Update User
        </button>
      </form>

      <div style={{ margin: "28px 0", borderTop: "1px solid #eee" }} />
      <DeleteButton action={deleteUser.bind(null, user.id)} />

    </div>
  </div>
);
}