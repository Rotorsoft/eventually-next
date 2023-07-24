import { Button } from "@/components/ui/button"
import { HotelProps } from "./HotelProps"
import Link from "next/link"
import Icons from "@/components/Icons"

export default async function MonthlyBookings({ summary }: HotelProps) {
  return (
    <div className="flex flex-wrap justify-center">
      {Object.entries(summary).map(([month, types]) => (
        <div
          key={month}
          className="border rounded dark:border-slate-700 flex flex-col m-1 p-1 w-40"
        >
          <h5 className="flex justify-center">{month}</h5>
          <div className="flex space-x-4 justify-around">
            {Object.entries(types).map(([type, count]) => {
              return (
                <div key={type} className="grid justify-items-center">
                  <b className="text-slate-500 text-xs">{type}</b>
                  <div>{count}</div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
      <div className="flex w-40 m-1 p-1 justify-center items-center">
        <Button variant="link" asChild>
          <Link href="/dashboard/bookings">
            Details
            <Icons.ChevronRight />
          </Link>
        </Button>
      </div>
    </div>
  )
}
