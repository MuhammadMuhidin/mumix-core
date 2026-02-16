const API = process.env.NEXT_PUBLIC_API_URL;

export async function fetchAPI(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    cache: "no-store",
    ...options
  });

const data = await res.json();
try {
  if (res.ok) return data.data;
  throw new Error(data.message);
} catch (err) {
  throw new Error(err.message);
}
}