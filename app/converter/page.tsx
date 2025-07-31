"use client"

import type React from "react"

import { useState } from "react"
import { AnimatedSection } from "@/components/animated-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LinkIcon, Copy, Check, AlertTriangle, Loader2 } from "lucide-react"

interface ConvertedLink {
  key: string
  name: string
  url: string
}

interface ConversionResult {
  originalUrl: string
  convertedLinks: ConvertedLink[]
}

export default function ConverterPage() {
  const [url, setUrl] = useState("")
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedLink, setCopiedLink] = useState<string | null>(null)

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/converter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "An unknown error occurred.")
      }

      const data: ConversionResult = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to convert link.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = (linkUrl: string) => {
    navigator.clipboard.writeText(linkUrl)
    setCopiedLink(linkUrl)
    setTimeout(() => setCopiedLink(null), 2000)
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <AnimatedSection>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-purple-600/20 rounded-lg border border-purple-500/30">
                <LinkIcon className="w-10 h-10 text-purple-400" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 text-white">Link Converter</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Paste any Taobao, Weidian, 1688, or agent link to get all affiliate links in one click.
            </p>
          </div>

          <Card className="bg-gray-900/40 border-gray-800/60 backdrop-blur-sm">
            <CardContent className="p-8">
              <form onSubmit={handleConvert} className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="url"
                  placeholder="https://item.taobao.com/item.htm?id=..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className="flex-grow bg-gray-800/50 border-gray-700 h-12 text-base"
                />
                <Button type="submit" size="lg" disabled={isLoading} className="h-12">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    "Convert"
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

          {result && (
            <div className="mt-8 space-y-6">
              <Card className="bg-gray-900/40 border-gray-800/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Original Link</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-400 break-all">{result.originalUrl}</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/40 border-gray-800/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Converted Affiliate Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {result.convertedLinks.map((link) => (
                      <li
                        key={link.key}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50"
                      >
                        <div className="flex-grow">
                          <p className="font-semibold text-white">{link.name}</p>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-purple-400 hover:text-purple-300 break-all"
                          >
                            {link.url}
                          </a>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleCopy(link.url)}>
                          {copiedLink === link.url ? (
                            <Check className="w-5 h-5 text-green-400" />
                          ) : (
                            <Copy className="w-5 h-5" />
                          )}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </AnimatedSection>
    </div>
  )
}
