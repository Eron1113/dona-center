"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { PackageSearch, Loader2, CheckCircle2, XCircle, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const STATUS_LABELS: Record<string, string> = {
  pending: "Në pritje",
  processing: "Në përpunim",
  shipped: "Dërguar",
  delivered: "Dorëzuar",
  cancelled: "Anuluar",
}

const STATUS_STEPS = [
  { key: "pending", label: "Porosia u pranua" },
  { key: "processing", label: "Në përpunim" },
  { key: "shipped", label: "Dërguar" },
  { key: "delivered", label: "Dorëzuar" },
] as const

interface TrackedItem {
  productName: string
  quantity: number
  size: string
  color: string
}

interface TrackedOrder {
  id: string
  status: string
  createdAt: string
  subtotal: number
  shipping: number
  total: number
  deliveryEstimate: string
  paymentMethod: string
  items: TrackedItem[]
}

export default function TrackOrderPage() {
  // useSearchParams() requires a Suspense boundary during prerendering
  return (
    <Suspense fallback={null}>
      <TrackOrderInner />
    </Suspense>
  )
}

function TrackOrderInner() {
  const searchParams = useSearchParams()
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [order, setOrder] = useState<TrackedOrder | null>(null)

  const search = async (query: string) => {
    setLoading(true)
    setError("")
    setOrder(null)
    try {
      const res = await fetch(`/api/track-order?code=${encodeURIComponent(query)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Diçka shkoi keq")
      setOrder(data.order)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Diçka shkoi keq. Provo përsëri.")
    } finally {
      setLoading(false)
    }
  }

  // Prefill the input from ?code=... (e.g. the link on the checkout success
  // screen) and auto-search once.
  useEffect(() => {
    const prefill = searchParams.get("code")
    if (prefill) {
      // Prefill from the ?code= link (e.g. checkout success screen)
      // eslint-disable-next-line react-hooks/set-state-in-effect -- deliberate one-time prefill from URL on mount
      setCode(prefill)
      search(prefill)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    search(code.trim())
  }

  const statusIndex = order ? STATUS_STEPS.findIndex(s => s.key === order.status) : -1
  const isCancelled = order?.status === "cancelled"

  return (
    <div className="container py-8 md:py-12 max-w-2xl">
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-3">Gjurmo Porosinë</h1>
      <p className="text-gray-500 mb-8">
        Futni kodin e porosisë që morët pas porositjes (p.sh.{" "}
        <span className="font-semibold text-gray-700">#0A25CDD9</span>) për të parë statusin.
      </p>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
        <Input
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="#0A25CDD9"
          className="h-12 text-base"
        />
        <Button type="submit" disabled={loading} className="h-12 px-6 rounded-xl shrink-0">
          {loading ? <Loader2 size={18} className="animate-spin" /> : "Kërko"}
        </Button>
      </form>

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
          <XCircle size={18} className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {order && (
        <div className="space-y-6">
          {/* Header */}
          <div className="p-6 rounded-2xl bg-gray-50 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Porosia <span className="font-bold text-gray-900">#{order.id}</span>
              </p>
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold",
                  order.status === "delivered" && "bg-green-100 text-green-800",
                  order.status === "shipped" && "bg-purple-100 text-purple-800",
                  order.status === "processing" && "bg-blue-100 text-blue-800",
                  order.status === "pending" && "bg-yellow-100 text-yellow-800",
                  isCancelled && "bg-red-100 text-red-800"
                )}
              >
                {STATUS_LABELS[order.status] || "Në pritje"}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Porositur më:{" "}
              <span className="font-medium text-gray-900">
                {new Date(order.createdAt).toLocaleDateString("sq-AL", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              Dërgesa e vlerësuar:{" "}
              <span className="font-medium text-gray-900">{order.deliveryEstimate || "Së shpejti"}</span>
            </p>
          </div>

          {/* Status timeline */}
          {isCancelled ? (
            <div className="p-6 rounded-2xl bg-red-50 border border-red-100">
              <p className="font-semibold text-red-700 mb-1">Porosia u anulua</p>
              <p className="text-sm text-red-600">
                Nëse keni pyetje, na kontaktoni dhe do t&apos;ju ndihmojmë.
              </p>
            </div>
          ) : (
            <div className="p-6 rounded-2xl border border-gray-100">
              <h2 className="font-semibold text-gray-900 mb-6">Statusi i porosisë</h2>
              <div className="space-y-0">
                {STATUS_STEPS.map((step, i) => {
                  const isDone = i <= statusIndex
                  const isCurrent = i === statusIndex
                  return (
                    <div key={step.key} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={cn(
                            "w-9 h-9 rounded-full flex items-center justify-center transition-all",
                            isDone
                              ? "bg-primary text-primary-foreground"
                              : "bg-gray-100 text-gray-400"
                          )}
                        >
                          {isDone ? (
                            <CheckCircle2 size={18} />
                          ) : (
                            <span className="text-xs font-bold">{i + 1}</span>
                          )}
                        </div>
                        {i < STATUS_STEPS.length - 1 && (
                          <div
                            className={cn(
                              "w-0.5 flex-1 my-1 transition-all",
                              isDone ? "bg-primary" : "bg-gray-100"
                            )}
                          />
                        )}
                      </div>
                      <div className="pb-8">
                        <p
                          className={cn(
                            "text-sm font-medium",
                            isCurrent
                              ? "text-primary"
                              : isDone
                                ? "text-gray-900"
                                : "text-gray-400"
                          )}
                        >
                          {step.label}
                        </p>
                        {isCurrent && (
                          <p className="text-xs text-gray-400 mt-0.5">Statusi aktual</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Items */}
          <div className="p-6 rounded-2xl border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-4">Produktet</h2>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className="w-10 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400 font-semibold shrink-0">
                    {item.quantity}×
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 line-clamp-1">{item.productName}</p>
                    <p className="text-xs text-gray-400">
                      {item.color}
                      {item.size ? ` • Madhësia ${item.size}` : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Nëntotali</span>
                <span>€{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Transporti</span>
                <span>€{order.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 pt-1">
                <span>Totali</span>
                <span>€{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Button asChild variant="outline" className="w-full">
            <Link href="/contact">
              Keni pyetje? Na kontaktoni <ChevronRight size={16} />
            </Link>
          </Button>
        </div>
      )}

      {!order && !error && (
        <div className="text-center py-10">
          <PackageSearch size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-400 text-sm">
            Kodi e gjeni në ekranin e konfirmimit pas porositjes ose në email.
          </p>
        </div>
      )}
    </div>
  )
}
