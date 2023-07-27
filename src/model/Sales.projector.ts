import { InferProjector, client } from "@rotorsoft/eventually"
import { SalesSchemas } from "./schemas/Sales.schema"

export const Sales = (): InferProjector<typeof SalesSchemas> => ({
  description: "Sales projection",
  schemas: SalesSchemas,
  on: {
    RoomBooked: async ({ data, stream }, map) => {
      let totals = map.get(stream)?.totals
      if (!totals) {
        // load state
        await client().read(Sales, stream, ({ state }) => {
          totals = state.totals
        })
        totals = totals ?? {}
      }

      const checkinKey = data.checkin.toISOString().substring(0, 7)
      totals[checkinKey] = totals[checkinKey] || { sales: 0, bookings: {} }
      totals[checkinKey].bookings[data.type] =
        (totals[checkinKey].bookings[data.type] || 0) + 1

      let day = new Date(data.checkin)
      while (day <= data.checkout) {
        const key = day.toISOString().substring(0, 7)
        totals[key] = totals[key] || { sales: 0, bookings: {} }
        totals[key].sales = totals[key].sales + data.price
        day.setDate(day.getDate() + 1)
      }
      return [{ id: stream, totals }]
    },
  },
})
