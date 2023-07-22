import BookRoomCard from "@/components/commands/BookRoomCard"
import CloseRoomCard from "@/components/commands/CloseRoomCard"
import OpenRoomCard from "@/components/commands/OpenRoomCard"
import BookingsCard from "@/components/projectors/BookingsCard"
import { bootstrap } from "@/lib/eventually"
import { Hotel } from "@/model/Hotel.aggregate"
import { client } from "@rotorsoft/eventually"

bootstrap(Hotel, "my_hotel")

export default async function Dashboard() {
  // dirty way to get rooms
  // TODO: use read model
  const hotel = await client().load(Hotel, "my_hotel")

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap justify-center">
        <OpenRoomCard
          rooms={Object.values(hotel.state.rooms)
            .filter((room) => room.status === "closed")
            .map(({ number }) => number)}
        />
        <CloseRoomCard
          rooms={Object.values(hotel.state.rooms)
            .filter((room) => room.status === "open")
            .map(({ number }) => number)}
        />
        <BookRoomCard />
      </div>
      <BookingsCard />
    </div>
  )
}
