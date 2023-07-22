import { number, z } from "zod"
import { Booking, ROOM_TYPES } from "./Booking.schema"
import { Room, RoomNo } from "./Room.schema"

export const HotelSchemas = {
  state: z.object({
    bookings: z.array(Booking),
    rooms: z.record(z.number(), Room),
    prices: z.record(z.enum(ROOM_TYPES), z.number()),
  }),
  commands: {
    OpenRoom: RoomNo,
    CloseRoom: RoomNo,
    BookRoom: Booking,
    CheckInRoom: Booking,
    CheckOutRoom: RoomNo,
  },
  events: {
    RoomOpened: RoomNo,
    RoomClosed: RoomNo,
    RoomBooked: Booking,
    RoomCheckedIn: Booking.and(RoomNo),
    RoomCheckedOut: RoomNo,
  },
}
