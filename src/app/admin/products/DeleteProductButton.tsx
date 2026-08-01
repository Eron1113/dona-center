"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Loader2 } from "lucide-react"

export function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Jeni i sigurt që doni ta fshini këtë produkt?")) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/products?id=${productId}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Fshirja dështoi")
      router.refresh()
    } catch {
      alert("Nuk u arrit të fshihej produkti")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all"
      aria-label="Fshi"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
    </button>
  )
}
