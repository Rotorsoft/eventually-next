import BookRoom, { Props } from "./BookRoom"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function BookRoomCard(props: Props) {
  return (
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
  )
}
