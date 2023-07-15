import { toast } from "@/components/ui/use-toast"
import { useState } from "react"

export default function useCommand(
  aggregate: string,
  name: string
): [boolean, (id: string, body: any) => Promise<void>] {
  const [loading, setLoading] = useState(false)

  async function invoke(id: string, body: any) {
    setLoading(true)
    try {
      const response = await fetch(`/command/${aggregate}/${id}/${name}`, {
        method: "POST",
        body: JSON.stringify(body),
      })
      const result = await response.json()
      if (response.status === 200)
        toast({
          description: (
            <pre className="text-xs rounded-md">
              {JSON.stringify(result, null, 2)}
            </pre>
          ),
        })
      else
        toast({
          variant: "destructive",
          description: (
            <pre className="text-xs rounded-md">
              {JSON.stringify(result, null, 2)}
            </pre>
          ),
        })
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
