import { PrismaClient } from "@prisma/client"

const globals = globalThis as unknown as {
  prisma?: PrismaClient
}

!globals.prisma && (globals.prisma = new PrismaClient())

export const prisma = globals.prisma
