import UserForm from "../components/UserForm";
import UserList from "../components/UserList";
import Pagination from "../components/Pagination";
import SearchInput from "../components/SearchInput";  
import { createUser } from "./actions";
import { fetchAPI } from "../lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getUsers({ page, limit, search, sortBy, sortOrder }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/login");

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search: search || "",
    sortBy: sortBy || "id",
    sortOrder: sortOrder || "asc",
  });

  return await fetchAPI(`/api/users?${params.toString()}`, {
    headers: {
      Cookie: `token=${token}`,
    },
  });
  
}

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

export default async function Page({ searchParams: searchParamsPromise }) {
  const searchParams = await searchParamsPromise;
  const rawPage = searchParams?.page;
  const page = Number(rawPage ?? 1);
  const limit = Number(searchParams?.limit) || 5;
  const search = searchParams?.search || "";
  const sortBy = searchParams?.sortBy || "id";
  const sortOrder = searchParams?.sortOrder || "asc";

  const currentUser = await getCurrentUser();

  if (currentUser.data.user.role !== "admin") {
    redirect("/");
  }

  const usersResult = await getUsers({ page, limit, search, sortBy, sortOrder });

  const users = usersResult?.data ?? [];
  const meta = usersResult?.meta;

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
        <h2>Welcome, {currentUser.data.user.name}! you have {currentUser.data.user.role === "admin" ? "Administrator" : "User"} access 🔐</h2>
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
        <SearchInput />
        <UserList users={users} />
        <Pagination meta={meta} searchParams={searchParams} />
      </div>
    </div>
  </div>
);
}