import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  async function middleware(req) {
    //const pathname = req.nextUrl.pathname // relative path
    //console.log(req.url, req.headers.get("cookie"))
    const token = await getToken({ req })
    if (!token) return NextResponse.redirect(new URL("/", req.url))
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ["/dashboard/:path*", "/command/:path*"],
}
