import { getAuthenticatedUser } from "@/lib/auth"
import { eventually, toJsonResponse } from "@/lib/eventually"
import { Hotel } from "@/model/Hotel.aggregate"
import { HotelSchemas } from "@/model/schemas/Hotel.schema"
import { client } from "@rotorsoft/eventually"
import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

eventually()

// public api exposing aggregate commands to the client
export async function POST(
  req: NextRequest,
  {
    params,
  }: { params: { stream: string; command: keyof typeof HotelSchemas.commands } }
) {
  try {
    const user = await getAuthenticatedUser()
    // In this app, the hotel stream must match the user id
    if (user?.id !== params.stream) throw Error("Invalid tenant")

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

    // revalidate cached segments
    // TODO: pass revalidate path/tag in args?
    revalidatePath("/dashboard")

    return res
  } catch (err) {
    const { status, statusText, error } = toJsonResponse(err)
    return NextResponse.json({ error }, { status, statusText })
  }
}
