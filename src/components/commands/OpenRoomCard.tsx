import OpenRoom from "./OpenRoom"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function OpenRoomCard({ rooms }: { rooms: number[] }) {
  return (
    <Card className="w-[250px] m-2">
      <CardHeader>
        <CardTitle>Open Room</CardTitle>
        <CardDescription>
          As a hotel admin, you can open new rooms (e.g. high season)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OpenRoom rooms={rooms} />
      </CardContent>
    </Card>
  )
}
