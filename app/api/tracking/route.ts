import { NextResponse } from "next/server"
import axios from "axios"
import * as cheerio from "cheerio"
import type { TrackingData, TrackingEvent } from "@/types/tracking"

const TRACKING_URLS = [
  "http://106.55.5.75:8082/en/trackIndex.htm",
  "http://114.132.51.252:8082/en/trackIndex.htm",
  "http://47.112.107.11:8082/en/trackIndex.htm",
  "http://39.101.71.24:8082/en/trackIndex.htm",
  "http://120.78.2.65:8082/en/trackIndex.htm",
  "http://www.hsd-ex.com:8082/trackIndex.htm",
  "http://www.gdasgyl.com:8082/en/trackIndex.htm",
  "http://120.24.176.176:8082/en/trackIndex.htm",
  "http://111.230.211.49:8082/trackIndex.htm",
  "http://111.230.15.119:8082/trackIndex.htm",
  "http://120.77.221.225:8082/trackIndex.htm",
  "http://49.234.188.236:8082/trackIndex.htm",
  "http://115.29.184.71:8082/trackIndex.htm",
  "http://114.132.51.252:8082/trackIndex.htm",
]

const LABEL_NORMALIZATION: { [key: string]: string[] } = {
  trackingNumber: ["tracking number", "numer śledzenia"],
  referenceNo: ["reference no.", "numer referencyjny"],
  country: ["country", "kraj"],
  date: ["date", "data"],
  lastStatus: ["the last record", "ostatni status"],
  consigneeName: ["consigneename", "odbiorca"],
}

function normalizeLabel(label: string): string {
  const lowerLabel = label.toLowerCase().trim()
  for (const [key, variants] of Object.entries(LABEL_NORMALIZATION)) {
    if (variants.some((v) => lowerLabel.includes(v))) return key
  }
  return lowerLabel.replace(/\s+/g, "") // Fallback to a camelCase-like format
}

const translationCache = new Map<string, string>()

async function translateWithCache(status: string): Promise<string> {
  if (!status) return ""
  if (translationCache.has(status)) {
    return translationCache.get(status)!
  }

  const apiKey = process.env.DEEPL_API_KEY
  if (!apiKey) {
    return status
  }

  try {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const response = await axios.post(
      "https://api-free.deepl.com/v2/translate",
      new URLSearchParams({ auth_key: apiKey, text: status, target_lang: "PL" }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" }, timeout: 10000 },
    )
    const translatedText = response.data.translations[0].text
    translationCache.set(status, translatedText)
    return translatedText
  } catch (error) {
    console.error("Błąd tłumaczenia DeepL:", error instanceof Error ? error.message : "Unknown error")
    return status
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { trackingNumber } = body

    if (!trackingNumber || typeof trackingNumber !== "string" || trackingNumber.trim() === "") {
      return NextResponse.json({ error: "Invalid or missing trackingNumber" }, { status: 400 })
    }

    for (const url of TRACKING_URLS) {
      try {
        const response = await axios.post(url, new URLSearchParams({ documentCode: trackingNumber }), {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          timeout: 5000,
        })

        const $ = cheerio.load(response.data)
        const details: TrackingEvent[] = []

        $("table tr").each((_, row) => {
          const cells = $(row).find("td")
          // **FIX**: Removed the overly strict `if (date && status)` check.
          // Now we only check if the row has the expected number of columns.
          if (cells.length >= 3) {
            details.push({
              date: $(cells[0]).text().trim(),
              location: $(cells[1]).text().trim(),
              status: $(cells[2]).text().trim(),
            })
          }
        })

        if (details.length > 0) {
          const mainInfo: { [key: string]: string } = {}
          const labels: string[] = []
          const values: string[] = []

          $("div.menu_ > ul")
            .first()
            .find("li")
            .each((_, el) => labels.push($(el).text().trim()))
          $("div.menu_ > ul")
            .eq(1)
            .find("li")
            .each((_, el) => values.push($(el).text().trim()))

          labels.forEach((label, index) => {
            const normalized = normalizeLabel(label)
            mainInfo[normalized] = values[index] || ""
          })

          const translatedDetails = await Promise.all(
            details.map(async (event) => ({
              ...event,
              status: await translateWithCache(event.status),
            })),
          )

          const lastStatus = mainInfo.lastStatus
            ? await translateWithCache(mainInfo.lastStatus)
            : translatedDetails[translatedDetails.length - 1].status

          const result: TrackingData = {
            trackingNumber: mainInfo.trackingNumber || trackingNumber,
            referenceNo: mainInfo.referenceNo || "N/A",
            country: mainInfo.country || "N/A",
            date: mainInfo.date || "N/A",
            lastStatus: lastStatus,
            consigneeName: mainInfo.consigneeName || "N/A",
            details: translatedDetails,
            source: url,
          }

          return NextResponse.json(result, { status: 200 })
        }
      } catch (error) {
        console.warn(`Błąd podczas sprawdzania ${url}:`, (error as Error).message)
      }
    }

    return NextResponse.json({ error: "Nie znaleziono danych śledzenia na żadnym serwerze." }, { status: 404 })
  } catch (error) {
    console.error("Błąd w handlerze API:", error)
    return NextResponse.json({ error: "Wewnętrzny błąd serwera" }, { status: 500 })
  }
}
