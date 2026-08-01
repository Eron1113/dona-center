"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle2, Banknote, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SHIPPING_RULES, getShippingInfo } from "@/lib/shipping"
import { createClient } from "@/lib/supabase/client"
import { errorMessage } from "@/lib/utils"
import { v4 as uuidv4 } from "uuid"

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

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartLine[]>([])
  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [orderId, setOrderId] = useState<string | null>(null)

  const [form, setForm] = useState({
    customerName: "",
    customerLastName: "",
    phone: "",
    country: "Kosovë",
    city: "",
    address: "",
    notes: "",
  })

  useEffect(() => {
    // Read the cart from localStorage once after mount (client-only data)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration of cart from localStorage
    setCart(JSON.parse(localStorage.getItem("dona-center-cart") || "[]"))
    setMounted(true)
  }, [])

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingInfo = getShippingInfo(form.country)
  const shippingCost = shippingInfo ? shippingInfo.cost : 0
  const total = subtotal + shippingCost

  const update = (key: string, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const newOrder = {
        id: uuidv4(),
        userId: user?.id || null,
        items: cart,
        customerName: form.customerName,
        customerLastName: form.customerLastName,
        phone: form.phone,
        country: form.country,
        city: form.city,
        address: form.address,
        notes: form.notes,
        subtotal,
        shipping: shippingCost,
        total,
        deliveryEstimate: shippingInfo?.deliveryTime || "",
        paymentMethod: "Para në Dorëzim (COD)",
        status: "pending",
        createdAt: new Date().toISOString(),
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Nuk u arrit të krijohej porosia")
      }

      localStorage.removeItem("dona-center-cart")
      window.dispatchEvent(new Event("storage"))
      setOrderId(newOrder.id)
    } catch (err: unknown) {
      setError(errorMessage(err, "Diçka shkoi keq. Provo përsëri."))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mounted) return null

  // Success screen
  if (orderId) {
    return (
      <div className="container py-16 md:py-24 max-w-xl">
        <div className="text-center space-y-6">
          <CheckCircle2 size={72} className="mx-auto text-green-500" />
          <h1 className="text-3xl font-bold text-gray-900">Faleminderit për porosinë!</h1>
          <p className="text-gray-500">
            Porosia juaj <span className="font-semibold text-gray-900">#{orderId.slice(0, 8).toUpperCase()}</span>{" "}
            u regjistrua me sukses.
          </p>
          <div className="p-6 rounded-2xl bg-gray-50 text-left space-y-2 text-sm">
            <p className="font-semibold text-gray-900">Detajet e porosisë:</p>
            <p className="text-gray-500">
              Mënyra e pagesës: <span className="font-medium text-gray-900">Para në Dorëzim</span>
            </p>
            <p className="text-gray-500">
              Totali: <span className="font-medium text-gray-900">€{total.toFixed(2)}</span>
            </p>
            <p className="text-gray-500">
              Transporti:{" "}
              <span className="font-medium text-gray-900">
                {shippingInfo?.deliveryTime || "Së shpejti"}
              </span>
            </p>
          </div>
          <p className="text-sm text-gray-400">
            Ruani kodin e porosisë — me të mund ta gjurmoni statusin në çdo moment.
          </p>
          <Button asChild variant="outline" className="w-full h-12 rounded-xl">
            <Link href={`/track-order?code=${orderId.slice(0, 8).toUpperCase()}`}>
              Gjurmo Porosinë
            </Link>
          </Button>
          <Button asChild className="w-full h-12 rounded-xl">
            <Link href="/women">Vazhdo të blesh</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="container py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Shporta juaj është bosh</h1>
        <Button asChild>
          <Link href="/women">Shko te Produktet</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8 md:py-12">
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-8">Pagesa</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-8">
        {/* Customer details */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-gray-100 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Të dhënat tuaja</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Emri *</Label>
                <Input
                  id="customerName"
                  required
                  value={form.customerName}
                  onChange={e => update("customerName", e.target.value)}
                  placeholder="Ardian"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerLastName">Mbiemri *</Label>
                <Input
                  id="customerLastName"
                  required
                  value={form.customerLastName}
                  onChange={e => update("customerLastName", e.target.value)}
                  placeholder="Krasniqi"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefoni *</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={form.phone}
                onChange={e => update("phone", e.target.value)}
                placeholder="+383 44 000 000"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-gray-100 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Adresa e dorëzimit</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Vendi *</Label>
                <select
                  id="country"
                  value={form.country}
                  onChange={e => update("country", e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {SHIPPING_RULES.map(s => (
                    <option key={s.country} value={s.country}>
                      {s.country}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Qyteti *</Label>
                <Input
                  id="city"
                  required
                  value={form.city}
                  onChange={e => update("city", e.target.value)}
                  placeholder="Prishtinë"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adresa e plotë *</Label>
              <Input
                id="address"
                required
                value={form.address}
                onChange={e => update("address", e.target.value)}
                placeholder="Rruga ... Nr. ... "
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Shënime (opsionale)</Label>
              <textarea
                id="notes"
                value={form.notes}
                onChange={e => update("notes", e.target.value)}
                rows={3}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                placeholder="Ndonjë shënim për porosinë tuaj..."
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 rounded-lg p-3">{error}</p>
          )}
        </div>

        {/* Order summary */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-gray-50 space-y-4 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold text-gray-900">Porosia juaj</h2>
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cart.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-white shrink-0">
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                      {item.productName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {item.color}
                      {item.size ? ` • ${item.size}` : ""} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    €{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm pt-4 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-500">Nëntotali</span>
                <span className="font-medium">€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Transporti ({form.country})</span>
                <span className="font-medium">
                  {shippingCost === 0 ? "Falas" : `€${shippingCost.toFixed(2)}`}
                </span>
              </div>
              {shippingCost > 0 && shippingInfo && (
                <p className="text-xs text-gray-400">⏱ {shippingInfo.deliveryTime}</p>
              )}
              <div className="flex justify-between text-base border-t pt-2">
                <span className="font-semibold text-gray-900">Totali</span>
                <span className="font-bold text-primary">€{total.toFixed(2)}</span>
              </div>
              {shippingInfo && (
                <p className="text-xs text-gray-400">
                  🚚 Dërgesa në {form.country}: €{shippingCost.toFixed(2)} • {shippingInfo.deliveryTime}
                </p>
              )}
            </div>

            {/* Payment method */}
            <div className="p-4 rounded-xl bg-white border border-gray-100 flex items-center gap-3">
              <Banknote className="text-primary shrink-0" size={22} />
              <div>
                <p className="text-sm font-semibold text-gray-900">Para në Dorëzim</p>
                <p className="text-xs text-gray-400">
                  Paguani kur porosia ju arrin në derë
                </p>
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full h-12 rounded-xl text-base">
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Duke dërguar...
                </>
              ) : (
                `Konfirmo Porosinë • €${total.toFixed(2)}`
              )}
            </Button>
            <p className="text-xs text-gray-400 text-center">
              Duke konfirmuar, ju pranoni kushtet tona të porosisë.
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
