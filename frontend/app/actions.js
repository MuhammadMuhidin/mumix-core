"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API_URL;

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    throw new Error("Unauthorized");
  }
  return {
    "Content-Type": "application/json",
    Cookie: `token=${token}`
  };
}

function normalizePayload(formData) {
  const payload = Object.fromEntries(formData);

  // 🔥 FIX: paksa boolean murni
  if ("status" in payload) {
    payload.status = payload.status === "true";
  }

  return payload;
}

export async function createUser(formData) {
  const payload = normalizePayload(formData);

  await fetch(`${API}/api/users`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify(payload)
  });

  revalidatePath("/users");
  redirect("/users");
}

export async function updateUser(id, formData) {
  const payload = normalizePayload(formData);

  await fetch(`${API}/api/users/${id}`, {
    method: "PUT",
    headers: await getAuthHeaders(),
    body: JSON.stringify(payload)
  });

  revalidatePath("/users");
  redirect("/users");
}

export async function deleteUser(id) {
  await fetch(`${API}/api/users/${id}`, {
    method: "DELETE",
    headers: await getAuthHeaders()
  });

  revalidatePath("/users");
  redirect("/users");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  redirect("/login");
}
