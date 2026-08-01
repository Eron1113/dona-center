import { getProductsByTag } from "@/lib/data"
import { ProductGrid } from "@/components/product/ProductGrid"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Më të Shitura | DonaCenter",
  description: "Produktet më të shitura në DonaCenter. Zgjidhjet e preferuara nga klientët tanë.",
}

export default async function BestSellersPage() {
  const products = await getProductsByTag("best-sellers")

  return (
    <div className="container py-8 md:py-12">
      <ProductGrid
        products={products}
        title="Më të Shitura"
        subtitle="Produktet që i duan më shumë klientët tanë"
      />
    </div>
  )
}
