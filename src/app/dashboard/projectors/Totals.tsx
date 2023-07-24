import { getAuthenticatedUser } from "@/lib/auth"
import { eventually } from "@/lib/eventually"
import { Sales } from "@/model/Sales.projector"
import { SalesSchemas } from "@/model/schemas/Sales.schema"
import { Infer, client } from "@rotorsoft/eventually"

eventually()

async function getTotals(
  id: string
): Promise<Infer<typeof SalesSchemas.state>> {
  const totals = { id, totals: {} }
  await client().read(
    Sales,
    id,
    (record) => (totals.totals = record.state.totals)
  )
  return totals
}

export default async function Totals() {
  const user = await getAuthenticatedUser()
  if (!user) return null

  const { totals } = await getTotals(user.id)

  return Object.entries(totals).map(([day, total]) => (
    <div
      key={day}
      className="w-full border-b border-b-slate-700 flex m-1 p-1 justify-between"
    >
      <span>{day}</span>
      <span>${total}</span>
    </div>
  ))
}
