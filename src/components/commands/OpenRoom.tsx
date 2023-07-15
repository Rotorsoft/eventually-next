"use client"

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
import useCommand from "@/hooks/useCommand"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

interface Props {
  rooms: string[]
}

const Schema = z.object({
  id: z.string({ required_error: "Please select a room" }),
  price: z.coerce.number({ description: "Room price" }).positive(),
})
type T = z.infer<typeof Schema>

export default function OpenRoom({ rooms = [] }: Props) {
  const [loading, invoke] = useCommand("Hotel", "OpenRoom")

  const form = useForm<T>({
    resolver: zodResolver(Schema),
    defaultValues: {
      price: 100,
    },
  })

  function onSubmit({ id, ...body }: T) {
    invoke(id, body)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <fieldset disabled={loading}>
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Room Number</FormLabel>
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
                        {field.value ?? "Select room"}
                        <Icons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search closed rooms..." />
                      <CommandEmpty>No room found.</CommandEmpty>
                      <CommandGroup>
                        {rooms.map((room) => (
                          <CommandItem
                            value={room}
                            key={room}
                            onSelect={(value) => {
                              form.setValue("id", value)
                            }}
                          >
                            <Icons.Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                room === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {room}
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
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    className="w-[200px]"
                    placeholder="Price"
                    {...field}
                  ></Input>
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
