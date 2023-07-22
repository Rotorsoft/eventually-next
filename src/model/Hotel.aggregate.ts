import {
  Infer,
  InferAggregate,
  Invariant,
  bind,
  clone,
} from "@rotorsoft/eventually"
import { HotelSchemas } from "./schemas/Hotel.schema"
import { Booking, RoomStatus, RoomType } from "./schemas/Booking.schema"
import seed from "./seed"

const DAY_MS = 24 * 3600 * 1000
// calculates how many nighs in a booking
export const nights = (booking: Infer<typeof Booking>): number => {
  const dtime = booking.checkout.getTime() - booking.checkin.getTime()
  return Math.round(dtime / DAY_MS)
}
// calculates if a room of a certain type is fully booked within a time period
export const fullyBooked = (
  bookings: Infer<typeof Booking>[],
  type: RoomType,
  from: Date,
  to: Date,
  max: number
) => {
  const sum = bookings.reduce((sum, booking) => {
    if (
      booking.type === type &&
      ((from >= booking.checkin && from <= booking.checkout) ||
        (to >= booking.checkin && to <= booking.checkout))
    ) {
      for (let day = from; day.setDate(day.getDate() + 1); day <= to) {
        const key = day.toISOString().substring(0, 10)
        sum[key] = (sum[key] || 0) + 1
      }
    }
    return sum
  }, {} as Record<string, number>)
  return !!Object.values(sum).find((v) => v >= max)
}

// These are silly... just an example of state invariants
const MustHaveOpenRooms: Invariant<Infer<typeof HotelSchemas.state>> = {
  description: "must have open rooms",
  valid: ({ rooms }) => !!Object.values(rooms).find((r) => r.status === "open"),
}
const MustHaveClosedRooms: Invariant<Infer<typeof HotelSchemas.state>> = {
  description: "must have closed rooms",
  valid: ({ rooms }) =>
    !!Object.values(rooms).find((r) => r.status === "closed"),
}
const MustHaveBookedRooms: Invariant<Infer<typeof HotelSchemas.state>> = {
  description: "must have booked rooms",
  valid: ({ rooms }) =>
    !!Object.values(rooms).find((r) => r.status === "booked"),
}

// More command level invariants
const CheckRoom = (
  state: Infer<typeof HotelSchemas.state>,
  number: number,
  status: RoomStatus
): void => {
  const room = state.rooms[number]
  if (!room) throw Error(`Room ${number} not found!`)
  if (room.status !== status) throw Error(`Room ${number} must be ${status}!`)
}

export const Hotel = (stream: string): InferAggregate<typeof HotelSchemas> => ({
  description: "A hotel with rooms ;-)",
  stream,
  schemas: HotelSchemas,
  init: seed,
  reduce: {
    RoomOpened: (state, { data }) =>
      clone(state, {
        rooms: {
          [data.number]: { ...state.rooms[data.number], status: "open" },
        },
      }),
    RoomClosed: (state, { data }) =>
      clone(state, {
        rooms: {
          [data.number]: { ...state.rooms[data.number], status: "closed" },
        },
      }),
    RoomBooked: (state, { data }) =>
      clone(state, { bookings: state.bookings.concat(data) }),
    RoomCheckedIn: (state, { data }) =>
      clone(state, {
        rooms: {
          [data.number]: {
            ...state.rooms[data.number],
            status: "booked",
            booking: data,
          },
        },
      }),
    RoomCheckedOut: (state, { data }) =>
      clone(state, {
        rooms: {
          [data.number]: {
            ...state.rooms[data.number],
            status: "open",
            booking: undefined,
          },
        },
      }),
  },
  on: {
    OpenRoom: async ({ number }, state) => {
      CheckRoom(state, number, "closed")
      return [bind("RoomOpened", { number })]
    },
    CloseRoom: async ({ number }, state) => {
      CheckRoom(state, number, "open")
      return [bind("RoomClosed", { number })]
    },
    BookRoom: async (booking, state) => {
      // check price?
      if (state.prices[booking.type] !== booking.price)
        throw Error("Prices don't match!")

      // make sure the hotel has room for this booking (approx)
      if (
        fullyBooked(
          state.bookings,
          booking.type,
          booking.checkin,
          booking.checkout,
          Object.values(state.rooms).filter((r) => r.type === booking.type)
            .length
        )
      )
        throw Error("This room type if fully booked within this period!")

      return [bind("RoomBooked", booking)]
    },
    CheckInRoom: async (booking, { rooms }) => {
      // is it the right booking?
      if (Math.abs(booking.checkin.getTime() - Date.now()) > DAY_MS)
        throw Error("Checkin is out of range!") // not an exact formula!

      // find an open room for this booking
      const room = Object.values(rooms).find(
        (r) => r.status === "open" && r.type === booking.type
      )
      if (!room) throw Error("No available rooms found!")

      // let's assume is room is clean ;-)
      return [bind("RoomCheckedIn", { ...booking, number: room.number })]
    },
    CheckOutRoom: async ({ number }, state) => {
      CheckRoom(state, number, "booked")
      return [bind("RoomCheckedOut", { number })]
    },
  },
  given: {
    OpenRoom: [MustHaveClosedRooms],
    CloseRoom: [MustHaveOpenRooms],
    CheckInRoom: [MustHaveOpenRooms],
    CheckOutRoom: [MustHaveBookedRooms],
  },
})
