import { toast } from "@/components/ui/use-toast"
import { useState } from "react"

export default function useCommand(
  aggregate: string,
  command: string
): [boolean, (stream: string, body: any) => Promise<Response | undefined>] {
  const [loading, setLoading] = useState(false)

  async function invoke(stream: string, body: any) {
    setLoading(true)
    try {
      const response = await fetch(`/api/${aggregate}/${stream}/${command}`, {
        method: "POST",
        body: JSON.stringify(body),
      })
      const result = await response.json()
      // console.log(result)

      if (response.status === 200) {
        toast({
          title: response.statusText,
          description: `Command ${command} success!`,
        })
      } else
        toast({
          variant: "destructive",
          title: response.statusText,
          description: (
            <pre className="text-xs rounded-md">
              {JSON.stringify(result, null, 2)}
            </pre>
          ),
        })
      return response
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Oops, something went wrong!",
        description: "message" in error && error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return [loading, invoke]
}
