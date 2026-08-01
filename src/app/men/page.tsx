import Image from "next/image"
import { getProductsByCategory } from "@/lib/data"
import { ProductGrid } from "@/components/product/ProductGrid"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Veshje për Burra | DonaCenter",
  description: "Zbuloni koleksionin tonë të veshjeve moderne për burrat. Këmisha, pantallona, xhaketa dhe më shumë.",
}

export default async function MenPage() {
  const products = await getProductsByCategory("men")

  return (
    <div>
      {/* Category Hero */}
      <section className="relative h-72 md:h-96 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1488161628813-04466f872be2?w=1600"
          alt="Koleksioni për burra"
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container pb-10 md:pb-14">
            <p className="text-white/70 text-xs uppercase tracking-[0.25em] mb-2">DonaCenter</p>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-white">Burrat</h1>
            <p className="text-white/80 mt-3 max-w-md">
              Koleksioni më i ri i modës për burrat — elegant dhe modern.
            </p>
          </div>
        </div>
      </section>

      <div className="container py-10 md:py-14">
        <ProductGrid products={products} showFilters />
      </div>
    </div>
  )
}
