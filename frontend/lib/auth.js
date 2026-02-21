import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchAPI } from "./api.client";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/login");
  
  try {
    const res = await fetchAPI("/api/auth/me", {
      headers: {
        Cookie: `token=${token}`,
      },
    });

    return res?.data?.user ?? null;
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "admin") redirect("/");
  return user;
}