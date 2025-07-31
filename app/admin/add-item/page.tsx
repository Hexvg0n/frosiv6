import { ItemForm } from "@/components/admin/item-form"
import { addItemAction } from "../actions"

export default function AddItemPage() {
  return <ItemForm action={addItemAction} />
}
