"use client"

import { useSession } from "next-auth/react"

export default function RequireAuth() {
  const session = useSession()

  return session.status === "authenticated" ? (
    <blockquote>
      You are good to go as <b>{session.data?.user?.email}</b> !
    </blockquote>
  ) : (
    <div>
      <h3>Next Step</h3>
      <blockquote>Sign in with Google</blockquote>
    </div>
  )
}
