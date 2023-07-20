"use client"

import {
  Session,
  SupabaseClient,
  createPagesBrowserClient,
} from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

const Context = createContext<
  { supabase: SupabaseClient; session: Session | null } | undefined
>(undefined)

export function SupabaseProvider({ children }: PropsWithChildren) {
  const [supabase] = useState(() => createPagesBrowserClient())
  const [session, setSession] = useState<Session | null>(null)
  const router = useRouter()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      if (event === "SIGNED_IN") router.refresh()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase, setSession])

  return (
    <Context.Provider
      value={{
        supabase,
        session,
      }}
    >
      <>{children}</>
    </Context.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(Context)
  if (!context)
    throw new Error("useSupabase must be used inside SupabaseContext")
  return context.supabase
}

export const useSession = () => {
  const context = useContext(Context)
  if (!context)
    throw new Error("useSession must be used inside SupabaseContext")
  return context.session
}
