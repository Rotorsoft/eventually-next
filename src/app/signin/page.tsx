"use client"

import { useSupabase } from "@/components/SupabaseProvider"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
// import { signIn } from "next-auth/react"

const getURL = () => {
  console.log("env", JSON.stringify(process.env))
  console.log("origin", window?.origin)

  return (
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    window?.origin ??
    "http://localhost:3000"
  )
}

export default function SignIn() {
  // TODO: Next-Auth signin ui
  // signIn("google", { callbackUrl: "/dashboard" })

  const supabase = useSupabase()
  return (
    <div className="flex justify-center height-screen-helper">
      <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 ">
        <Auth
          supabaseClient={supabase}
          providers={["google"]}
          redirectTo={`${getURL()}/auth/callback`}
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
