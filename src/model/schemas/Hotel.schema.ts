import { number, z } from "zod"
import { Booking, ROOM_TYPES } from "./Booking.schema"
import { Room, RoomNo } from "./Room.schema"

export const BookingEvent = Booking.and(
  z.object({
    id: z.string().uuid(),
    price: z.coerce
      .number()
      .min(50, { message: "Price cannot be less than $50" })
      .max(500, { message: "Price cannot be more than $500" }),
    number: z.number().optional(),
  })
)

const CheckIn = z.object({ bookingId: z.string().uuid() })

export const HotelSchemas = {
  state: z.object({
    bookings: z.record(BookingEvent),
    rooms: z.record(z.number(), Room),
    prices: z.record(z.enum(ROOM_TYPES), z.number()),
  }),
  commands: {
    OpenRoom: RoomNo,
    CloseRoom: RoomNo,
    BookRoom: Booking,
    CheckInRoom: CheckIn,
    CheckOutRoom: RoomNo,
  },
  events: {
    RoomOpened: RoomNo,
    RoomClosed: RoomNo,
    RoomBooked: BookingEvent,
    RoomCheckedIn: CheckIn.and(RoomNo),
    RoomCheckedOut: RoomNo,
  },
}
