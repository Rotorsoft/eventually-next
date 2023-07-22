import { InferProjector, client } from "@rotorsoft/eventually"

// export const NextTrimester = (): InferProjector<typeof HotelSchemas> => ({
//   description: "Hotel read model",
//   schemas: HotelSchemas,
//   on: {
//     RoomOpened: ({ data, stream }) => {
//       const id = `Room-${stream}`
//       const { type, price } = data
//       return Promise.resolve({
//         upserts: [{ where: { id }, values: { type, price } }],
//       })
//     },
//     RoomBooked: async ({ data, stream }) => {
//       const id = `Room-${stream}`
//       let booked: Record<string, string> = {}
//       await client().read(
//         Hotel,
//         id,
//         (room) => (booked = room.state.booked || {})
//       )
//       let day = data.checkin
//       while (day <= data.checkout) {
//         booked[day.toISOString().substring(0, 10)] = data.id
//         day = addDays(day, 1)
//       }
//       return Promise.resolve({
//         upserts: [{ where: { id }, values: { booked } }],
//       })
//     },
//   },
// })
