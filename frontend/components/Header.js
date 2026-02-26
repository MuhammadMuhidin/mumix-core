"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default function Header() {
  const pathname = usePathname();

  const showLogout = pathname === "/";

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 24px",
        borderBottom: "1px solid #e5e7eb",
        background: "#fff",
      }}
    >
    <Link
      href="/"
      style={{
        fontWeight: 800,
        fontSize: "28px",
        color: "black",
        textDecoration: "none",
      }}
    >
      Mumix
    </Link>

      {showLogout && <LogoutButton />}
    </header>
  );
}