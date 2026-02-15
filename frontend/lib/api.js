const API = process.env.NEXT_PUBLIC_API_URL;

export async function fetchAPI(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    cache: "no-store",
    ...options
  });

  if (!res.ok) {
    throw new Error("API Error");
  }

  return res.json();
}