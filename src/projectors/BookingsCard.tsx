import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BookingEvent } from "@/model/schemas/Hotel.schema"
import { Infer } from "@rotorsoft/eventually"

export type Props = { bookings: Record<string, Infer<typeof BookingEvent>> }
export default async function BookingsCard({ bookings }: Props) {
  return (
    <Card className="m-2">
      <CardHeader>
        <CardTitle>Bookings</CardTitle>
        <CardDescription>Booking Calendar</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap text-xs">
        {Object.values(bookings).map(
          ({ type, checkin, checkout, guest, id, price }) => (
            <div
              key={id}
              className="border rounded border-slate-500 flex flex-col m-1 p-1 w-44"
            >
              <div className="flex justify-between">
                <a href="#">{id.substring(0, 8)}</a>{" "}
                <b className="text-slate-600">{type}</b>
              </div>
              <div className="flex justify-between">
                {guest} <b className="text-slate-600">${price}</b>
              </div>
              <div className="flex justify-between">
                <span>{checkin.toISOString().substring(0, 10)}</span>
                <span>{checkout.toISOString().substring(0, 10)}</span>
              </div>
            </div>
          )
        )}
      </CardContent>
    </Card>
  )
}
