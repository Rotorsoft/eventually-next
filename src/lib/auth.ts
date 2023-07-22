// Supabase
import { getSession } from "./supabase"
// Next-Auth
// import { getServerSession } from "next-auth"
// import { authOptions } from "./next-auth"

export async function getAuthenticatedUser(): Promise<
  | {
      id: string
      name: string
      email: string
      image?: string | null
    }
  | undefined
> {
  // Supabase
  const { user } = (await getSession()) || {}
  return user && user.email
    ? {
        id: user.id,
        name: user.user_metadata.name ?? user.email,
        email: user.email,
        image: user.user_metadata.picture,
      }
    : undefined

  // Next-Auth
  // const { user } = (await getServerSession(authOptions)) || {}
  // return user && user.email
  //   ? {
  //       id: user.email,
  //       name: user.name ?? user.email,
  //       email: user.email,
  //       image: user.image,
  //     }
  //   : undefined
}
