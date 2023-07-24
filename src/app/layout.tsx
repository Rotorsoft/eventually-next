import "./globals.css"
import Navbar from "@/components/Navbar"
import Providers from "@/components/Providers"
import { Toaster } from "@/components/ui/toaster"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Eventually Next",
  description: "NextJs + Eventually App",
}

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <header>
            <Navbar />
          </header>
          <main className="container my-4 max-w-[600px]">{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
