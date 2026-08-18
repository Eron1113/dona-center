"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Eye, Star, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/data"
import { QuickViewModal } from "./QuickViewModal"

const CATEGORY_LABELS: Record<string, string> = {
  women: "Koleksioni",
}

interface ProductCardProps {
  product: Product
  priority?: boolean
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  // 3D tilt — subtle perspective rotation following the pointer (desktop only)
  const tiltRef = useRef<HTMLDivElement>(null)

  const handleTiltMove = (e: React.MouseEvent) => {
    const el = tiltRef.current
    if (!el || window.matchMedia("(hover: none)").matches) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(900px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg)`
  }

  const handleTiltLeave = () => {
    const el = tiltRef.current
    if (el) el.style.transform = ""
  }

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("dona-center-wishlist") || "[]")
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate wishlist state from localStorage on mount
    setIsWishlisted(wishlist.includes(product.id))
  }, [product.id])

  const discountPrice = product.discountPercent > 0
    ? product.basePrice * (1 - product.discountPercent / 100)
    : null

  // Stock for the selected color (bags use the "" key) — drives the
  // low-stock / sold-out badges and disables the add-to-cart button.
  const colorStock = selectedColor ? product.stock[selectedColor.name] || {} : {}
  const totalColorStock = Object.values(colorStock).reduce((sum, n) => sum + n, 0)
  const isOutOfStock = totalColorStock === 0
  const isLowStock = !isOutOfStock && totalColorStock <= 3

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const wishlist = JSON.parse(localStorage.getItem("dona-center-wishlist") || "[]")
    let newWishlist: string[]
    if (wishlist.includes(product.id)) {
      newWishlist = wishlist.filter((id: string) => id !== product.id)
    } else {
      newWishlist = [...wishlist, product.id]
    }
    localStorage.setItem("dona-center-wishlist", JSON.stringify(newWishlist))
    setIsWishlisted(!isWishlisted)
  }

  const mainImage = selectedColor.images[0] || "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800"
  // Hover swap: show the color's second photo (or another color's first) on hover
  const hoverImage =
    selectedColor.images[1] ||
    product.colors.find(c => c.name !== selectedColor.name)?.images[0]

  return (
    <>
      <div className="group relative">
        {/* Image Container — 3D tilt wrapper */}
        <div
          ref={tiltRef}
          onMouseMove={handleTiltMove}
          onMouseLeave={handleTiltLeave}
          className="transition-transform duration-300 ease-out [transform-style:preserve-3d]"
        >
        <Link href={`/product/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-50 shadow-sm group-hover:shadow-xl group-hover:shadow-primary/10 transition-shadow duration-500">
          {/* Image */}
          <div className="relative w-full h-full">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className={cn(
                "object-cover transition-all duration-700 ease-out group-hover:scale-105",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority={priority}
              onLoad={() => setImageLoaded(true)}
            />
            {hoverImage && (
              <Image
                src={hoverImage}
                alt=""
                fill
                className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            )}
            {/* Loading skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse" />
            )}
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.discountPercent > 0 && (
              <Badge className="bg-red-500 text-white border-0 shadow-lg">
                -{product.discountPercent}%
              </Badge>
            )}
            {product.soldCount > 100 && (
              <Badge variant="secondary" className="bg-white/90 text-primary border-0 shadow-lg backdrop-blur-sm">
                Më i shitur
              </Badge>
            )}
            {isOutOfStock && (
              <Badge className="bg-gray-800 text-white border-0 shadow-lg">
                Mbaruar nga stoku
              </Badge>
            )}
            {isLowStock && (
              <Badge className="bg-amber-500 text-white border-0 shadow-lg">
                Vetëm {totalColorStock} të mbetura
              </Badge>
            )}
          </div>

          {/* Quick Actions - always visible on touch/mobile, hover on desktop */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 md:opacity-0 md:group-hover:opacity-100 md:translate-x-2 md:group-hover:translate-x-0 transition-all duration-300">
            <button
              onClick={toggleWishlist}
              className={cn(
                "w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all hover:scale-110",
                isWishlisted ? "text-red-500" : "text-gray-700 hover:text-red-500"
              )}
              aria-label="Shto në të preferuarat"
            >
              <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsQuickViewOpen(true)
              }}
              className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-gray-700 hover:text-primary transition-all hover:scale-110"
              aria-label="Shiko shpejt"
            >
              <Eye size={18} />
            </button>
          </div>
        </Link>
        </div>

        {/* Product Info */}
        <Link href={`/product/${product.slug}`} className="block mt-4 space-y-2">
          <h3 className="font-medium text-sm text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
          {CATEGORY_LABELS[product.category] && (
            <p className="text-xs text-gray-400">{CATEGORY_LABELS[product.category]}</p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}
              />
            ))}
            <span className="text-xs text-gray-400 ml-1">({product.soldCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-base font-bold",
              discountPrice ? "text-red-500" : "text-gray-900"
            )}>
              €{(discountPrice || product.basePrice).toFixed(2)}
            </span>
            {discountPrice && (
              <span className="text-xs text-gray-400 line-through">
                €{product.basePrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Color Options */}
          {product.colors.length > 1 && (
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setSelectedColor(color)
                  }}
                  className={cn(
                    "w-6 h-6 rounded-full border-2 transition-all duration-200 p-0.5",
                    selectedColor.name === color.name
                      ? "border-primary scale-110 shadow-sm"
                      : "border-gray-200 hover:border-gray-400"
                  )}
                  style={{ backgroundColor: color.hex }}
                  aria-label={color.name}
                  title={color.name}
                />
              ))}
            </div>
          )}
        </Link>

        {/* View Product - full-width button, always visible, works on ALL devices */}
        <Link
          href={`/product/${product.slug}`}
          className="mt-3 w-full h-12 rounded-xl border-2 border-gray-200 bg-white inline-flex items-center justify-center gap-2 text-sm font-semibold text-gray-800 hover:border-primary/40 hover:text-primary transition-all active:scale-[0.98]"
        >
          Shiko Produktin
          <ArrowRight size={16} />
        </Link>
      </div>

      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  )
}
