"use client"

import { useSupabase } from "@/components/SupabaseProvider"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { useEffect, useRef } from "react"
// import { signIn } from "next-auth/react"

export default function SignIn() {
  // TODO: Next-Auth signin ui
  // signIn("google", { callbackUrl: "/dashboard" })

  const supabase = useSupabase()
  const host = useRef<string>()

  useEffect(() => {
    const url = window.location.href
    host.current = url.substring(
      0,
      url.length - window.location.pathname.length
    )
  }, [])

  return (
    <div className="flex justify-center height-screen-helper">
      <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 ">
        <Auth
          supabaseClient={supabase}
          providers={["google"]}
          redirectTo={`${host.current}/auth/callback`}
          magicLink={true}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "#404040",
                  brandAccent: "#52525b",
                },
              },
            },
          }}
          theme="dark"
        />
      </div>
    </div>
  )
}
