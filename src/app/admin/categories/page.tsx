import Image from "next/image"
import { getCategories, getProducts } from "@/lib/data"
import { RefreshCw } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminCategoriesPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()])

  // Compute real product counts
  const counts = categories.map(category => ({
    ...category,
    productCount:
      category.slug === "new-arrivals" || category.slug === "best-sellers"
        ? products.filter(p =>
            category.slug === "new-arrivals"
              ? p.tags.includes("new-arrivals")
              : p.tags.includes("best-sellers")
          ).length
        : products.filter(p => p.category === category.id).length,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Kategoritë</h1>
        <p className="text-gray-500">Kategoritë e dyqanit tënd</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {counts.map(category => (
          <div
            key={category.id}
            className="p-6 rounded-2xl border border-gray-100 bg-white flex items-center gap-4"
          >
            <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-400">/{category.slug}</p>
              <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/5 rounded-full px-3 py-1">
                <RefreshCw size={12} /> {category.productCount} produkte
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
