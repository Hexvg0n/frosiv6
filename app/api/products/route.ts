// app/api/products/route.ts

import { NextResponse } from "next/server";
import { getProducts, addProduct } from "@/lib/data"; // Zmieniono import na lib/data

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const productData = await request.json();
    const { _id, id, ...newProductData } = productData;
    const newProduct = await addProduct(newProductData);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}