"use client"

import { useSession } from "@/components/SupabaseProvider"
import SignInButton from "./SignInButton"
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
      <blockquote className="flex items-center">
        <span>Sign in with Google</span>
        <SignInButton />
      </blockquote>
    </div>
  )
}
