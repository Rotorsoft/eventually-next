import BookRoomCard from "@/commands/BookRoomCard"
import CloseRoomCard from "@/commands/CloseRoomCard"
import OpenRoomCard from "@/commands/OpenRoomCard"
import { eventually } from "@/lib/eventually"
import { getSession } from "@/lib/supabase"
import { Hotel } from "@/model/Hotel.aggregate"
import { RoomType } from "@/model/schemas/Booking.schema"
import BookingsCard from "@/projectors/BookingsCard"
import { client } from "@rotorsoft/eventually"

eventually(Hotel, "my_hotel")

export const dynamic = "force-dynamic"

// to make it 100% dynamic
// export const revalidate = 0

export default async function Dashboard() {
  // every user is a tenant - with a private hotel
  const session = await getSession()
  if (session) {
    // one way to get rooms, but can also use read models
    const hotel = await client().load(Hotel, session.user.id)
    const open = Object.values(hotel.state.rooms)
      .filter((room) => room.status === "open")
      .map(({ number }) => number)
    const closed = Object.values(hotel.state.rooms)
      .filter((room) => room.status === "closed")
      .map(({ number }) => number)
    const types = Object.values(hotel.state.rooms)
      .filter((room) => room.status === "open")
      .reduce((types, room) => {
        types[room.type] = hotel.state.prices[room.type]!
        return types
      }, {} as Record<RoomType, number>)

    return (
      <div className="flex flex-col">
        <div className="flex flex-wrap justify-center">
          <OpenRoomCard hotel={session.user.id} rooms={closed} />
          <CloseRoomCard hotel={session.user.id} rooms={open} />
          <BookRoomCard hotel={session.user.id} types={types} />
        </div>
        <BookingsCard bookings={hotel.state.bookings} />
      </div>
    )
  }
  return <div>No session</div>
}
