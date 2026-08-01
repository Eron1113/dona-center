"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { History } from "lucide-react"

interface RecentProduct {
  id: string
  name: string
  slug: string
  image: string
  price: number
}

export function RecentlyViewed({ currentId }: { currentId?: string }) {
  const [items, setItems] = useState<RecentProduct[]>([])

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("dona-center-recent") || "[]")
    const filtered = (recent as RecentProduct[])
      .filter(r => r.id !== currentId)
      .slice(0, 4)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate recently-viewed from localStorage on mount
    setItems(filtered)
  }, [currentId])

  if (items.length === 0) return null

  return (
    <section className="mt-20">
      <div className="flex items-center gap-2 mb-6">
        <History size={20} className="text-primary" />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Të shikuara së fundmi
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {items.map(item => (
          <Link
            key={item.id}
            href={`/product/${item.slug}`}
            className="group block"
          >
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-50">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 25vw"
              />
            </div>
            <h3 className="mt-3 font-medium text-sm text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
              {item.name}
            </h3>
            <p className="text-sm font-bold text-gray-900 mt-1">€{item.price.toFixed(2)}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
