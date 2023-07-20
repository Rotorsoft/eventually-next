"use client"

import { useSession } from "@/components/SupabaseProvider"
// import { useSession } from "next-auth/react"

export default function RequireAuth() {
  const session = useSession()

  // Next-Auth
  // const isAuth = session.status === "authenticated"
  // const email = session.data?.user?.email

  // Supabase
  const isAuth = session
  const email = session?.user.email

  return isAuth ? (
    <blockquote>
      You are good to go as <b>{email}</b> !
    </blockquote>
  ) : (
    <div>
      <h3>Next Step</h3>
      <blockquote>Sign in with Google</blockquote>
    </div>
  )
}
