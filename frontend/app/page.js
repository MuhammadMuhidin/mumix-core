import UserForm from "../components/UserForm";
import UserList from "../components/UserList";
import { createUser } from "./actions";
import { fetchAPI } from "../lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getUsers() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  return await fetchAPI("/api/users", {
    headers: {
      Cookie: `token=${token}`
    }
  });
}

async function getCurrentUser() {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");

  return await fetchAPI("/api/auth/me", {
    headers: {
      Cookie: `token=${token}`
    }
  });
}

export default async function Page() {
  const currentUser = await getCurrentUser();
  const users = await getUsers();

  if (currentUser.user.role !== "admin") {
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
    <div style={{ width: 900 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: 0 }}>User Management</h1>
        <h2>Welcome, {currentUser.user.name}! you have {currentUser.user.role === "admin" ? "Administrator" : "User"} access 🔐</h2>
        <p style={{ color: "#6b7280", marginTop: 8 }}>
          Create, update, and manage system users
        </p>
      </div>

      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          marginBottom: 32,
        }}
      >
        <h3 style={{ marginBottom: 16 }}>Add New User</h3>
        <UserForm action={createUser} />
      </div>

      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        }}
      >
        <h3 style={{ marginBottom: 16 }}>User List</h3>
        <UserList users={users} />
      </div>
    </div>
  </div>
);
}