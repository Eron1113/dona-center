"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Order } from "@/lib/data"

const STATUSES: Order["status"][] = ["pending", "processing", "shipped", "delivered", "cancelled"]

export function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string
  currentStatus: Order["status"]
}) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [saving, setSaving] = useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as Order["status"]
    setStatus(next)
    setSaving(true)
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: next }),
      })
      if (!res.ok) throw new Error("Dështoi")
      router.refresh()
    } catch {
      setStatus(currentStatus)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {saving && <span className="text-xs text-gray-400">Duke ruajtur...</span>}
      <select
        value={status}
        onChange={handleChange}
        className="text-sm border-2 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        {STATUSES.map(s => (
          <option key={s} value={s} className="capitalize">
            {s}
          </option>
        ))}
      </select>
    </div>
  )
}
