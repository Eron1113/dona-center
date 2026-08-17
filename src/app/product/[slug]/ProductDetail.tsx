"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  Star,
  Truck,
  Shield,
  RefreshCw,
  Check,
  Ruler,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
  Shirt,
  Droplets,
  Sun,
  Thermometer,
  Scissors,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { CartItem, Product } from "@/lib/data"
import { SHIPPING_RULES, getShippingInfo } from "@/lib/shipping"
import { getCareInfo } from "@/lib/care"

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800"

const SIZE_GUIDE: { size: string; chest: string; waist: string; hips: string }[] = [
  { size: "XS", chest: "81-86 cm", waist: "66-71 cm", hips: "81-86 cm" },
  { size: "S", chest: "86-91 cm", waist: "71-76 cm", hips: "86-91 cm" },
  { size: "M", chest: "96-101 cm", waist: "81-86 cm", hips: "96-101 cm" },
  { size: "L", chest: "106-111 cm", waist: "91-96 cm", hips: "106-111 cm" },
  { size: "XL", chest: "116-121 cm", waist: "101-106 cm", hips: "116-121 cm" },
  { size: "XXL", chest: "126-131 cm", waist: "111-116 cm", hips: "126-131 cm" },
]

// Show only the guide rows for sizes this product actually has. Custom
// size names (shoes: 36–45, or "One Size") simply don't appear in the
// table — the modal falls back to a generic note in that case.
function buildSizeGuideRows(sizes: string[]) {
  return SIZE_GUIDE.filter(row => sizes.includes(row.size))
}

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter()
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "")
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [deliveryCountry, setDeliveryCountry] = useState("Kosovë")
  // Touch swipe start X for the mobile gallery
  const touchStartX = useRef<number | null>(null)
  // Set right after a swipe so the click that follows it doesn't toggle zoom
  const swipedRef = useRef(false)

  const images =
    selectedColor?.images?.length
      ? selectedColor.images
      : [product.colors[0]?.images[0] || FALLBACK_IMAGE]

  // Track recent views for the "Recently viewed" section
  useEffect(() => {
    const entry = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.colors[0]?.images[0] || "",
      price: product.discountPercent > 0
        ? product.basePrice * (1 - product.discountPercent / 100)
        : product.basePrice,
    }
    const recent = JSON.parse(localStorage.getItem("dona-center-recent") || "[]") as { id: string }[]
    const filtered = recent.filter(r => r.id !== product.id)
    localStorage.setItem("dona-center-recent", JSON.stringify([entry, ...filtered].slice(0, 8)))
  }, [product.id, product.name, product.slug, product.basePrice, product.discountPercent, product.colors])

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("dona-center-wishlist") || "[]")
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate wishlist state from localStorage on mount
    setIsWishlisted(wishlist.includes(product.id))
  }, [product.id])

  const discountPrice =
    product.discountPercent > 0
      ? product.basePrice * (1 - product.discountPercent / 100)
      : null

  // Size-less products (bags, accessories) store their whole quantity under
  // the "" (empty) key, so read that directly instead of keying by size.
  const currentStock = selectedColor ? product.stock[selectedColor.name] || {} : {}
  const sizeStock =
    product.sizes.length === 0
      ? currentStock[""] ?? 0
      : selectedSize
        ? currentStock[selectedSize] ?? 0
        : 0
  const isOutOfStock = sizeStock === 0

  const deliveryInfo = getShippingInfo(deliveryCountry)
  const deliveryCost = deliveryInfo?.cost ?? 0

  const careInfo = getCareInfo(product)

  const addToCart = () => {
    if (isOutOfStock) return false
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
    return true
  }

  const handleAddToCart = () => {
    if (!addToCart()) return
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 1800)
  }

  const handleBuyNow = () => {
    if (addToCart()) {
      router.push("/checkout")
    }
  }

  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("dona-center-wishlist") || "[]")
    const newWishlist = wishlist.includes(product.id)
      ? wishlist.filter((id: string) => id !== product.id)
      : [...wishlist, product.id]
    localStorage.setItem("dona-center-wishlist", JSON.stringify(newWishlist))
    setIsWishlisted(!isWishlisted)
  }

  const selectColor = (color: typeof selectedColor) => {
    setSelectedColor(color)
    setSelectedSize(product.sizes[0] || "")
    setQuantity(1)
    setActiveImage(0)
    setIsZoomed(false)
  }

  return (
    <>
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Gallery */}
        <div>
          <div
            className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 group touch-pan-y"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onTouchStart={e => {
              touchStartX.current = e.touches[0]?.clientX ?? null
            }}
            onTouchEnd={e => {
              if (touchStartX.current === null || images.length <= 1) return
              const delta = e.changedTouches[0].clientX - touchStartX.current
              touchStartX.current = null
              if (Math.abs(delta) > 40) {
                swipedRef.current = true
                setActiveImage(prev =>
                  (prev + (delta < 0 ? 1 : -1) + images.length) % images.length
                )
                setIsZoomed(false)
              }
            }}
            onClick={() => {
              if (swipedRef.current) {
                swipedRef.current = false
                return
              }
              setIsZoomed(z => !z)
            }}
          >
            {/* Crossfade on color/image change: keyed remount fades the new photo in */}
            <Image
              key={images[activeImage] || images[0]}
              src={images[activeImage] || images[0]}
              alt={product.name}
              fill
              className={cn(
                "object-cover transition-transform duration-500 animate-in fade-in duration-500",
                isZoomed ? "scale-150 cursor-zoom-out" : "scale-100 cursor-zoom-in"
              )}
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            {/* Zoom hint */}
            <span
              className={cn(
                "absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-gray-700 transition-all",
                isZoomed ? "opacity-0" : "opacity-100"
              )}
            >
              <ZoomIn size={18} />
            </span>

            {product.discountPercent > 0 && (
              <Badge className="absolute top-4 left-4 bg-red-500 text-white border-0 shadow-lg text-sm px-3 py-1">
                -{product.discountPercent}%
              </Badge>
            )}

            {/* Image counter */}
            {images.length > 1 && (
              <span className="absolute top-4 right-16 bg-black/50 text-white text-xs font-medium rounded-full px-3 py-1 backdrop-blur-sm">
                {activeImage + 1} / {images.length}
              </span>
            )}

            {/* Progress dots — swipe position on mobile */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      activeImage === i
                        ? "w-6 bg-primary shadow-sm"
                        : "w-1.5 bg-black/25"
                    )}
                  />
                ))}
              </div>
            )}

            <button
              onClick={e => {
                e.stopPropagation()
                toggleWishlist()
              }}
              className={cn(
                "absolute top-4 right-4 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all hover:scale-110",
                isWishlisted ? "text-red-500" : "text-gray-700 hover:text-red-500"
              )}
              aria-label="Shto në të preferuarat"
            >
              <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
            </button>

            {/* Prev / Next */}
            {images.length > 1 && (
              <>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    setActiveImage(prev => (prev - 1 + images.length) % images.length)
                    setIsZoomed(false)
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-gray-700 hover:text-primary transition-all md:opacity-0 md:group-hover:opacity-100"
                  aria-label="Fotoja e mëparshme"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    setActiveImage(prev => (prev + 1) % images.length)
                    setIsZoomed(false)
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-gray-700 hover:text-primary transition-all md:opacity-0 md:group-hover:opacity-100"
                  aria-label="Fotoja tjetër"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails — clickable */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3 mt-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveImage(i)
                    setIsZoomed(false)
                  }}
                  className={cn(
                    "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
                    activeImage === i
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent hover:border-gray-300"
                  )}
                  aria-label={`Foto ${i + 1}`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} - foto ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="25vw"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
              {product.category === "women" ? "Gratë" : "Burrat"}
            </p>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-center gap-2 mt-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-200"
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.rating} ({product.soldCount} të shitura)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span
              className={cn(
                "text-4xl font-bold",
                discountPrice ? "text-red-500" : "text-gray-900"
              )}
            >
              €{(discountPrice || product.basePrice).toFixed(2)}
            </span>
            {discountPrice && (
              <span className="text-xl text-gray-400 line-through">
                €{product.basePrice.toFixed(2)}
              </span>
            )}
            {discountPrice && (
              <span className="text-sm font-medium text-green-600">
                Kurseni €{(product.basePrice - discountPrice).toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {/* Colors */}
          {product.colors.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-900 mb-3">
                Ngjyra: <span className="text-gray-500">{selectedColor.name}</span>
              </p>
              <div className="flex gap-3">
                {product.colors.map(color => (
                  <button
                    key={color.name}
                    onClick={() => selectColor(color)}
                    className={cn(
                      "w-11 h-11 rounded-full border-2 transition-all duration-200",
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
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-900">
                  Madhësia: <span className="text-gray-500">{selectedSize}</span>
                </p>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
                >
                  <Ruler size={16} /> Udhëzuesi i madhësive
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => {
                  const stock = product.stock[selectedColor.name]?.[size] || 0
                  return (
                    <button
                      key={size}
                      disabled={stock === 0}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "min-w-[52px] px-4 py-3 rounded-lg text-sm font-medium border-2 transition-all",
                        selectedSize === size
                          ? "border-primary bg-primary/5 text-primary"
                          : stock === 0
                            ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through"
                            : "border-gray-200 hover:border-gray-400 text-gray-700"
                      )}
                    >
                      {size}
                      {stock === 0 && (
                        <span className="block text-[10px] text-gray-300">Mbaruar</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium text-gray-900">Madhësia:</p>
              <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-gray-100 text-sm font-medium text-gray-700">
                <Ruler size={16} className="text-gray-400" />
                One Size / Standard
              </span>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <p className="text-sm font-medium text-gray-900">Sasia:</p>
            <div className="flex items-center border-2 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-gray-50 transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="px-5 py-3 font-medium text-sm min-w-[44px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(sizeStock || 99, quantity + 1))}
                className="p-3 hover:bg-gray-50 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            {(selectedSize || product.sizes.length === 0) && (
              <span className="text-sm text-gray-400">{sizeStock} në stok</span>
            )}          </div>

          {/* Add to cart */}
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="w-full h-14 text-lg rounded-xl"
            size="xl"
          >
            {addedToCart ? (
              <>
                <Check size={20} /> Shtuar në Shportë!
              </>
            ) : isOutOfStock ? (
              "Mbaruar nga Stoku"
            ) : (
              <>
                <ShoppingBag size={20} /> Shto në Shportë
              </>
            )}
          </Button>

          <Button
            variant="outline"
            className="w-full h-12 rounded-xl text-base"
            onClick={handleBuyNow}
            disabled={isOutOfStock}
          >
            Bli Tani
          </Button>

          {/* Product care */}
          <div className="p-4 rounded-xl border border-gray-100 space-y-3">
            <div className="flex items-center gap-2">
              <Shirt className="text-primary" size={20} />
              <p className="text-sm font-semibold text-gray-900">Kujdesi për produktin</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div className="flex items-start gap-2">
                <Shirt size={16} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-gray-400 text-xs">Materiali</p>
                  <p className="font-medium text-gray-700">{careInfo.material}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Droplets size={16} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-gray-400 text-xs">Larja</p>
                  <p className="font-medium text-gray-700">{careInfo.wash}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Sun size={16} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-gray-400 text-xs">Tharja</p>
                  <p className="font-medium text-gray-700">{careInfo.dry}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Thermometer size={16} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-gray-400 text-xs">Hekurosja</p>
                  <p className="font-medium text-gray-700">{careInfo.iron}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 col-span-1 sm:col-span-2">
                <Scissors size={16} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-gray-400 text-xs">Zbardhuesi</p>
                  <p className="font-medium text-gray-700">{careInfo.bleach}</p>
                </div>
              </div>
            </div>
            {careInfo.note && (
              <p className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
                <Info size={14} className="text-primary mt-0.5 shrink-0" />
                {careInfo.note}
              </p>
            )}
          </div>

          {/* Delivery estimator */}
          <div className="p-4 rounded-xl bg-gray-50 space-y-3">
            <div className="flex items-center gap-2">
              <Truck className="text-primary" size={20} />
              <p className="text-sm font-semibold text-gray-900">
                Transporti sipas vendit
              </p>
            </div>
            <select
              value={deliveryCountry}
              onChange={e => setDeliveryCountry(e.target.value)}
              className="w-full h-11 rounded-xl border-2 border-gray-200 bg-white px-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              aria-label="Vendi i dorëzimit"
            >
              {SHIPPING_RULES.map(s => (
                <option key={s.country} value={s.country}>
                  {s.country} • {s.cost === 0 ? "Falas" : `€${s.cost}`}
                </option>
              ))}
            </select>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{deliveryInfo?.deliveryTime}</span>
              <span className="font-semibold text-gray-900">
                €{deliveryCost.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Pagesë në dorëzim • Kosovë €2, Shqipëri €6, Maqedoni e Veriut €6
            </p>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
            <div className="flex flex-col items-center gap-2 text-center">
              <Shield className="text-primary" size={22} />
              <p className="text-xs text-gray-500 font-medium">Produkte origjinale</p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <RefreshCw className="text-primary" size={22} />
              <p className="text-xs text-gray-500 font-medium">Shkëmbim vetëm në butik</p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <Ruler className="text-primary" size={22} />
              <p className="text-xs text-gray-500 font-medium">Udhëzues madhësish</p>
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsSizeGuideOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-all"
              aria-label="Mbyll"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Udhëzuesi i madhësive</h3>
            <p className="text-sm text-gray-500 mb-5">
              Matjet në centimetra. Zgjidhni madhësinë sipas trupit tuaj.
            </p>
            {buildSizeGuideRows(product.sizes).length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-100">
                      <th className="pb-3 font-medium">Madhësia</th>
                      <th className="pb-3 font-medium">Gjoksi</th>
                      <th className="pb-3 font-medium">Bel</th>
                      <th className="pb-3 font-medium">Ijet</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buildSizeGuideRows(product.sizes).map(row => (
                      <tr key={row.size} className="border-b border-gray-50">
                        <td className="py-3 font-semibold text-gray-900">{row.size}</td>
                        <td className="py-3 text-gray-600">{row.chest}</td>
                        <td className="py-3 text-gray-600">{row.waist}</td>
                        <td className="py-3 text-gray-600">{row.hips}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
                Ky produkt përdor madhësi të veçanta (
                <span className="font-semibold text-gray-900">{product.sizes.join(", ")}</span>).
                Nëse keni dyshime për madhësinë, kontaktoni ne dhe do t&apos;ju ndihmojmë.
              </div>
            )}
            <p className="text-xs text-gray-400 mt-4">
              💡 Nëse jeni mes dy madhësive, rekomandojmë të zgjidhni madhësinë më të madhe.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
