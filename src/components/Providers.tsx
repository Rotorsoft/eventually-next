"use client"

import { ThemeProvider } from "next-themes"
import { SessionProvider } from "next-auth/react"

export default function Providers({ children }: React.PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  )
}
