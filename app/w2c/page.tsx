// app/w2c/page.tsx

import { getProducts, Product } from "@/lib/data"
// POPRAWKA: Dodano brakujące importy CardHeader i CardFooter
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card" 
import { AlertTriangle } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { W2CClientPage } from "./w2c-client"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

// Komponent do wyświetlania stanu ładowania
function ProductsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="bg-gray-900/40 border-gray-800/60">
          <CardHeader className="p-0">
            <Skeleton className="h-80 w-full" />
          </CardHeader>
          <CardContent className="p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-4 w-1/3" />
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

// Komponent, który faktycznie pobiera i wyświetla produkty
async function ProductList() {
  try {
    const products = await getProducts()
    return <W2CClientPage initialProducts={products} />
  } catch (error) {
    console.error("Database fetch error on /w2c:", error)
    return (
      <Card className="bg-red-900/20 border-red-500/30 text-red-300 mt-8">
        <CardContent className="p-6 flex items-center gap-4">
          <AlertTriangle className="w-8 h-8" />
          <div>
            <h3 className="font-bold text-lg">Błąd ładowania produktów</h3>
            <p>Nie udało się połączyć z bazą danych. Sprawdź konfigurację serwera i spróbuj ponownie później.</p>
          </div>
        </CardContent>
      </Card>
    )
  }
}

export default function W2CPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <AnimatedSection>
        <h1 className="text-5xl font-bold text-center mb-4 text-white">Where to Cop (W2C)</h1>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
          Przeglądaj wyselekcjonowane listy i znajdź najlepszych sprzedawców polecanych przez społeczność. Użyj wyszukiwarki i sortowania, aby znaleźć to, czego potrzebujesz.
        </p>
        
        <Suspense fallback={<ProductsLoadingSkeleton />}>
          <ProductList />
        </Suspense>
      </AnimatedSection>
    </div>
  )
}