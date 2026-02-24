"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") || "";

  const [value, setValue] = useState(currentSearch);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }

      router.replace(`?${params.toString()}`);
    }, 400); // debounce 400ms

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      type="text"
      placeholder="Search user..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      style={{
        width: "100%",
        padding: "10px 14px",
        borderRadius: 8,
        border: "1px solid #e5e7eb",
        marginBottom: 20,
        fontSize: 14,
      }}
    />
  );
}
