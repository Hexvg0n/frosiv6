import { getProducts } from "@/lib/data"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, AlertTriangle } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"

export default async function W2CPage() {
  // Fetch products from the API via our data client
  const products = await getProducts().catch((err) => {
    console.error(err)
    return [] // Return empty array on error
  })

  return (
    <div className="container mx-auto px-4 py-16">
      <AnimatedSection>
        <h1 className="text-5xl font-bold text-center mb-4 text-white">Where to Cop (W2C)</h1>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
          Browse curated lists and find the best sellers from the community. This section will soon feature a searchable
          and filterable gallery.
        </p>

        {products.length === 0 ? (
          <Card className="bg-yellow-900/20 border-yellow-500/30 text-yellow-300 mt-8">
            <CardContent className="p-6 flex items-center gap-4">
              <AlertTriangle className="w-8 h-8" />
              <div>
                <h3 className="font-bold text-lg">No Products Found</h3>
                <p>Could not load products. Please check back later.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <Card
                key={product.id}
                className="bg-gray-900/40 border-gray-800/60 backdrop-blur-sm overflow-hidden group transition-all duration-300 hover:border-purple-500/70 hover:shadow-2xl hover:shadow-purple-600/10"
              >
                <CardContent className="p-0">
                  <Image
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="object-cover w-full h-80 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-white">{product.name}</h3>
                    <a href={product.w2cLink} target="_blank" rel="noopener noreferrer">
                      <Button variant="link" className="p-0 text-purple-400 hover:text-purple-300">
                        Find on W2C <ShoppingCart className="ml-2 h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </AnimatedSection>
    </div>
  )
}
