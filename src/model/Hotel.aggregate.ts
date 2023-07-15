import { bind, InferAggregate, Infer, Invariant } from "@rotorsoft/eventually"
import { HotelSchemas } from "./schemas/Hotel.schemas"

const MustBeClosed: Invariant<Infer<typeof HotelSchemas.state>> = {
  description: "Room must be closed",
  valid: ({ status }) => status === "closed",
}

const MustBeAvailable: Invariant<Infer<typeof HotelSchemas.state>> = {
  description: "Room must be available",
  valid: ({ status }) => status === "available",
}

export const Hotel = (stream: string): InferAggregate<typeof HotelSchemas> => ({
  description: "TODO: describe this artifact!",
  stream,
  schemas: HotelSchemas,
  init: () => ({
    price: 0,
    status: "closed",
  }),
  reduce: {
    RoomOpened: (_, { data }) => ({ ...data, status: "available" }),
    RoomBooked: (state, { data }) => ({ ...state, booking: { ...data } }),
  },
  given: {
    OpenRoom: [MustBeClosed],
    BookRoom: [MustBeAvailable],
  },
  on: {
    OpenRoom: (data) => {
      return Promise.resolve([bind("RoomOpened", data)])
    },
    BookRoom: (data) => {
      return Promise.resolve([bind("RoomBooked", data)])
    },
  },
})
