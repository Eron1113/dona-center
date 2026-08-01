"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SHIPPING_RULES, getShippingInfo } from "@/lib/shipping"

interface CartLine {
  productId: string
  productName: string
  productSlug: string
  productImage: string
  color: string
  size: string
  quantity: number
  price: number
}

export default function CartPage() {
  const [cart, setCart] = useState<CartLine[]>([])
  const [mounted, setMounted] = useState(false)
  const [country, setCountry] = useState("Kosovë")

  useEffect(() => {
    const load = () => {
      setCart(JSON.parse(localStorage.getItem("dona-center-cart") || "[]"))
    }
    load()
    // Mark mounted so the SSR-rendered empty state is replaced after hydration
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount gate for client-only cart data
    setMounted(true)
    window.addEventListener("storage", load)
    return () => window.removeEventListener("storage", load)
  }, [])

  const saveCart = (next: CartLine[]) => {
    setCart(next)
    localStorage.setItem("dona-center-cart", JSON.stringify(next))
    window.dispatchEvent(new Event("storage"))
  }

  const updateQuantity = (index: number, delta: number) => {
    const next = [...cart]
    next[index].quantity = Math.max(1, next[index].quantity + delta)
    saveCart(next)
  }

  const removeItem = (index: number) => {
    saveCart(cart.filter((_, i) => i !== index))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingInfo = getShippingInfo(country)
  const shipping = subtotal === 0 ? 0 : shippingInfo ? shippingInfo.cost : 2
  const total = subtotal + shipping

  if (!mounted) return null

  return (
    <div className="container py-8 md:py-12">
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-8">Shporta</h1>

      {cart.length === 0 ? (
        <div className="text-center py-24">
          <ShoppingBag size={56} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Shporta juaj është bosh
          </h2>
          <p className="text-gray-500 mb-8">
            Zbuloni produktet tona dhe shtoni diçka të bukur në shportë.
          </p>
          <Button asChild size="lg">
            <Link href="/women">
              Shko te Produktet <ArrowRight size={18} />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <div
                key={`${item.productId}-${item.color}-${item.size}`}
                className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-white"
              >
                <Link
                  href={`/product/${item.productSlug}`}
                  className="relative w-24 h-28 shrink-0 rounded-lg overflow-hidden bg-gray-50"
                >
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/product/${item.productSlug}`}
                      className="font-medium text-gray-900 hover:text-primary transition-colors line-clamp-1"
                    >
                      {item.productName}
                    </Link>
                    <button
                      onClick={() => removeItem(index)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Hiq nga shporta"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {item.color}
                    {item.size ? ` • Madhësia ${item.size}` : ""}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border-2 rounded-lg">
                      <button
                        onClick={() => updateQuantity(index, -1)}
                        className="p-2 hover:bg-gray-50 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 py-1 text-sm font-medium min-w-[32px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(index, 1)}
                        className="p-2 hover:bg-gray-50 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="font-bold text-gray-900">
                      €{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-24 h-fit space-y-4 p-6 rounded-2xl bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Përmbledhja</h2>

            {/* Country selector — live shipping update */}
            <div className="space-y-2">
              <label htmlFor="cart-country" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Truck size={16} className="text-primary" /> Vendi i dorëzimit
              </label>
              <select
                id="cart-country"
                value={country}
                onChange={e => setCountry(e.target.value)}
                className="w-full h-11 rounded-xl border-2 border-gray-200 bg-white px-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {SHIPPING_RULES.map(s => (
                  <option key={s.country} value={s.country}>
                    {s.country} • {s.cost === 0 ? "Falas" : `€${s.cost}`} • {s.deliveryTime}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Nëntotali</span>
                <span className="font-medium text-gray-900">€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Transporti ({country})</span>
                <span className="font-medium text-gray-900">
                  {shipping === 0 ? "Falas" : `€${shipping.toFixed(2)}`}
                </span>
              </div>
              {shipping > 0 && shippingInfo && (
                <p className="text-xs text-gray-400">
                  {shippingInfo.deliveryTime}
                </p>
              )}
              <div className="border-t pt-2 flex justify-between">
                <span className="font-semibold text-gray-900">Totali</span>
                <span className="font-bold text-primary">€{total.toFixed(2)}</span>
              </div>
            </div>
            {shippingInfo && shipping > 0 && (
              <p className="text-xs text-gray-500 bg-white rounded-lg p-3 border border-gray-100">
                🚚 Transporti në {country}: €{shipping.toFixed(2)} • {shippingInfo.deliveryTime}
              </p>
            )}
            <Button asChild className="w-full h-12 rounded-xl text-base">
              <Link href="/checkout">
                Vazhdo te Pagesa <ArrowRight size={18} />
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/women">Vazhdo të blesh</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
