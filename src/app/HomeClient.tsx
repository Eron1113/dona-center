"use client"

import { ProductCard } from "@/components/product/ProductCard"
import type { Product } from "@/lib/data"

interface HomeClientProps {
  products: Product[]
}

export function HomeClient({ products }: HomeClientProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.slice(0, 8).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
