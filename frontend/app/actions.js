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

export async function createUser(formData) {
  const payload = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    is_active: formData.get("is_active") === "on"
  };

  await fetch(`${API}/api/users`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify(payload)
  });

  revalidatePath("/");
  redirect("/");
}

export async function updateUser(id, formData) {
  const payload = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    is_active: formData.get("is_active") === "on"
  };

  await fetch(`${API}/api/users/${id}`, {
    method: "PUT",
    headers: await getAuthHeaders(),
    body: JSON.stringify(payload)
  });

  revalidatePath("/");
  redirect("/");
}

export async function deleteUser(id) {
  await fetch(`${API}/api/users/${id}`, {
    method: "DELETE",
    headers: await getAuthHeaders()
  });

  revalidatePath("/");
  redirect("/");
}