import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { logout } from "./actions"
import { Home, LogOut } from "lucide-react"

function AdminHeader() {
  return (
    <header className="bg-gray-900 text-white p-4 border-b border-gray-700">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/admin/dashboard" className="text-xl font-bold">
          FrosiReps <span className="text-purple-400">Admin</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" passHref>
            <Button variant="outline" size="sm">
              <Home className="w-4 h-4 mr-2" />
              View Site
            </Button>
          </Link>
          <form action={logout}>
            <Button variant="destructive" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">
      <AdminHeader />
      <main className="container mx-auto p-4 md:p-8">{children}</main>
    </div>
  )
}
