export interface TrackingEvent {
  date: string
  location: string
  status: string
  icon?: string // Icon will be determined on the frontend
}

export interface TrackingData {
  trackingNumber: string
  referenceNo: string
  country: string
  date: string
  lastStatus: string
  consigneeName: string
  details: TrackingEvent[]
  source: string
}
