"use client"

import { useSession } from "@/components/SupabaseProvider"
import BookRoom from "@/components/commands/BookRoom"
import OpenRoom from "@/components/commands/OpenRoom"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react"

export default function Dashboard() {
  const [closed, setClosed] = useState<string[]>([])

  useEffect(() => {
    setClosed(["101", "102", "103", "201", "202", "203"])
  }, [])

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap justify-center">
        <Card className="w-[250px] m-2">
          <CardHeader>
            <CardTitle>Open Room</CardTitle>
            <CardDescription>
              As a hotel admin, you can open new rooms with a price
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OpenRoom rooms={closed} />
          </CardContent>
        </Card>
        <Card className="w-[250px] m-2">
          <CardHeader>
            <CardTitle>Book Room</CardTitle>
            <CardDescription>
              As a guest, you can book available rooms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BookRoom />
          </CardContent>
        </Card>
      </div>
      <Card className="m-2">
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
          <CardDescription>Booking Calendar</CardDescription>
        </CardHeader>
        <CardContent>
          <div>Booking Calendar Here!</div>
        </CardContent>
      </Card>
    </div>
  )
}
