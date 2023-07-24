import { RoomType } from "@/model/schemas/Booking.schema"

export type MonthlyBookingSummary = Record<
  string,
  Partial<Record<RoomType, number>>
>

export type HotelProps = {
  hotel: string
  types: Partial<Record<RoomType, number>>
  open: number[]
  closed: number[]
  summary: MonthlyBookingSummary
}
