"use client"

import { useSupabase } from "@/components/SupabaseProvider"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
// import { signIn } from "next-auth/react"

export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    "http://localhost:3000/"
  // Make sure to include `https://` when not localhost.
  url = url.includes("http") ? url : `https://${url}`
  // Make sure to including trailing `/`.
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`
  return url
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
