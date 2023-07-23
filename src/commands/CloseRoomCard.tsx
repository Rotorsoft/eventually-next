import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import CloseRoom, { Props } from "./CloseRoom"

export default async function CloseRoomCard(props: Props) {
  return (
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
  )
}
