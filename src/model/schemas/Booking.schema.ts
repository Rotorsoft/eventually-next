import { z } from "zod"

export const ROOM_TYPES = ["single", "double", "deluxe"] as const
export const ROOM_STATUSES = ["closed", "open", "booked"] as const
export type RoomType = (typeof ROOM_TYPES)[number]
export type RoomStatus = (typeof ROOM_STATUSES)[number]

export const Booking = z
  .object({
    type: z.enum(ROOM_TYPES),
    checkin: z.coerce.date().min(new Date(new Date().toDateString())),
    checkout: z.coerce.date(),
    guest: z.string().min(5),
  })
  .refine(({ checkin, checkout }) => checkin < checkout, {
    message: "Checkin date must be earlier than checkout date",
    path: ["checkout"],
  })
  .describe("A booking")
