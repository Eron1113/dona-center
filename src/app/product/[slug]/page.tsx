import { notFound } from "next/navigation"
import { Sparkles } from "lucide-react"
import { getProductBySlug, getProductsByCategory } from "@/lib/data"
import { getStyleMatches } from "@/lib/styles"
import { ProductDetail } from "./ProductDetail"
import { ProductCard } from "@/components/product/ProductCard"
import { RecentlyViewed } from "@/components/product/RecentlyViewed"

// Fresh data on every request so price/stock changes from the admin panel
// are reflected immediately on the product page.
export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  return {
    title: product ? `${product.name} | DonaCenter` : "Produkt | DonaCenter",
    description: product?.description,
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  const [related, styleMatches] = await Promise.all([
    getProductsByCategory(product.category).then(ps =>
      ps.filter(p => p.id !== product.id).slice(0, 4)
    ),
    getStyleMatches(product, 3),
  ])

  // Don't show the same product in both 'Kombinoje me' and 'Produkte të Ngjashme'
  const relatedIds = new Set(related.map(p => p.id))
  const styleMatchesFiltered = styleMatches.filter(p => !relatedIds.has(p.id))

  return (
    <div className="container py-8 md:py-12">
      <ProductDetail product={product} />

      {/* Style matches — 'Kombinoje me' */}
      {styleMatchesFiltered.length > 0 && (
        <section className="mt-20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={22} className="text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Kombinoje me
            </h2>
          </div>
          <p className="text-gray-500 mb-8">
            Përfundo look-un tënd me këto pjesë që i shkojnë {product.name}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {styleMatchesFiltered.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Produkte të Ngjashme
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <RecentlyViewed currentId={product.id} />
    </div>
  )
}
