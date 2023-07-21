import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

// The `/auth/callback` route is required for the server-side auth flow implemented
// by the Auth Helpers package. It exchanges an auth code for the user's session.
// https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-sign-in-with-code-exchange
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")
  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }
  return NextResponse.redirect(new URL("/", req.url))
}
