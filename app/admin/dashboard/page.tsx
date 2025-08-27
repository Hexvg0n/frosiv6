// app/admin/dashboard/page.tsx

import { getProducts } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Edit, Trash2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { deleteItemAction } from "../actions"
import { Card, CardContent } from "@/components/ui/card"

export default async function AdminDashboard() {
  let products;
  try {
    // Jeśli ta funkcja działa zbyt wolno z powodu problemów z bazą danych,
    // serwer może nie odpowiedzieć na czas, co spowoduje błąd 522.
    products = await getProducts()
  } catch (error) {
    console.error("Database fetch error on /admin/dashboard:", error);
    // Jeśli wystąpi błąd, renderujemy komunikat zamiast całej strony.
    return (
        <Card className="bg-red-900/20 border-red-500/30 text-red-300">
            <CardContent className="p-6 flex items-center gap-4">
                <AlertTriangle className="w-8 h-8" />
                <div>
                    <h3 className="font-bold text-lg">Błąd krytyczny</h3>
                    <p>Nie można załadować panelu administratora, ponieważ wystąpił problem z połączeniem do bazy danych.</p>
                </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Produkty</h1>
        <Link href="/admin/add-item" passHref>
          <Button>
            <PlusCircle className="w-4 h-4 mr-2" />
            Dodaj nowy przedmiot
          </Button>
        </Link>
      </div>

      <div className="bg-gray-900/50 border border-gray-700 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700 hover:bg-gray-800/50">
              <TableHead>Zdjęcie</TableHead>
              <TableHead>Nazwa</TableHead>
              <TableHead>Cena</TableHead>
              <TableHead className="text-right">Akcje</TableHead>
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
                <TableCell>{product.price.toLocaleString("pl-PL", { style: "currency", currency: "PLN" })}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Link href={`/admin/edit-item/${product.id}`} passHref>
                      <Button variant="outline" size="icon" aria-label="Edytuj przedmiot">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <form action={deleteItemAction}>
                      <input type="hidden" name="id" value={product.id} />
                      <Button variant="destructive" size="icon" type="submit" aria-label="Usuń przedmiot">
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