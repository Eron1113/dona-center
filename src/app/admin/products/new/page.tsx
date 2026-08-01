import { getCategories } from "@/lib/data"
import { ProductForm } from "../ProductForm"

export const dynamic = "force-dynamic"

export default async function NewProductPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Shto Produkt të Ri</h1>
      <ProductForm categories={categories} />
    </div>
  )
}
