"use client"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import useCommand from "@/hooks/useCommand"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

export default function CloseRoom({ rooms }: { rooms: number[] }) {
  const router = useRouter()
  const form = useForm()
  const [loading, invoke] = useCommand("Hotel", "CloseRoom")

  async function submit(number: number) {
    const response = await invoke("my_hotel", { number })
    response?.status === 200 && router.refresh()
  }

  return (
    <Form {...form}>
      <form className="space-y-8">
        <fieldset disabled={loading}>
          <div className="flex flex-wrap">
            {rooms.map((room) => (
              <Button
                variant="outline"
                key={room}
                className="m-1 w-10  border-slate-500"
                onClick={() => submit(room)}
              >
                {room}
              </Button>
            ))}
          </div>
        </fieldset>
      </form>
    </Form>
  )
}
