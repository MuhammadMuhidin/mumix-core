import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API = process.env.NEXT_PRIVATE_API_URL;

if (!API) {
  throw new Error("NEXT_PRIVATE_API_URL is not defined");
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // ⛔️ Hanya cek token, bukan semua cookie
  if (!token) {
    return null;
  }

  const res = await fetch(`${API}/auth/me`, {
    headers: {
      Cookie: `token=${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  return data?.data?.user ?? null;
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();

  if (user.role !== "admin") {
    redirect("/");
  }

  return user;
}