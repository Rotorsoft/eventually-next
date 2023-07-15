import { z } from "zod"

const Opening = z.object({
  price: z.number(),
})

const Booking = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
  customer: z.string(),
})

export const HotelSchemas = {
  state: z.object({
    price: z.number().max(500, { message: "Price cannot exceed 500" }),
    status: z.enum(["available", "booked", "closed"]),
    booking: Booking.optional(),
  }),
  commands: {
    OpenRoom: Opening,
    BookRoom: Booking,
  },
  events: {
    RoomOpened: Opening,
    RoomBooked: Booking,
  },
}
