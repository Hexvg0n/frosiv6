"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { login } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { KeyRound } from "lucide-react"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Signing In..." : "Sign In"}
    </Button>
  )
}

export default function AdminLoginPage() {
  const [state, action] = useActionState(login, undefined)

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950">
      <Card className="w-full max-w-sm bg-gray-900 border-gray-700 text-white">
        <CardHeader className="text-center">
          <div className="mx-auto bg-purple-600/20 p-3 rounded-lg w-fit mb-4">
            <KeyRound className="w-8 h-8 text-purple-400" />
          </div>
          <CardTitle>Admin Access</CardTitle>
          <CardDescription>Enter the password to access the admin panel.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required className="bg-gray-800 border-gray-600" />
            </div>
            {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
