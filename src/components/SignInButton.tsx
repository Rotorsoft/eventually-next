"use client"

import { useSupabase } from "@/components/SupabaseProvider"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import GoogleLogo from "./logos/GoogleLogo"
// import { signIn } from "next-auth/react"

export default function SignInButton() {
  const router = useRouter()
  const supabase = useSupabase()

  async function signIn() {
    // Next-Auth
    // signIn("google", { callbackUrl: "/dashboard" })

    // Supabase
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
    router.replace("/")
  }

  return (
    <Button className="ml-3" variant="outline" onClick={signIn}>
      <span className="mr-2">
        <GoogleLogo />
      </span>
      Sign In
    </Button>
  )
}
