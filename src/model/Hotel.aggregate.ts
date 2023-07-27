import { Infer, InferAggregate, Invariant, bind } from "@rotorsoft/eventually"
import { BookingEvent, HotelSchemas } from "./schemas/Hotel.schema"
import { Booking, RoomStatus, RoomType } from "./schemas/Booking.schema"
import seed from "./seed"
import { randomUUID } from "crypto"
import { Room } from "./schemas/Room.schema"

const DAY_MS = 24 * 3600 * 1000
// calculates how many nighs in a booking
export const nights = (booking: Infer<typeof Booking>): number => {
  const dtime = booking.checkout.getTime() - booking.checkin.getTime()
  return Math.round(dtime / DAY_MS)
}
// calculates if a room of a certain type is fully booked within a time period
export const fullyBooked = (
  bookings: Record<string, Infer<typeof BookingEvent>>,
  type: RoomType,
  from: Date,
  to: Date,
  max: number
) => {
  const sum = Object.values(bookings).reduce((sum, booking) => {
    if (
      booking.type === type &&
      ((from >= booking.checkin && from <= booking.checkout) ||
        (to >= booking.checkin && to <= booking.checkout))
    ) {
      for (
        let day = new Date(from);
        day <= to;
        day.setDate(day.getDate() + 1)
      ) {
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
    RoomOpened: (state, { data }) => ({
      rooms: {
        [data.number]: { ...state.rooms[data.number], status: "open" },
      },
    }),
    RoomClosed: (state, { data }) => ({
      rooms: {
        [data.number]: { ...state.rooms[data.number], status: "closed" },
      },
    }),
    RoomBooked: (state, { data }) => ({
      bookings: {
        [data.id]: { ...data },
      },
    }),
    RoomCheckedIn: (state, { data }) => {
      // here we connect the dots...assign booking<->room
      const booking = { ...state.bookings[data.bookingId], number: data.number }
      const room: Infer<typeof Room> = {
        ...state.rooms[data.number],
        status: "booked",
        bookingId: data.bookingId,
      }
      return {
        bookings: {
          [data.bookingId]: booking,
        },
        rooms: {
          [data.number]: room,
        },
      }
    },
    RoomCheckedOut: (state, { data }) => ({
      rooms: {
        [data.number]: {
          ...state.rooms[data.number],
          status: "open",
          bookingId: undefined,
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

      return [
        bind("RoomBooked", {
          ...booking,
          id: randomUUID(),
          price: state.prices[booking.type]!,
        }),
      ]
    },
    CheckInRoom: async ({ bookingId }, { bookings, rooms }) => {
      // find booking
      const booking = bookings[bookingId]
      if (!booking) throw Error(`Booking ${bookingId} not found!`)

      // is it the right booking?
      if (Math.abs(booking.checkin.getTime() - Date.now()) > DAY_MS)
        throw Error("Checkin is out of range!") // not an exact formula!

      // find an open room for this booking
      const room = Object.values(rooms).find(
        (r) => r.status === "open" && r.type === booking.type
      )
      if (!room) throw Error("No available rooms found!")

      // let's assume is room is clean ;-)
      return [bind("RoomCheckedIn", { bookingId, number: room.number })]
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
