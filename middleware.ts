import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAdminAuth = request.cookies.has("admin-auth")

  // Jeśli zalogowany użytkownik wejdzie na /admin, przekieruj go do /admin/dashboard
  if (pathname === "/admin" && isAdminAuth) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }

  // Jeśli niezalogowany użytkownik próbuje wejść na chronioną ścieżkę, przekieruj go do logowania
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login") && !isAdminAuth) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  // Jeśli zalogowany użytkownik próbuje wejść na stronę logowania, przekieruj go do panelu
  if (pathname.startsWith("/admin/login") && isAdminAuth) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/admin/:path*",
}