"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL;

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
    headers: { "Content-Type": "application/json" },
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  revalidatePath("/");
  redirect("/");
}

export async function deleteUser(id) {
  await fetch(`${API}/api/users/${id}`, {
    method: "DELETE"
  });

  revalidatePath("/");
  redirect("/");
}