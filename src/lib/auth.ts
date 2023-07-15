import { prisma } from "@/lib/prisma"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const getGoogleCredentials = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (clientId?.length && clientSecret?.length)
    return { clientId, clientSecret }

  throw Error("Missing google crendentials")
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [GoogleProvider(getGoogleCredentials())],
  //callbacks: {
  // session({ token, session }) {
  //   if (token) {
  //     console.log("session", { session, token })
  //     const { name, email, image } = token
  //   }
  //   return session
  // },
  // async jwt({ token }) {
  //   const { id, name, email, image } = token
  //   return { id, name, email, image }
  // },
  //redirect: () => "/dashboard",
  //},
}
