import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import CloseRoom from "./CloseRoom"

export default async function CloseRoomCard({ rooms }: { rooms: number[] }) {
  return (
    <Card className="w-[250px] m-2">
      <CardHeader>
        <CardTitle>Close Room</CardTitle>
        <CardDescription>
          As a hotel admin, you can close rooms (e.g. low season)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CloseRoom rooms={rooms} />
      </CardContent>
    </Card>
  )
}
