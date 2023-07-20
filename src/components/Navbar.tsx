"use client"

import Icons from "@/components/Icons"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "@/components/SupabaseProvider"
// import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { usePathname } from "next/navigation"
import SignInButton from "@/components/SignInButton"
import SignOutButton from "@/components/SignOutButton"

export default function Navbar() {
  const pathname = usePathname()
  const session = useSession()
  const { theme, setTheme } = useTheme()

  const isLight = theme === "light"

  // Next-Auth
  // const isAuth = session.status === "authenticated"
  // const username = session.data.user?.name?.substring(0, 2).toUpperCase()
  // const image = session.data.user?.image

  // Supabase
  const isAuth = session
  const username = session?.user.email
  const image = session?.user.user_metadata["picture"]

  return (
    <div className="p-3 border-b border-slate-300 dark:border-slate-700 w-full flex justify-between items-center">
      <div className="flex items-center">
        <Button
          className="mr-3"
          variant="ghost"
          onClick={() => setTheme(isLight ? "dark" : "light")}
        >
          {isLight ? <Icons.Moon /> : <Icons.Sun />}
        </Button>

        {pathname === "/dashboard" ? (
          <Button variant="ghost" asChild>
            <Link href="/">
              <Icons.Home />
            </Link>
          </Button>
        ) : isAuth ? (
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <Icons.Table />
            </Link>
          </Button>
        ) : null}
      </div>

      <div className="flex items-center">
        {isAuth ? (
          <>
            <Avatar>
              <AvatarImage src={image || ""} />
              <AvatarFallback>{username}</AvatarFallback>
            </Avatar>
            <SignOutButton />
          </>
        ) : (
          <SignInButton />
        )}
      </div>
    </div>
  )
}
