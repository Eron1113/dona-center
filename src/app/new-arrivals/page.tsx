import { getProductsByTag } from "@/lib/data"
import { ProductGrid } from "@/components/product/ProductGrid"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Të Rejat | DonaCenter",
  description: "Zbuloni produktet më të reja në DonaCenter. Koleksioni më i freskët i modës.",
}

export default async function NewArrivalsPage() {
  const products = await getProductsByTag("new-arrivals")

  return (
    <div className="container py-8 md:py-12">
      <ProductGrid
        products={products}
        title="Të Rejat"
        subtitle="Produktet më të reja që sapo kanë mbërritur në dyqan"
      />
    </div>
  )
}
