"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, ShoppingBag, Heart, Minus, Plus, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { CartItem, Product } from "@/lib/data"

interface QuickViewModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "")
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  if (!isOpen) return null

  const discountPrice = product.discountPercent > 0
    ? product.basePrice * (1 - product.discountPercent / 100)
    : null

  const currentStock = selectedColor.name ? product.stock[selectedColor.name] || {} : {}
  // Size-less products (bags) store their whole quantity under the "" key
  const sizeStock =
    product.sizes.length === 0
      ? currentStock[""] ?? 0
      : selectedSize
        ? currentStock[selectedSize] ?? 0
        : 0
  const isOutOfStock = sizeStock === 0

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("dona-center-cart") || "[]") as CartItem[]
    const existingIndex = cart.findIndex(
      item =>
        item.productId === product.id &&
        item.color === selectedColor.name &&
        item.size === selectedSize
    )

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity
    } else {
      cart.push({
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        productImage: selectedColor.images[0],
        color: selectedColor.name,
        size: selectedSize,
        quantity,
        price: discountPrice || product.basePrice,
      })
    }

    localStorage.setItem("dona-center-cart", JSON.stringify(cart))
    window.dispatchEvent(new Event("storage"))
    setAddedToCart(true)
    setTimeout(() => {
      setAddedToCart(false)
      onClose()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all"
        >
          <X size={20} />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative aspect-square md:aspect-auto md:h-full min-h-[300px] bg-gray-50">
            <Image
              src={selectedColor.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {product.discountPercent > 0 && (
              <Badge className="absolute top-4 left-4 bg-red-500 text-white border-0 shadow-lg">
                -{product.discountPercent}%
              </Badge>
            )}
          </div>

          {/* Details */}
          <div className="p-6 md:p-8">
            {/* Category */}
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
              {product.category === "women" ? "Gratë" : "Burrat"}
            </p>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.soldCount} të shitura)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className={cn(
                "text-3xl font-bold",
                discountPrice ? "text-red-500" : "text-gray-900"
              )}>
                €{(discountPrice || product.basePrice).toFixed(2)}
              </span>
              {discountPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">€{product.basePrice.toFixed(2)}</span>
                  <span className="text-sm font-medium text-green-600">Kurseni €{(product.basePrice - discountPrice).toFixed(2)}</span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed mb-6">{product.description}</p>

            {/* Colors */}
            {product.colors.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-900 mb-3">
                  Ngjyra: <span className="text-gray-500">{selectedColor.name}</span>
                </p>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => {
                        setSelectedColor(color)
                        setSelectedSize(product.sizes[0] || "")
                        setQuantity(1)
                      }}
                      className={cn(
                        "w-10 h-10 rounded-full border-2 transition-all duration-200",
                        selectedColor.name === color.name
                          ? "border-primary scale-110 shadow-md ring-2 ring-primary/20"
                          : "border-gray-200 hover:border-gray-400"
                      )}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes.length > 0 ? (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-900 mb-3">
                  Madhësia: <span className="text-gray-500">{selectedSize || "Zgjidh"}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const stock = product.stock[selectedColor.name]?.[size] || 0
                    return (
                      <button
                        key={size}
                        disabled={stock === 0}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "min-w-[48px] px-4 py-2.5 rounded-lg text-sm font-medium border-2 transition-all",
                          selectedSize === size
                            ? "border-primary bg-primary/5 text-primary"
                            : stock === 0
                              ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through"
                              : "border-gray-200 hover:border-gray-400 text-gray-700"
                        )}
                      >
                        {size}
                        {stock === 0 && <span className="block text-[10px] text-gray-300">Mbaruar</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-900 mb-3">
                  Madhësia: <span className="text-gray-500">One Size / Standard</span>
                </p>
                <span className="inline-flex items-center px-4 py-2.5 rounded-lg bg-gray-100 text-sm font-medium text-gray-700">
                  One Size
                </span>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <p className="text-sm font-medium text-gray-900">Sasia:</p>
              <div className="flex items-center border-2 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-50 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 font-medium text-sm min-w-[40px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(sizeStock || 99, quantity + 1))}
                  className="p-2 hover:bg-gray-50 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              {(selectedSize || product.sizes.length === 0) && (
                <span className="text-xs text-gray-400">
                  {sizeStock} në stok
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 h-12 text-base"
                size="lg"
              >
                <ShoppingBag size={18} />
                {isOutOfStock ? "Mbaruar nga Stoku" : addedToCart ? "Shtuar! ✓" : "Shto në Shportë"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="w-12 h-12 shrink-0"
                onClick={() => {
                  const wishlist = JSON.parse(localStorage.getItem("dona-center-wishlist") || "[]")
                  if (!wishlist.includes(product.id)) {
                    wishlist.push(product.id)
                    localStorage.setItem("dona-center-wishlist", JSON.stringify(wishlist))
                  }
                }}
              >
                <Heart size={18} />
              </Button>
            </div>

            {/* View Details */}
            <Link
              href={`/product/${product.slug}`}
              className="block text-center text-sm text-primary hover:underline mt-4"
              onClick={onClose}
            >
              Shiko detajet e plota →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
