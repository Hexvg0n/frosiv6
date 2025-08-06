// app/admin/actions.ts
"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { addProduct, deleteProduct, updateProduct, type Product } from "@/lib/data"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "password123";

export async function login(prevState: { error: string } | undefined, formData: FormData) {
  const password = formData.get("password");
  if (password === ADMIN_PASSWORD) {
    // Poprawka: Dodano await
    (await
      // Poprawka: Dodano await
      cookies()).set("admin-auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
    redirect("/admin/dashboard");
  } else {
    return { error: "Invalid password." };
  }
}

export async function logout() {
  // Poprawka: Dodano await
  (await
    // Poprawka: Dodano await
    cookies()).delete("admin-auth");
  redirect("/admin/login");
}

export async function addItemAction(formData: FormData) {
  const newProduct = {
    name: formData.get("name") as string,
    price: Number(formData.get("price")),
    imageUrl: formData.get("imageUrl") as string,
    w2cLink: formData.get("w2cLink") as string,
  };

  await addProduct(newProduct);
  redirect("/admin/dashboard");
}

export async function updateItemAction(id: string, formData: FormData) {
  const updatedProduct: Partial<Product> = {
    name: formData.get("name") as string,
    price: Number(formData.get("price")),
    imageUrl: formData.get("imageUrl") as string,
    w2cLink: formData.get("w2cLink") as string,
  };

  await updateProduct(id, updatedProduct);
  redirect("/admin/dashboard");
}

export async function deleteItemAction(formData: FormData) {
  const id = formData.get("id") as string;
  await deleteProduct(id);
}