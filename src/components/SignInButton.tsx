import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SignInButton() {
  return (
    <Button className="ml-3" variant="outline" asChild>
      <Link href="/signin">Sign In</Link>
    </Button>
  )
}
