import Icons from "@/components/Icons"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Totals from "../projectors/Totals"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default function Bookings() {
  return (
    <div className="flex flex-wrap">
      <div className="w-full">
        <Button variant="link">
          <Link href="/dashboard">
            <Icons.ChevronLeft />
            Back
          </Link>
        </Button>
      </div>
      <Card className="m-2">
        <CardHeader>
          <CardTitle>Booking Totals</CardTitle>
          <CardDescription>Booking Totals by Day</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap text-xs">
          <Totals />
        </CardContent>
      </Card>
    </div>
  )
}
