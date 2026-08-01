import { searchProducts } from "@/lib/data"
import { ProductGrid } from "@/components/product/ProductGrid"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Kërko | DonaCenter",
  description: "Kërkoni produkte në DonaCenter.",
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q = "" } = await searchParams
  const products = q.trim() ? await searchProducts(q.trim()) : []

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {q.trim() ? `Rezultatet për "${q}"` : "Kërko"}
        </h1>
        <p className="text-gray-500">
          {q.trim()
            ? `${products.length} ${products.length === 1 ? "produkt i gjetur" : "produkte të gjetura"}`
            : "Shkruani një fjalë kërkimi në shiritin lart për të gjetur produkte."}
        </p>
      </div>

      {q.trim() ? (
        <ProductGrid products={products} showFilters={false} />
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">Asgjë për të shfaqur ende</p>
        </div>
      )}
    </div>
  )
}
