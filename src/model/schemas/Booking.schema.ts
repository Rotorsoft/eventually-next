import { z } from "zod"

export const ROOM_TYPES = ["single", "double", "deluxe"] as const
export const ROOM_STATUSES = ["closed", "open", "booked"] as const
export type RoomType = (typeof ROOM_TYPES)[number]
export type RoomStatus = (typeof ROOM_STATUSES)[number]

export const Booking = z
  .object({
    id: z.string().uuid(),
    type: z.enum(ROOM_TYPES),
    checkin: z.coerce.date(),
    checkout: z.coerce.date(),
    customer: z.string().min(5),
    price: z
      .number()
      .min(50, { message: "Price cannot be less than $50" })
      .max(500, { message: "Price cannot be more than $500" }),
    number: z.number().optional(),
  })
  .refine(({ checkin, checkout }) => checkin < checkout, {
    message: "Checkin date must be earlier than checkout date",
    path: ["checkout"],
  })
  .describe("A booking")
