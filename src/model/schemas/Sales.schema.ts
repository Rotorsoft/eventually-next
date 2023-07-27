import { z } from "zod"
import { BookingEvent } from "./Hotel.schema"
import { ROOM_TYPES } from "./Booking.schema"

export const SalesRecord = z.object({
  id: z.string(),
  totals: z.record(
    z.object({
      sales: z.number(),
      bookings: z.record(z.enum(ROOM_TYPES), z.number()),
    })
  ),
})

export const SalesSchemas = {
  state: SalesRecord,
  events: {
    RoomBooked: BookingEvent,
  },
}
