import { cookies } from "next/headers";

const API = process.env.NEXT_PRIVATE_API_URL;

if (!API) {
  throw new Error("NEXT_PRIVATE_API_URL is not defined");
}

export async function fetchAPIServer(path, options = {}) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  const data = await res.json();
  const contentType = res.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    throw new Error("Response is not valid JSON.");
  }

  if (res.status === 401) {
    throw new Error("Unauthorized");
  }

  if (res.status === 403) {
    throw new Error(data.message || "Forbidden");
  }

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}