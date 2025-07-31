// This file simulates a database.
// In a real application, this would be replaced with a MongoDB connection.

export interface Product {
  id: string
  name: string
  category: string
  price: number
  imageUrl: string
  w2cLink: string
}

let products: Product[] = [
  {
    id: "1",
    name: "Tech Fleece Hoodie",
    category: "Apparel",
    price: 250,
    imageUrl: "/placeholder.svg?width=400&height=400",
    w2cLink: "https://item.taobao.com/item.htm?id=12345",
  },
  {
    id: "2",
    name: "Dunk Low 'Panda'",
    category: "Shoes",
    price: 320,
    imageUrl: "/placeholder.svg?width=400&height=400",
    w2cLink: "https://weidian.com/item.html?itemID=54321",
  },
]

// Simulate network delay
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

export const db = {
  async getProducts(): Promise<Product[]> {
    await delay(100)
    return products
  },

  async getProductById(id: string): Promise<Product | undefined> {
    await delay(100)
    return products.find((p) => p.id === id)
  },

  async addProduct(productData: Omit<Product, "id">): Promise<Product> {
    await delay(100)
    const newProduct: Product = {
      id: Date.now().toString(),
      ...productData,
    }
    products.push(newProduct)
    return newProduct
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product | null> {
    await delay(100)
    const index = products.findIndex((p) => p.id === id)
    if (index === -1) return null
    products[index] = { ...products[index], ...data }
    return products[index]
  },

  async deleteProduct(id: string): Promise<boolean> {
    await delay(100)
    const initialLength = products.length
    products = products.filter((p) => p.id !== id)
    return products.length < initialLength
  },
}
