import { Infer } from "@rotorsoft/eventually"
import { HotelSchemas } from "./schemas/Hotel.schema"

// A sample seed... real apps deal with "closing the books/year end" issues
// In this case, the hotel can reset each season, for renovations, etc, etc
export default function seed(): Infer<typeof HotelSchemas.state> {
  return {
    bookings: {},
    rooms: {
      100: { number: 100, type: "single", status: "closed" },
      101: { number: 101, type: "single", status: "open" },
      102: { number: 102, type: "single", status: "open" },
      103: { number: 103, type: "single", status: "open" },
      104: { number: 104, type: "double", status: "open" },
      105: { number: 105, type: "double", status: "open" },
      200: { number: 200, type: "single", status: "closed" },
      201: { number: 201, type: "single", status: "closed" },
      202: { number: 202, type: "single", status: "closed" },
      203: { number: 203, type: "single", status: "closed" },
      204: { number: 204, type: "double", status: "closed" },
      205: { number: 205, type: "double", status: "closed" },
      300: { number: 300, type: "deluxe", status: "closed" },
      301: { number: 301, type: "deluxe", status: "closed" },
      302: { number: 302, type: "deluxe", status: "closed" },
    },
    // pricing can be managed via new commands
    prices: {
      single: 125,
      double: 210,
      deluxe: 500,
    },
  }
}
