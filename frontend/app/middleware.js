import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/auth/login";

  // Belum login dan bukan halaman login → redirect
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Sudah login dan buka login → redirect ke root
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};