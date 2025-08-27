// app/admin/actions.ts
"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { addProduct, deleteProduct, updateProduct, type Product } from "@/lib/data"
import { revalidatePath } from "next/cache"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function login(prevState: { error: string } | undefined, formData: FormData) {
  const password = formData.get("password");
  if (password === ADMIN_PASSWORD) {
    (await cookies()).set("admin-auth", "true", {
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
  (await cookies()).delete("admin-auth");
  redirect("/admin/login");
}

export async function addItemAction(formData: FormData) {
  const newProduct = {
    name: formData.get("name") as string,
    price: Number(formData.get("price")),
    category: formData.get("category") as string,
    imageUrl: formData.get("imageUrl") as string,
    w2cLink: formData.get("w2cLink") as string,
  };

  await addProduct(newProduct);
  revalidatePath('/admin/dashboard');
  revalidatePath('/w2c');
  redirect("/admin/dashboard");
}

export async function updateItemAction(id: string, formData: FormData) {
  const updatedProduct: Partial<Product> = {
    name: formData.get("name") as string,
    price: Number(formData.get("price")),
    category: formData.get("category") as string,
    imageUrl: formData.get("imageUrl") as string,
    w2cLink: formData.get("w2cLink") as string,
  };

  await updateProduct(id, updatedProduct);
  revalidatePath('/admin/dashboard');
  revalidatePath('/w2c');
  revalidatePath(`/admin/edit-item/${id}`);
  redirect("/admin/dashboard");
}

export async function deleteItemAction(formData: FormData) {
  const id = formData.get("id") as string;
  await deleteProduct(id);
  revalidatePath('/admin/dashboard');
  revalidatePath('/w2c');
}