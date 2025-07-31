import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAdminAuth = request.cookies.has("admin-auth")

  // If trying to access a protected admin route without auth, redirect to login
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login") && !isAdminAuth) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  // If trying to access login page while already authenticated, redirect to dashboard
  if (pathname.startsWith("/admin/login") && isAdminAuth) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/admin/:path*",
}
