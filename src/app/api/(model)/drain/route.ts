import { eventually } from "@/lib/eventually"
import { Sales } from "@/model/Sales.projector"
import { drain } from "@rotorsoft/eventually"
import { NextRequest, NextResponse } from "next/server"

eventually()

const KEY = "12_8__1" // TODO: move to secrets

// a little hack?
// webhook triggered by external systems (like supabase webhooks)
// to keep event consumers in sync with the event store
export async function GET(req: NextRequest) {
  const key = req.headers.get("API_KEY")
  if (key === KEY) {
    // drain event handlers
    const result = await drain(Sales, {
      names: ["RoomBooked"],
      timeout: 3000,
      limit: 10,
    })
    return NextResponse.json(result)
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
