import { getAuthenticatedUser } from "@/lib/auth"
import { bootstrap, parseHttpError } from "@/lib/eventually"
import { Hotel } from "@/model/Hotel.aggregate"
import { HotelSchemas } from "@/model/schemas/Hotel.schema"
import { client } from "@rotorsoft/eventually"
import { NextRequest, NextResponse } from "next/server"

bootstrap(Hotel, "my_hotel")

export async function POST(
  req: NextRequest,
  {
    params,
  }: { params: { stream: string; command: keyof typeof HotelSchemas.commands } }
) {
  try {
    const user = await getAuthenticatedUser()
    const ifMatch = req.headers.get("if-match")
    const body = await req.json()
    const snapshots = await client().command(Hotel, params.command, body, {
      stream: params.stream,
      expectedVersion: ifMatch ? +ifMatch : undefined,
      actor: { id: user?.email!, name: user?.name! },
    })
    const res = NextResponse.json(snapshots)
    const last = snapshots.at(-1)
    last && res.headers.set("etag", last.event!.version.toString())
    return res
  } catch (error) {
    const { message, status, details } = parseHttpError(error)
    return NextResponse.json({ error: { message, details } }, { status })
  }
}
