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

  const text = await res.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Server returned non-JSON response");
  }

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data.data;
}