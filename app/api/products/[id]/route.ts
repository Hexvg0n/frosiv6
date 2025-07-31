import { NextResponse } from "next/server"
import { db } from "@/lib/mock-db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const product = await db.getProductById(params.id)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const productData = await request.json()
    const updatedProduct = await db.updateProduct(params.id, productData)
    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    return NextResponse.json(updatedProduct)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const success = await db.deleteProduct(params.id)
    if (!success) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Product deleted" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
