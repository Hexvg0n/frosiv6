"use client"

import { useState, useMemo } from "react"
import type { Product } from "@/lib/data"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, AlertTriangle, Search, Tag, DollarSign } from "lucide-react"

const ProductCard = ({ product }: { product: Product }) => (
  <Card
    key={product.id}
    className="bg-gray-900/40 border-gray-800/60 backdrop-blur-sm overflow-hidden group transition-all duration-300 hover:border-purple-500/70 hover:shadow-2xl hover:shadow-purple-600/10 flex flex-col"
  >
    <CardHeader className="p-0">
      <div className="relative h-80 w-full">
        <Image
          src={product.imageUrl || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
    </CardHeader>
    <CardContent className="p-4 flex-grow">
      <CardTitle className="text-lg text-white mb-2 leading-tight">{product.name}</CardTitle>
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
        <Tag className="w-4 h-4 text-purple-400" />
        <span>{product.category || "Brak kategorii"}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <DollarSign className="w-4 h-4 text-purple-400" />
        <span className="font-semibold text-white">{product.price.toLocaleString("pl-PL", { style: "currency", currency: "PLN" })}</span>
      </div>
    </CardContent>
    <CardFooter className="p-4 pt-0">
      <a href={product.w2cLink} target="_blank" rel="noopener noreferrer" className="w-full">
        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
          W2C <ShoppingCart className="ml-2 h-4 w-4" />
        </Button>
      </a>
    </CardFooter>
  </Card>
)

export function W2CClientPage({ initialProducts }: { initialProducts: Product[] }) {
  const [products] = useState<Product[]>(initialProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("name-asc")

  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        switch (sortOrder) {
          case "price-asc":
            return a.price - b.price
          case "price-desc":
            return b.price - a.price
          case "name-desc":
            return b.name.localeCompare(a.name)
          case "name-asc":
          default:
            return a.name.localeCompare(b.name)
        }
      })
  }, [products, searchTerm, sortOrder])

  return (
    <>
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name or category..."
            className="pl-10 h-12 bg-gray-900/40 border-gray-800/60"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-full md:w-[180px] h-12 bg-gray-900/40 border-gray-800/60">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Name: A-Z</SelectItem>
            <SelectItem value="name-desc">Name: Z-A</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {filteredAndSortedProducts.length === 0 ? (
         <Card className="bg-yellow-900/20 border-yellow-500/30 text-yellow-300 mt-8">
          <CardContent className="p-6 flex items-center gap-4">
            <AlertTriangle className="w-8 h-8" />
            <div>
              <h3 className="font-bold text-lg">No Products Found</h3>
              <p>No products match your current search and filter criteria.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  )
}