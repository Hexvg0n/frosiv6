// app/api/tracking/route.ts

import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import type { TrackingData, TrackingEvent } from "@/types/tracking";

// ... (stałe TRACKING_URLS i LABEL_NORMALIZATION bez zmian)
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
];
const LABEL_NORMALIZATION: { [key: string]: string[] } = {
    trackingNumber: ["tracking number"], referenceNo: ["reference no."], country: ["country"],
    date: ["date"], lastStatus: ["the last record"], consigneeName: ["consigneename"],
};

function normalizeLabel(label: string): string {
    const lowerLabel = label.toLowerCase().trim();
    for (const [key, variants] of Object.entries(LABEL_NORMALIZATION)) {
        if (variants.some(v => lowerLabel.includes(v))) return key;
    }
    return lowerLabel.replace(/\s+/g, "");
}

async function tryFetchTrackingData(url: string, trackingNumber: string): Promise<TrackingData | null> {
    const response = await axios.post(url, new URLSearchParams({ documentCode: trackingNumber }), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout: 3000,
    });

    const $ = cheerio.load(response.data);
    const details: TrackingEvent[] = [];
    $("table tr").each((_, row) => {
        const cells = $(row).find("td");
        if (cells.length >= 3) {
            details.push({
                date: $(cells[0]).text().trim(),
                location: $(cells[1]).text().trim(),
                status: $(cells[2]).text().trim(),
            });
        }
    });

    if (details.length > 0) {
        const mainInfo: { [key: string]: string } = {};
        const labels: string[] = [];
        $("div.menu_ > ul").first().find("li").each((_, el) => { labels.push($(el).text().trim()); });
        const values: string[] = [];
        $("div.menu_ > ul").eq(1).find("li").each((_, el) => { values.push($(el).text().trim()); });

        labels.forEach((label, index) => {
            mainInfo[normalizeLabel(label)] = values[index] || "";
        });

        return {
            trackingNumber: mainInfo.trackingNumber || trackingNumber,
            referenceNo: mainInfo.referenceNo || "N/A",
            country: mainInfo.country || "N/A",
            date: mainInfo.date || "N/A",
            lastStatus: mainInfo.lastStatus || details[details.length - 1]?.status || "Brak statusu",
            consigneeName: mainInfo.consigneeName || "N/A",
            details: details, // Zwracamy oryginalne, nietłumaczone statusy
            source: url,
        };
    }
    return null;
}

export async function POST(req: Request) {
    try {
        const { trackingNumber } = await req.json();
        if (!trackingNumber || typeof trackingNumber !== "string") {
            return NextResponse.json({ error: "Invalid trackingNumber" }, { status: 400 });
        }

        const promises = TRACKING_URLS.map(url => 
            tryFetchTrackingData(url, trackingNumber).catch(() => null)
        );
        
        const results = await Promise.all(promises);
        const successfulResult = results.find(result => result);

        if (successfulResult) {
            return NextResponse.json(successfulResult);
        }

        return NextResponse.json({ error: "Nie znaleziono danych śledzenia." }, { status: 404 });
    } catch (error) {
        console.error("Błąd w handlerze API:", error);
        return NextResponse.json({ error: "Wewnętrzny błąd serwera" }, { status: 500 });
    }
}