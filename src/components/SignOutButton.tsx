"use client"

import { useSupabase } from "@/components/SupabaseProvider"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
// import { signOut } from "next-auth/react"

export default function SignOutButton() {
  const router = useRouter()
  const supabase = useSupabase()

  return (
    <Button
      className="ml-3"
      variant="outline"
      onClick={async () => {
        await supabase.auth.signOut()
        router.replace("/")
      }}
    >
      Sign Out
    </Button>
  )
}
