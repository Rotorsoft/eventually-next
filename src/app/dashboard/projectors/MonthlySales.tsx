import { SalesSchemas } from "@/model/schemas/Sales.schema"
import { Infer } from "@rotorsoft/eventually"

const DTF = new Intl.DateTimeFormat("en-US", {
  year: "2-digit",
  month: "short",
})
const shortMonth = (date: Date) => DTF.format(date)

const NF = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
})
const currency = (amount: number) => NF.format(amount)

export default async function MonthlySales({
  sales,
}: {
  sales: Infer<typeof SalesSchemas.state>
}) {
  return (
    <div className="flex flex-wrap justify-center">
      {Object.entries(sales.totals).map(([month, { sales, bookings }]) => (
        <div
          key={month}
          className="border rounded dark:border-slate-700 flex flex-col m-1 p-1 w-40"
        >
          <h5 className="flex justify-center">{shortMonth(new Date(month))}</h5>
          <h4 className="flex justify-center">{currency(sales)}</h4>
          <div className="flex space-x-4 justify-around">
            {Object.entries(bookings).map(([type, count]) => {
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
    </div>
  )
}
