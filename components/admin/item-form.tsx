// components/admin/item-form.tsx
"use client"

import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Product } from "@/lib/data"
import Link from "next/link"

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (isEditing ? "Updating Item..." : "Adding Item...") : isEditing ? "Update Item" : "Add Item"}
    </Button>
  )
}

export function ItemForm({
  item,
  action,
}: {
  item?: Product
  action: (formData: FormData) => void
}) {
  const isEditing = !!item

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Item" : "Add New Item"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" name="name" defaultValue={item?.name} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price (in PLN)</Label>
            <Input id="price" name="price" type="number" step="0.01" defaultValue={item?.price} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" name="imageUrl" defaultValue={item?.imageUrl} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="w2cLink">W2C Link</Label>
            <Input id="w2cLink" name="w2cLink" defaultValue={item?.w2cLink} required />
          </div>
          <div className="flex justify-end gap-4">
            <Link href="/admin/dashboard" passHref>
              <Button variant="outline">Cancel</Button>
            </Link>
            <SubmitButton isEditing={isEditing} />
          </div>
        </form>
      </CardContent>
    </Card>
  )
}