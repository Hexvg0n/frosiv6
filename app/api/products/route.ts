import { NextResponse } from "next/server"
import { db } from "@/lib/mock-db"

export async function GET() {
  try {
    const products = await db.getProducts()
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const productData = await request.json()
    const newProduct = await db.addProduct(productData)
    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
