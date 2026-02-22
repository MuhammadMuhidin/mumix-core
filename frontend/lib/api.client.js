const API = process.env.NEXT_PUBLIC_API_URL;

if (!API) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

function getCookie(name) {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(
    new RegExp("(^| )" + name + "=([^;]+)")
  );

  return match ? match[2] : null;
}

export async function fetchAPI(path, options = {}) {
  const csrfToken = getCookie("csrf_token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (csrfToken) {
    headers["x-csrf-token"] = csrfToken;
  }

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers,
    credentials: "include", // browser only
  });

  const contentType = res.headers.get("content-type") || "";

  if (res.status === 401) {
    throw new Error("Unauthorized");
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