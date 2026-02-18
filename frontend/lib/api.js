import { redirect } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL;

if (!API) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export async function fetchAPI(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    cache: "no-store",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (res.status === 401) {
    redirect("/login");
  }

  if (res.status === 403) {
    throw new Error(data.message || "Account disabled");
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error("Response is not valid JSON.");
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data.data
}