"use client"

import Icons from "@/components/Icons"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { FormControl } from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import React from "react"
import { ControllerRenderProps } from "react-hook-form"

export default React.forwardRef<HTMLSlotElement, ControllerRenderProps>(
  function DatePopover(field, ref) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <FormControl ref={ref}>
            <Button
              variant={"outline"}
              className={cn(
                "w-[200px] pl-3 text-left font-normal",
                !field.value && "text-muted-foreground"
              )}
            >
              {field.value ? (
                format(field.value, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
              <Icons.CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={field.value}
            onSelect={field.onChange}
            disabled={(date) =>
              date < new Date() ||
              date > new Date(Date.now() + 365 * 24 * 3600 * 1000)
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>
    )
  }
)
