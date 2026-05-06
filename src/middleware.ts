import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 保护 /admin 和 /profile 路由
  if (pathname.startsWith("/admin") || pathname.startsWith("/profile")) {
    const session = await getSession()

    if (!session.userId) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    if (pathname.startsWith("/admin") && session.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*"],
}
