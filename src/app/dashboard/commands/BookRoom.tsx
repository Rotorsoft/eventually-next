"use client"

import useCommand from "@/app/dashboard/commands/eventually-client"
import DatePopover from "@/components/DatePopover"
import Icons from "@/components/Icons"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { RoomType } from "@/model/schemas/Booking.schema"
import { HotelSchemas } from "@/model/schemas/Hotel.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Infer } from "@rotorsoft/eventually"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { HotelProps } from "../HotelProps"

export default function BookRoom({ hotel, types }: HotelProps) {
  const router = useRouter()
  const [loading, invoke] = useCommand("Hotel", "BookRoom")
  const today = new Date()
  const type = Object.keys(types)[0] as RoomType

  const form = useForm<Infer<typeof HotelSchemas.commands.BookRoom>>({
    resolver: zodResolver(HotelSchemas.commands.BookRoom),
    defaultValues: {
      type,
      checkin: today,
      checkout: new Date(today.getTime() + 24 * 3600 * 1000),
    },
  })

  async function onSubmit(body: Infer<typeof HotelSchemas.commands.BookRoom>) {
    const response = await invoke(hotel, {
      ...body,
      checkin: new Date(body.checkin.toDateString()),
      checkout: new Date(body.checkout.toDateString()),
    })
    response?.status === 200 && router.refresh()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (e) => {
          console.log(e)
        })}
        className="space-y-8"
      >
        <fieldset disabled={loading} className="space-y-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Room Type</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[200px] justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ?? "Select room type"}
                        <Icons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Room types..." />
                      <CommandEmpty>No room type found.</CommandEmpty>
                      <CommandGroup>
                        {Object.entries(types).map(([type, price]) => (
                          <CommandItem
                            value={type}
                            key={type}
                            onSelect={(value) => {
                              form.setValue("type", value as RoomType)
                            }}
                          >
                            <Icons.Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                type === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {`${type} $${price}`}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="flex mt-1 text-slate-400 justify-end">
                <FormLabel>${types[field.value]} / night</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="checkin"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>CheckIn Date</FormLabel>
                <DatePopover {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="checkout"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>CheckOut Date</FormLabel>
                <DatePopover {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="guest"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Guest Name</FormLabel>
                <FormControl>
                  <Input placeholder="Guest name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button className="mt-3" type="submit">
              Submit
            </Button>
          </div>
        </fieldset>
      </form>
    </Form>
  )
}
