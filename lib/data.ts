import type { Product } from "./mock-db"

// This file is now an API client. It fetches data from our API routes.
// This abstracts away the data source from the rest of the application.

const getBaseUrl = () => process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${getBaseUrl()}/api/products`, { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch products")
  return res.json()
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const res = await fetch(`${getBaseUrl()}/api/products/${id}`, { cache: "no-store" })
  if (!res.ok) return undefined
  return res.json()
}

export async function addProduct(product: Omit<Product, "id">): Promise<Product> {
  const res = await fetch(`${getBaseUrl()}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  })
  if (!res.ok) throw new Error("Failed to add product")
  return res.json()
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
  const res = await fetch(`${getBaseUrl()}/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to update product")
  return res.json()
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${getBaseUrl()}/api/products/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error("Failed to delete product")
}
