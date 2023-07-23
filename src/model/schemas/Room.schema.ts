import { z } from "zod"
import { ROOM_STATUSES, ROOM_TYPES } from "./Booking.schema"

export const RoomNo = z.object({ number: z.number() })

export const Room = z.object({
  number: z.number(),
  type: z.enum(ROOM_TYPES),
  status: z.enum(ROOM_STATUSES),
  bookingId: z.string().uuid().optional(),
})
