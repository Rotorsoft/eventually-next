import { getSession } from "@/lib/supabase"
import { redirect } from "next/navigation"
import { PropsWithChildren } from "react"

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const session = await getSession()
  if (!session) redirect("/")
  return <div className="flex flex-col">{children}</div>
}
