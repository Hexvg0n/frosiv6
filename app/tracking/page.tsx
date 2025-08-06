"use client"

import type React from "react"
import { useState } from "react"
import { AnimatedSection } from "@/components/animated-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  PackageSearch,
  Loader2,
  AlertTriangle,
  Package,
  Plane,
  Warehouse,
  Truck,
  CheckCircle,
  MapPin,
  Calendar,
} from "lucide-react"
import type { TrackingData } from "@/types/tracking"

const getIconForStatus = (status: string): React.ReactNode => {
  const lowerStatus = status.toLowerCase()
  if (lowerStatus.includes("doręczono") || lowerStatus.includes("delivered"))
    return <CheckCircle className="h-6 w-6 text-green-400" />
  if (lowerStatus.includes("w doręczeniu") || lowerStatus.includes("out for delivery"))
    return <Truck className="h-6 w-6 text-blue-400" />
  if (lowerStatus.includes("lot") || lowerStatus.includes("flight"))
    return <Plane className="h-6 w-6 text-purple-400" />
  if (lowerStatus.includes("magazyn") || lowerStatus.includes("warehouse") || lowerStatus.includes("sortownia"))
    return <Warehouse className="h-6 w-6 text-orange-400" />
  return <Package className="h-6 w-6 text-gray-400" />
}

const TrackingResult = ({ data }: { data: TrackingData }) => (
  <div className="mt-8 space-y-6">
    <Card className="bg-gray-900/40 border-gray-800/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-white">Tracking Summary</CardTitle>
        <p className="text-gray-400">
          Status for: <span className="font-bold text-purple-400">{data.trackingNumber}</span>
        </p>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div className="flex items-center gap-3">
          <Package className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-gray-500">Last Status</p>
            <p className="font-semibold text-white">{data.lastStatus}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-gray-500">Country</p>
            <p className="font-semibold text-white">{data.country}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-gray-500">Date</p>
            <p className="font-semibold text-white">{data.date}</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="bg-gray-900/40 border-gray-800/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-white">Shipment History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative pl-8">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-700" />
          {data.details.map((event, index) => (
            <div key={index} className="relative mb-8">
              <div className="absolute -left-[26px] top-1.5 h-8 w-8 bg-gray-800 rounded-full border-4 border-gray-900 flex items-center justify-center">
                {getIconForStatus(event.status)}
              </div>
              <div className="pl-6">
                <p className="font-bold text-white">{event.status}</p>
                <p className="text-sm text-gray-400">{event.location}</p>
                <p className="text-xs text-gray-500 mt-1">{event.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
)

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [result, setResult] = useState<TrackingData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingNumber }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "An unknown error occurred.")
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to track package.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <AnimatedSection>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-purple-600/20 rounded-lg border border-purple-500/30">
                <PackageSearch className="w-10 h-10 text-purple-400" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 text-white">Tracking Paczek</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Enter your tracking number to see the latest updates on your shipment.
            </p>
          </div>

          <Card className="bg-gray-900/40 border-gray-800/60 backdrop-blur-sm">
            <CardContent className="p-8">
              <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="text"
                  placeholder="e.g., HSD1234567890YPQ"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  required
                  className="flex-grow bg-gray-800/50 border-gray-700 h-12 text-base"
                />
                <Button type="submit" size="lg" disabled={isLoading} className="h-12">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    "Track Package"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {error && (
            <Card className="mt-8 bg-red-900/20 border-red-500/30 text-red-300">
              <CardContent className="p-6 flex items-center gap-4">
                <AlertTriangle className="w-6 h-6" />
                <div>
                  <h3 className="font-bold">Error</h3>
                  <p>{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {result && <TrackingResult data={result} />}
        </div>
      </AnimatedSection>
    </div>
  )
}
