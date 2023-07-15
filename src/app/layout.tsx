import Navbar from "@/components/Navbar"
import Providers from "@/components/Providers"
import { Toaster } from "@/components/ui/toaster"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Eventually Next",
  description: "NextJs + Eventually App",
}

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="container my-4">{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
