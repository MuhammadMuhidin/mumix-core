import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API_URL;

if (!API) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export async function fetchAPIServer(path, options = {}) {
  const cookieStore = await cookies();
  const csrfToken = cookieStore.get("csrf_token")?.value;
  const allCookies = cookieStore.getAll();

  const cookieHeader = allCookies
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const headers = {
    "Content-Type": "application/json",
    Cookie: cookieHeader,
    ...(options.headers || {}),
  };

  if (csrfToken) {
    headers["x-csrf-token"] = csrfToken;
  }

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });
  
  const contentType = res.headers.get("content-type") || "";

  if (res.status === 401) {
    redirect("/login");
  }

  if (!contentType.includes("application/json")) {
    throw new Error("Response is not valid JSON.");
  }

  const data = await res.json();

  if (res.status === 403) {
    throw new Error(data.message || "Forbidden");
  }

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}