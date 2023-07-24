import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getAuthenticatedUser } from "@/lib/auth"
import { eventually } from "@/lib/eventually"
import { Hotel } from "@/model/Hotel.aggregate"
import { RoomType } from "@/model/schemas/Booking.schema"
import { client } from "@rotorsoft/eventually"
import { HotelProps, MonthlyBookingSummary } from "./HotelProps"
import MonthlyBookings from "./MonthlyBookings"
import BookRoom from "./commands/BookRoom"
import CloseRoom from "./commands/CloseRoom"
import OpenRoom from "./commands/OpenRoom"

export const dynamic = "force-dynamic"
eventually()

// to make it 100% dynamic
// export const revalidate = 0

/**
 * Loads state of rooms by number
 * @param stream each user is a tenant - with a private hotel in a stream = user.id
 */
async function loadProps(stream: string): Promise<HotelProps> {
  // one way to get rooms, but can also use read models
  const hotel = await client().load(Hotel, stream)
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
  const summary = Object.values(hotel.state.bookings).reduce((sum, booking) => {
    const month = new Intl.DateTimeFormat("en-US", {
      year: "2-digit",
      month: "short",
    }).format(booking.checkin)
    sum[month] = sum[month] || {}
    sum[month][booking.type] = (sum[month][booking.type] || 0) + 1
    return sum
  }, {} as MonthlyBookingSummary)
  return { hotel: stream, open, closed, types, summary }
}

export default async function Dashboard() {
  const user = await getAuthenticatedUser()
  if (!user) return null

  const props = await loadProps(user.id)
  return (
    <>
      <MonthlyBookings {...props} />
      <div className="flex flex-wrap justify-center">
        <Card className="w-[250px] m-2">
          <CardHeader>
            <CardTitle>Book Room</CardTitle>
            <CardDescription>As a guest, you can book rooms</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(props.types).length ? (
              <BookRoom {...props} />
            ) : (
              <h1 className="text-center">CLOSED</h1>
            )}
          </CardContent>
        </Card>
        <div className="flex flex-col">
          <Card className="w-[250px] m-2">
            <CardHeader>
              <CardTitle>Open Room</CardTitle>
              <CardDescription>
                As a hotel admin, you can open new rooms (e.g. high season)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OpenRoom {...props} />
            </CardContent>
          </Card>
          <Card className="w-[250px] m-2">
            <CardHeader>
              <CardTitle>Close Room</CardTitle>
              <CardDescription>
                As a hotel admin, you can close rooms (e.g. low season)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CloseRoom {...props} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
