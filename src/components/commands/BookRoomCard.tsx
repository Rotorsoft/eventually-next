import BookRoom from "./BookRoom"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function BookRoomCard() {
  return (
    <Card className="w-[250px] m-2">
      <CardHeader>
        <CardTitle>Book Room</CardTitle>
        <CardDescription>As a guest, you can book rooms</CardDescription>
      </CardHeader>
      <CardContent>
        <BookRoom />
      </CardContent>
    </Card>
  )
}
