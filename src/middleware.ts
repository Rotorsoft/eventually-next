// Next-Auth
// import { getToken } from "next-auth/jwt"
// import { withAuth } from "next-auth/middleware"
// import { NextResponse } from "next/server"

// export default withAuth(
//   async function middleware(req) {
//     //const pathname = req.nextUrl.pathname // relative path
//     //console.log(req.url, req.headers.get("cookie"))
//     const token = await getToken({ req })
//     if (!token) return NextResponse.redirect(new URL("/", req.url))
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => !!token,
//     },
//   }
// )

// export const config = {
//   matcher: ["/dashboard/:path*", "/command/:path*"],
// }

// Supabase
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  const { data } = await supabase.auth.getSession()

  // protected routes
  const { pathname } = req.nextUrl
  if (!data.session && pathname.startsWith("/dashboard"))
    return NextResponse.redirect(new URL("/", req.url))

  return res
}
