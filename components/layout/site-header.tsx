"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

const navLinks = [
  { href: "/w2c", label: "W2C" },
  { href: "/qc-finder", label: "QC Finder" },
  { href: "/converter", label: "Converter" },
  { href: "/tracking", label: "Tracking" },
]

export const SiteHeader = () => (
  <motion.header
    initial={{ y: -100 }}
    animate={{ y: 0 }}
    transition={{ duration: 0.5 }}
    className="sticky top-0 z-50 w-full"
  >
    <nav className="container mx-auto flex items-center justify-between p-4 bg-black/30 backdrop-blur-lg border-b border-gray-800/50 rounded-b-xl">
      <Link href="/" className="text-2xl font-bold text-white tracking-wider">
        Frosi<span className="text-purple-400">Reps</span>
      </Link>
      <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-purple-400 transition-colors">
            {link.label}
          </Link>
        ))}
      </div>
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-[#0a0a0a]/90 border-l-gray-800 text-white">
            <div className="flex flex-col space-y-6 pt-12">
              {navLinks.map((link) => (
                <SheetClose asChild key={link.href}>
                  <Link href={link.href} className="text-lg hover:text-purple-400 transition-colors">
                    {link.label}
                  </Link>
                </SheetClose>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  </motion.header>
)
