import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const protectedRoutes = ["/dashboard"]
const authRoutes = ["/auth/login"]
const allowedIPS = process.env.ALLOWED_ADMINS_IPS ? JSON.parse(process.env.ALLOWED_ADMINS_IPS) : []

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (allowedIPS.length > 0) {
    console.log("Client IP:", allowedIPS)

    if (pathname.startsWith("/dashboard")) {
      const clientIP = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || ""

      if (clientIP && !allowedIPS.includes(clientIP)) {
        console.log(`Access denied for IP: ${clientIP}`)
        return NextResponse.redirect(new URL("/", request.url))
      }
    }
  }

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
  if (pathname.startsWith("/dashboard") && session?.user?.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/login"],
}
