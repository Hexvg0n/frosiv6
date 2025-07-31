import { AnimatedSection } from "@/components/animated-section"
import { Camera } from "lucide-react"

export default function QCFinderPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <AnimatedSection>
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Camera className="w-16 h-16 text-purple-400" />
          </div>
          <h1 className="text-5xl font-bold mb-4 text-white">QC Finder</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            This feature is coming soon. You'll be able to paste a product link to find quality control photos from
            other buyers.
          </p>
        </div>
      </AnimatedSection>
    </div>
  )
}
