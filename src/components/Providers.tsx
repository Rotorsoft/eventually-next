"use client"

import { ThemeProvider } from "next-themes"
import { SupabaseProvider } from "@/components/SupabaseProvider"
// import { SessionProvider } from "next-auth/react"

export default function Providers({ children }: React.PropsWithChildren) {
  return (
    // Next-Auth with Prisma
    // <ThemeProvider attribute="class" defaultTheme="dark">
    //   <SessionProvider>{children}</SessionProvider>
    // </ThemeProvider>

    // Supabase
    <ThemeProvider attribute="class" defaultTheme="dark">
      <SupabaseProvider>{children}</SupabaseProvider>
    </ThemeProvider>
  )
}
