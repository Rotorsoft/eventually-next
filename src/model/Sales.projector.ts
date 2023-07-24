import { InferProjector, client } from "@rotorsoft/eventually"
import { SalesSchemas } from "./schemas/Sales.schema"

export const Sales = (): InferProjector<typeof SalesSchemas> => ({
  description: "Sales projection",
  schemas: SalesSchemas,
  on: {
    RoomBooked: async ({ data, stream }) => {
      let totals: Record<string, number> = {}
      await client().read(Sales, stream, ({ state }) => {
        totals = state.totals
      })
      let day = new Date(data.checkin)
      while (day <= data.checkout) {
        const key = day.toISOString().substring(0, 10)
        totals[key] = (totals[key] || 0) + data.price
        day.setDate(day.getDate() + 1)
      }
      return {
        upserts: [
          {
            where: { id: stream },
            values: { totals },
          },
        ],
      }
    },
  },
})
