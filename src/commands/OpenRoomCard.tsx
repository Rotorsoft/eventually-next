import OpenRoom, { Props } from "./OpenRoom"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function OpenRoomCard(props: Props) {
  return (
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
  )
}
