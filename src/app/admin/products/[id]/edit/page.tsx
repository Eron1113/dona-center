import { notFound } from "next/navigation"
import { getProductById, getCategories } from "@/lib/data"
import { ProductForm } from "../../ProductForm"

export const dynamic = "force-dynamic"

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [product, categories] = await Promise.all([getProductById(id), getCategories()])

  if (!product) notFound()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Ndrysho: {product.name}</h1>
      <ProductForm product={product} categories={categories} />
    </div>
  )
}
