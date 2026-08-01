"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  LogOut,
  Package,
  User,
  Heart,
  ChevronRight,
  Check,
  Loader2,
  LayoutDashboard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import type { Order } from "@/lib/data"

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  pending: { label: "Në pritje", className: "bg-yellow-100 text-yellow-800" },
  processing: { label: "Në përpunim", className: "bg-blue-100 text-blue-800" },
  shipped: { label: "Dërguar", className: "bg-purple-100 text-purple-800" },
  delivered: { label: "Dorëzuar", className: "bg-green-100 text-green-800" },
  cancelled: { label: "Anuluar", className: "bg-red-100 text-red-800" },
}

export function ProfileClient({
  email,
  firstName,
  lastName,
  phone,
  isAdmin,
  orders,
  initialTab = "account",
}: {
  email: string
  firstName: string
  lastName: string
  phone: string
  isAdmin: boolean
  orders: Order[]
  initialTab?: "account" | "orders" | "favorites"
}) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"account" | "orders" | "favorites">(initialTab)
  const [form, setForm] = useState({ firstName, lastName, phone })
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, ...form }),
      })
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const TABS = [
    { id: "account" as const, label: "Llogaria", icon: User },
    { id: "orders" as const, label: "Porositë", icon: Package },
    { id: "favorites" as const, label: "Të preferuarat", icon: Heart },
  ]

  return (
    <div className="grid md:grid-cols-4 gap-8">
      {/* Sidebar */}
      <div className="md:col-span-1 space-y-1">
        <div className="p-4 rounded-xl bg-gray-50 mb-4">
          <p className="font-semibold text-gray-900">
            {firstName} {lastName}
          </p>
          <p className="text-sm text-gray-500 truncate">{email}</p>
          {isAdmin && (
            <Link
              href="/admin"
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <LayoutDashboard size={16} /> Paneli i Adminit
            </Link>
          )}
        </div>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-primary/5 text-primary"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
            {tab.id === "orders" && orders.length > 0 && (
              <span className="ml-auto text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">
                {orders.length}
              </span>
            )}
          </button>
        ))}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut size={18} /> Dil
        </button>
      </div>

      {/* Content */}
      <div className="md:col-span-3">
        {activeTab === "account" && (
          <form onSubmit={handleSave} className="max-w-md space-y-4 p-6 rounded-2xl border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Të dhënat e llogarisë</h2>
            <div className="space-y-2">
              <Label htmlFor="firstName">Emri</Label>
              <Input
                id="firstName"
                value={form.firstName}
                onChange={e => setForm({ ...form, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Mbiemri</Label>
              <Input
                id="lastName"
                value={form.lastName}
                onChange={e => setForm({ ...form, lastName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefoni</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="+383 44 000 000"
              />
            </div>
            <Button type="submit" disabled={saving} className="w-full h-11 rounded-xl">
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : saved ? (
                <>
                  <Check size={18} /> U ruajt!
                </>
              ) : (
                "Ruaj ndryshimet"
              )}
            </Button>
          </form>
        )}

        {activeTab === "orders" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Porositë e mia</h2>
            {orders.length === 0 ? (
              <div className="text-center py-16 p-6 rounded-2xl border border-gray-100">
                <Package size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 mb-4">Nuk keni asnjë porosi ende.</p>
                <Button asChild>
                  <Link href="/women">Shko te Produktet</Link>
                </Button>
              </div>
            ) : (
              orders.map(order => {
                const status = STATUS_LABELS[order.status] || STATUS_LABELS.pending
                return (
                  <div key={order.id} className="p-6 rounded-2xl border border-gray-100">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString("sq-AL", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <span className={`text-xs font-semibold rounded-full px-3 py-1 ${status.className}`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.productName} × {item.quantity}
                          </span>
                          <span className="font-medium">€{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
                      <span className="text-gray-500 text-sm">
                        {order.paymentMethod} • {order.country}
                      </span>
                      <span className="font-bold text-primary">€{order.total.toFixed(2)}</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {activeTab === "favorites" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Të preferuarat</h2>
            <p className="text-sm text-gray-400">
              <Link href="/women" className="text-primary hover:underline inline-flex items-center gap-1">
                Shiko produktet <ChevronRight size={14} />
              </Link>{" "}
              — përdorni zemrën ♥ në çdo produkt për ta shtuar këtu.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
