import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const protectedRoutes = ["/(admin)/dashboard"]
const authRoutes = ["/auth/login"]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // Если пользователь не авторизован и пытается зайти на защищённую страницу
  if (isProtectedRoute && !session?.user) {
    const loginUrl = new URL("/auth/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Если пользователь авторизован и пытается зайти на страницу входа
  if (isAuthRoute && session?.user) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Проверка на роль админа для admin маршрутов
  if (pathname.startsWith("/(admin)/dashboard") && session?.user?.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/(admin)/dashboard/:path*", "/api/protected/:path*", "/auth/login"],
}
