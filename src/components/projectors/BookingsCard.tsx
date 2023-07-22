import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function BookingsCard() {
  return (
    <Card className="m-2">
      <CardHeader>
        <CardTitle>Bookings</CardTitle>
        <CardDescription>Booking Calendar</CardDescription>
      </CardHeader>
      <CardContent>
        <div>Booking Calendar Here!</div>
      </CardContent>
    </Card>
  )
}
