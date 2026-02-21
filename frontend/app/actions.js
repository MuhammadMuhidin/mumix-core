"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API_URL;

if (!API) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

function normalizePayload(formData) {
  const payload = Object.fromEntries(formData);

  if ("is_active" in payload) {
    payload.is_active = payload.is_active === "true";
  }

  return payload;
}

async function getServerHeaders() {
  const cookieStore = await cookies();

  const csrfToken = cookieStore.get("csrf_token")?.value;
  const cookieHeader = cookieStore
    .getAll()
    .map(c => `${c.name}=${c.value}`)
    .join("; ");

  if (!csrfToken) {
    throw new Error("Missing CSRF token");
  }

  return {
    "Content-Type": "application/json",
    "x-csrf-token": csrfToken,
    "Cookie": cookieHeader,
  };
}

async function handleResponse(res) {
  const contentType = res.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    throw new Error("Response is not valid JSON");
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export async function createUser(formData) {
  const payload = normalizePayload(formData);

  const res = await fetch(`${API}/api/users`, {
    method: "POST",
    headers: await getServerHeaders(),
    body: JSON.stringify(payload),
    credentials: "include",
  });

  await handleResponse(res);

  revalidatePath("/users");
  redirect("/users");
}

export async function updateUser(id, formData) {
  const payload = normalizePayload(formData);

  const res = await fetch(`${API}/api/users/${id}`, {
    method: "PUT",
    headers: await getServerHeaders(),
    body: JSON.stringify(payload),
    credentials: "include",
  });

  await handleResponse(res);

  revalidatePath("/users");
  redirect("/users");
}

export async function deleteUser(id) {
  const res = await fetch(`${API}/api/users/${id}`, {
    method: "DELETE",
    headers: await getServerHeaders(),
    credentials: "include",
  });

  await handleResponse(res);

  revalidatePath("/users");
  redirect("/users");
}