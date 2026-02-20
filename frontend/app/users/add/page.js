import UserForm from "../../../components/UserForm";
import { createUser } from "../../actions";
import { fetchAPI } from "../../../lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/login");

  return await fetchAPI("/api/auth/me", {
    headers: {
      Cookie: `token=${token}`,
    },
  });
}

export default async function Page() {
  const currentUser = await getCurrentUser();

  if (currentUser.data.user.role !== "admin") {
    redirect("/");
  }

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
      <div style={{ width: 600 }}>
        <div
          style={{
            background: "#fff",
            padding: 24,
            borderRadius: 16,
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          }}
        >
          <h3 style={{ marginBottom: 16 }}>Add New User</h3>
          <UserForm action={createUser} />
        </div>
      </div>
    </div>
  );
}