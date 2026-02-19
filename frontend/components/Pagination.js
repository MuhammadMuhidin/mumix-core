import Link from "next/link";

export default function Pagination({ meta, searchParams }) {
  if (!meta || meta.totalPage <= 1) return null;

  const currentPage = meta.page;
  const totalPage = meta.totalPage;

  const createPageLink = (page) => {
    const params = new URLSearchParams();

    Object.entries(searchParams || {}).forEach(([key, value]) => {
    if (value !== undefined) {
    params.set(key, String(value));
    }
    });

    params.set("page", String(page));
    return `?${params.toString()}`;
  };

  // Windowed pagination (±2 dari current)
  const generatePages = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPage, currentPage + 2);

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPage) {
      if (end < totalPage - 1) pages.push("...");
      pages.push(totalPage);
    }

    return pages;
  };

  const pages = generatePages();

  const baseButton = {
    minWidth: 36,
    height: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    textDecoration: "none",
    fontSize: 14,
    border: "1px solid #e5e7eb",
  };

  return (
    <div
      style={{
        marginTop: 32,
        display: "flex",
        justifyContent: "center",
        gap: 8,
        alignItems: "center",
      }}
    >
      {/* Prev */}
      {meta.hasPrev ? (
        <Link
          href={createPageLink(currentPage - 1)}
          style={{
            ...baseButton,
            background: "#fff",
            color: "#111",
          }}
        >
          Prev
        </Link>
      ) : (
        <span
          style={{
            ...baseButton,
            opacity: 0.4,
            pointerEvents: "none",
            background: "#f3f4f6",
          }}
        >
          Prev
        </span>
      )}

      {/* Page Numbers */}
      {pages.map((p, index) =>
        p === "..." ? (
          <span key={index} style={{ padding: "0 6px" }}>
            ...
          </span>
        ) : (
          <Link
            key={p}
            href={createPageLink(p)}
            style={{
              ...baseButton,
              background: p === currentPage ? "#111" : "#fff",
              color: p === currentPage ? "#fff" : "#111",
              fontWeight: p === currentPage ? 600 : 400,
              pointerEvents: p === currentPage ? "none" : "auto",
            }}
          >
            {p}
          </Link>
        )
      )}

      {/* Next */}
      {meta.hasNext ? (
        <Link
          href={createPageLink(currentPage + 1)}
          style={{
            ...baseButton,
            background: "#fff",
            color: "#111",
          }}
        >
          Next
        </Link>
      ) : (
        <span
          style={{
            ...baseButton,
            opacity: 0.4,
            pointerEvents: "none",
            background: "#f3f4f6",
          }}
        >
          Next
        </span>
      )}
    </div>
  );
}