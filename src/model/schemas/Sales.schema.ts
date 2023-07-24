import { z } from "zod"
import { BookingEvent } from "./Hotel.schema"

export const SalesRecord = z.object({
  id: z.string(),
  totals: z.record(z.number()),
})

export const SalesSchemas = {
  state: SalesRecord,
  events: {
    RoomBooked: BookingEvent,
  },
}
