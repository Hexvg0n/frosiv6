import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { AnimatedBackground } from "@/components/animated-background"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FrosiReps ",
  description: "Najlepsza repowa polska społeczność.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn("bg-[#0a0a0a] text-gray-300 antialiased", inter.className)}>
        <div className="relative flex flex-col min-h-screen">
          <AnimatedBackground />
          <div className="relative z-10 flex-grow">
            <SiteHeader />
            <main>{children}</main>
          </div>
          <div className="relative z-10">
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  )
}
