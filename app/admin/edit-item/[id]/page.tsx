import { getProductById } from "@/lib/data"
import { ItemForm } from "@/components/admin/item-form"
import { updateItemAction } from "../../actions"
import { notFound } from "next/navigation"

export default async function EditItemPage({ params }: { params: { id: string } }) {
  const item = await getProductById(params.id)
  if (!item) {
    notFound()
  }

  const updateAction = updateItemAction.bind(null, item.id)

  return <ItemForm item={item} action={updateAction} />
}
