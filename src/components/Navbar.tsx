"use client"

import Icons from "@/components/Icons"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signIn, signOut, useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const pathname = usePathname()
  const session = useSession()
  const { theme, setTheme } = useTheme()

  const isLight = theme === "light"
  const isAuth = session.status === "authenticated"

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
              <AvatarImage src={session.data.user?.image || ""} />
              <AvatarFallback>
                {session.data.user?.name?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button
              className="ml-3"
              variant="outline"
              onClick={() =>
                signOut({
                  callbackUrl: "/",
                })
              }
            >
              Sign Out
            </Button>
          </>
        ) : (
          <Button
            className="ml-3"
            variant="outline"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            Sign In
          </Button>
        )}
      </div>
    </div>
  )
}
