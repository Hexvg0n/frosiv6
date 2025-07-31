import { getProducts } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { deleteItemAction } from "../actions"

export default async function AdminDashboard() {
  const products = await getProducts()

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/admin/add-item" passHref>
          <Button>
            <PlusCircle className="w-4 h-4 mr-2" />
            Add New Item
          </Button>
        </Link>
      </div>

      <div className="bg-gray-900/50 border border-gray-700 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700 hover:bg-gray-800/50">
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="border-gray-700 hover:bg-gray-800/50">
                <TableCell>
                  <Image
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    width={50}
                    height={50}
                    className="rounded-md object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.price.toLocaleString("pl-PL", { style: "currency", currency: "PLN" })}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Link href={`/admin/edit-item/${product.id}`} passHref>
                      <Button variant="outline" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <form action={deleteItemAction}>
                      <input type="hidden" name="id" value={product.id} />
                      <Button variant="destructive" size="icon" type="submit">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
