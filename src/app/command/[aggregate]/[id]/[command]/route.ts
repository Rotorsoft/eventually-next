import { authOptions } from "@/lib/auth"
import {
  CommandHandlerFactory,
  Errors,
  app,
  client,
} from "@rotorsoft/eventually"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { bootstrap } from "@/model"

let bootstrapped = false

interface Params {
  params: { aggregate: string; id: string; command: string }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    if (!bootstrapped) {
      console.log(process.pid, "bootstrapping the model")
      await bootstrap()
      bootstrapped = true
    }

    const artifact = app().artifacts.get(params.aggregate)
    if (!artifact) throw Error(`Aggregate ${params.aggregate} not found`)

    const session = await getServerSession(authOptions)
    const ifMatch = req.headers.get("if-match")
    const expectedVersion = ifMatch ? +ifMatch : undefined
    const body = await req.json()

    const snapshots = await client().command(
      artifact.factory as CommandHandlerFactory,
      params.command,
      body,
      {
        stream: params.id,
        expectedVersion,
        actor: { id: session?.user?.email!, name: session?.user?.name! },
      }
    )
    const res = NextResponse.json(snapshots)
    const last = snapshots.at(-1)
    last && res.headers.set("etag", last.event!.version.toString())
    return res
  } catch (error: any) {
    const { name, message, stack, ...other } = error
    let status = 500
    switch (name) {
      case Errors.ValidationError:
      case Errors.InvariantError:
        status = 400
        break
      case Errors.RegistrationError:
        status = 404
        break
      case Errors.ConcurrencyError:
      case Errors.ActorConcurrencyError:
        status = 409
        break
    }
    return NextResponse.json({ name, message, ...other }, { status })
  }
}
