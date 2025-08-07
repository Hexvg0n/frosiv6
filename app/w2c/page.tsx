import { getProducts, Product } from "@/lib/data"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { W2CClientPage } from "./w2c-client"

export default async function W2CPage() {
  let products: Product[] = []
  let error = null

  try {
    // Pobieranie danych na serwerze
    products = await getProducts()
  } catch (err) {
    console.error(err)
    error = "Could not load products. Please check your database connection and try again."
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <AnimatedSection>
        <h1 className="text-5xl font-bold text-center mb-4 text-white">Where to Cop (W2C)</h1>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
          Browse curated lists and find the best sellers from the community. Use search and sort to find what you need.
        </p>

        {error ? (
          <Card className="bg-red-900/20 border-red-500/30 text-red-300 mt-8">
            <CardContent className="p-6 flex items-center gap-4">
              <AlertTriangle className="w-8 h-8" />
              <div>
                <h3 className="font-bold text-lg">Error</h3>
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Przekazanie danych do komponentu klienckiego
          <W2CClientPage initialProducts={products} />
        )}
      </AnimatedSection>
    </div>
  )
}