import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const sessionId = request.cookies.get("connect.sid")?.value;
  const { pathname } = request.nextUrl;

  // -----------------------
  // AUTH LOGIN PAGES
  // -----------------------

  if (
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/webauthn/login")
  ) {
    // kalau sudah login, jangan boleh ke login page
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  // -----------------------
  // OTP PAGE
  // -----------------------

  if (pathname.startsWith("/auth/otp")) {
    // OTP boleh diakses kalau:
    // - ada session (connect.sid)
    // token boleh ada atau tidak

    if (!sessionId) {
      return NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
    }

    return NextResponse.next();
  }

  // -----------------------
  // PROTECTED ROUTES
  // -----------------------

  if (!token) {
    return NextResponse.redirect(
      new URL("/auth/login", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};